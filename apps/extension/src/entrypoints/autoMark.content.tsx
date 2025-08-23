/**
 * The dark mode and i18n settings in this content script cannot stay
 * in sync with the extension’s internal settings.
 */
import picomatch from "picomatch/posix";
import { StrictMode, useRef } from "react";
import { createRoot } from "react-dom/client";
import { addFurigana } from "@/commons/addFurigana";
import { ExtEvent, ExtStorage } from "@/commons/constants";
import { sendMessage } from "@/commons/message";
import { cn, getGeneralSettings, getMoreSettings, setMoreSettings } from "@/commons/utils";

import "@/tailwind.css";

export default defineContentScript({
  matches: ["*://*/*"],
  cssInjectionMode: "ui",
  runAt: "document_idle",

  async main(ctx) {
    const autoModeIsEnabled = await getGeneralSettings(ExtStorage.AutoMode);
    const excludeSites = await getMoreSettings(ExtStorage.ExcludeSites);
    const isMatch = picomatch(excludeSites, { nocase: true });
    const isExcluded = isMatch(location.hostname);
    if (!autoModeIsEnabled || isExcluded) {
      /**
       * If the user does not enable the extension, the extension will not attempt to add furigana to the page.
       * The page must be refreshed after switching the extension to the enabled state.
       */
      return;
    }

    const customRule = await sendMessage("getSelector", { domain: location.hostname });
    const selector = customRule.selector || "[lang='ja'], [lang='ja-JP']";
    const initialElements = Array.from(document.querySelectorAll(selector));

    function getTextLength() {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let textLength = 0;
      while (walker.nextNode()) {
        const parent = walker.currentNode.parentElement;
        if (parent && !["SCRIPT", "STYLE"].includes(parent.tagName)) {
          textLength += walker.currentNode.textContent?.length ?? 0;
        }
      }

      return textLength;
    }
    const textLength = getTextLength();
    const formatter = new Intl.NumberFormat(browser.i18n.getUILanguage());
    const formattedTextLength = formatter.format(textLength);
    const warningDisabled = await getMoreSettings(ExtStorage.DisableWarning);
    const alwaysRunSites = await getMoreSettings(ExtStorage.AlwaysRunSites);
    const isNotWarningDisabled = !warningDisabled;
    const isNotAlwaysRunSite = !alwaysRunSites.includes(location.hostname);
    const MY_THINKING_BIG_PAGE_SIZE = 30000;
    const isPageTooLarge = textLength > MY_THINKING_BIG_PAGE_SIZE;
    const hasInitialElements = initialElements.length > 0;
    if (warningDisabled && isPageTooLarge) {
      browser.runtime.sendMessage(ExtEvent.MarkDisabledTab);
      return;
    }
    if (isNotWarningDisabled && isNotAlwaysRunSite && isPageTooLarge && hasInitialElements) {
      // Reflow on a huge page causes severe page freezes and even the browser becomes unresponsive. (issue#16)
      const ui = await createShadowRootUi(ctx, {
        name: "auto-mode-is-disabled-warning",
        position: "inline",
        anchor: "body",
        onMount(container) {
          const wrapper = document.createElement("div");
          container.appendChild(wrapper);
          const root = createRoot(wrapper);
          root.render(
            <StrictMode>
              <PageTooLargeWarningDialog
                onClose={() => {
                  ui.remove();
                  browser.runtime.sendMessage(ExtEvent.MarkDisabledTab);
                }}
                onRunOnce={() => {
                  ui.remove();
                  handleAndObserveJapaneseElements(initialElements, selector);
                }}
                onAlwaysRun={async () => {
                  ui.remove();
                  handleAndObserveJapaneseElements(initialElements, selector);
                  await setMoreSettings(ExtStorage.AlwaysRunSites, [
                    ...(await getMoreSettings(ExtStorage.AlwaysRunSites)),
                    location.hostname,
                  ]);
                }}
                formattedTextLength={formattedTextLength}
              />
            </StrictMode>,
          );
          return { root, wrapper };
        },
        onRemove: (elements) => {
          elements?.root.unmount();
          elements?.wrapper.remove();
        },
      });
      ui.mount();
      return;
    }

    handleAndObserveJapaneseElements(initialElements, selector);
  },
});

interface PageTooLargeWarningDialogProps {
  onClose: () => void;
  onRunOnce: () => void;
  onAlwaysRun: () => void;
  formattedTextLength: string;
}
const PageTooLargeWarningDialog = ({
  onClose,
  onRunOnce,
  onAlwaysRun,
  formattedTextLength,
}: PageTooLargeWarningDialogProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className={cn(
        "-translate-x-1/2 fixed top-5 left-1/2 z-[2147483647] flex max-w-xl transform flex-col rounded-2xl bg-white p-4 text-base text-slate-800 shadow dark:bg-slate-900 dark:text-white",
        window.matchMedia("(prefers-color-scheme: dark)").matches && "dark",
      )}
    >
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-1 font-bold text-lg">
          <i className="i-tabler-alert-circle-filled size-6 text-sky-500" />
          <span>{browser.i18n.getMessage("contentScriptWarningTitle")}</span>
        </h1>
        <button
          className="flex size-6 cursor-pointer items-center justify-center rounded-md transition hover:bg-slate-100 hover:text-sky-500 dark:hover:bg-slate-800"
          onClick={onClose}
        >
          <i className="i-tabler-x size-4" />
        </button>
      </div>
      <p className="mt-2.5">
        {browser.i18n.getMessage("contentScriptWarningDesc1", formattedTextLength)}
      </p>
      <div>
        <button
          className="cursor-pointer text-sky-500 underline decoration-current transition hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-500"
          // The browser automatically blocks navigation to URLs with the `chrome-extension://` prefix, so the `<a>` tag cannot be used.
          // Content scripts do not have permission to run `browser.runtime.openOptionsPage`, so the request needs to be forwarded to the background.
          onClick={() => browser.runtime.sendMessage(ExtEvent.OpenOptionsPage)}
        >
          {browser.i18n.getMessage("contentScriptWarningDesc2")}
        </button>
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <button
          className="inline-flex cursor-pointer justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 font-bold text-blue-900 text-sm transition hover:bg-blue-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          onClick={onRunOnce}
        >
          {browser.i18n.getMessage("btnRunOnce")}
        </button>
        <button
          className="inline-flex cursor-pointer justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 font-bold text-slate-900 text-sm transition hover:bg-red-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:bg-red-800 dark:text-slate-200 dark:hover:bg-red-900"
          onClick={onAlwaysRun}
        >
          {browser.i18n.getMessage("btnAlwaysRun")}
        </button>
      </div>
    </div>
  );
};

const isElement = (node: Node): node is Element => node.nodeType === Node.ELEMENT_NODE;
function handleAndObserveJapaneseElements(initialElements: Element[], selector: string) {
  // Observer will not observe the element that is loaded for the first time on the page,
  // so it needs to execute `addFurigana` once immediately.
  if (initialElements.length > 0) {
    browser.runtime.sendMessage(ExtEvent.MarkActiveTab);
    addFurigana(...initialElements);
  }
  const observer = new MutationObserver((records) => {
    const japaneseElements = records
      .flatMap((record) => Array.from(record.addedNodes))
      .filter(isElement)
      .flatMap((element) => Array.from(element.querySelectorAll(selector)));

    if (japaneseElements.length) {
      browser.runtime.sendMessage(ExtEvent.MarkActiveTab);
      addFurigana(...japaneseElements);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}
