import picomatch from "picomatch/posix";
import ReactDOM from "react-dom/client";

import { addFurigana } from "@/commons/addFurigana";
import { ExtEvent, ExtStorage } from "@/commons/constants";
import { sendMessage } from "@/commons/message";
import { getGeneralSettings, getMoreSettings } from "@/commons/utils";

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
    const elements = Array.from(document.querySelectorAll(selector));

    function getTextLength() {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let textLength = 0;
      while (walker.nextNode()) {
        if (!["SCRIPT", "STYLE"].includes(walker.currentNode.parentElement!.tagName)) {
          textLength += walker.currentNode.textContent!.length;
        }
      }

      return textLength;
    }
    const textLength = getTextLength();
    const formatter = new Intl.NumberFormat(browser.i18n.getUILanguage());
    const formattedTextLength = formatter.format(textLength);
    const warningDisabled = await getMoreSettings(ExtStorage.DisableWarning);
    if (!warningDisabled && textLength > 30000 && elements.length > 0) {
      // Reflow on a huge page causes severe page freezes and even the browser becomes unresponsive. (issue#16)
      const ui = await createShadowRootUi(ctx, {
        name: "auto-mode-is-disabled-warning",
        position: "inline",
        anchor: "body",
        onMount(container) {
          const wrapper = document.createElement("div");
          container.appendChild(wrapper);
          const root = ReactDOM.createRoot(wrapper);

          root.render(
            <div className="-translate-x-1/2 fixed top-5 left-1/2 z-[2147483647] flex transform gap-2.5 rounded-md border-2 border-[rgb(255,237,213)] bg-[rgb(255,247,237)] p-4 font-bold text-[rgb(154,52,18)]">
              <i className="i-tabler-alert-triangle-filled size-8" />
              <span>{browser.i18n.getMessage("contentScriptWarning", formattedTextLength)}</span>
            </div>,
          );

          return { root, wrapper };
        },
        onRemove: (elements) => {
          elements?.root.unmount();
          elements?.wrapper.remove();
        },
      });
      ui.mount();
      setTimeout(() => {
        if (ui.uiContainer.matches(":hover")) {
          ui.uiContainer.addEventListener("mouseleave", () => {
            ui.remove();
          });
        } else {
          ui.remove();
        }
      }, 3000);
      browser.runtime.sendMessage(ExtEvent.MarkDisabledTab);
      return;
    }

    // Observer will not observe the element that is loaded for the first time on the page,
    // so it needs to execute `addFurigana` once immediately.
    if (elements.length) {
      browser.runtime.sendMessage(ExtEvent.MarkActiveTab);
      addFurigana(...elements);
    }

    const isElement = (node: Node): node is Element => node.nodeType === Node.ELEMENT_NODE;

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
  },
});
