import picomatch from "picomatch/posix";
import { addFurigana } from "@/commons/addFurigana";
import { ExtEvent, ExtStorage } from "@/commons/constants";
import { sendMessage } from "@/commons/message";
import { getGeneralSettings, getMoreSettings } from "@/commons/utils";

export default defineContentScript({
  matches: ["*://*/*"],
  runAt: "document_idle",

  async main() {
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
    // Reflow on a huge page causes severe page freezes and even the browser becomes unresponsive. (issue#16)
    const textLength = getTextLength();
    const warningDisabled = await getMoreSettings(ExtStorage.DisableWarning);
    if (!warningDisabled && textLength > 30000 && elements.length > 0) {
      showWarning(textLength);
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

function showWarning(textLength: number) {
  const warningAttrs: Partial<CSSStyleDeclaration> = {
    position: "fixed",
    display: "flex",
    gap: "10px",
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: String(2 ** 32 - 1),
    fontWeight: "bold",
    color: "rgb(154,52,18)",
    backgroundColor: "rgb(255, 247, 237)",
    padding: "15px",
    borderRadius: "10px",
    border: "2px solid rgb(255, 237, 213)",
  };

  const warning = document.createElement("div");
  Object.assign(warning.style, warningAttrs);
  const icon = document.createElement("div");
  icon.textContent = "⚠";
  const text = document.createElement("span");

  text.textContent = browser.i18n.getMessage("contentScriptWarning", textLength.toString());
  warning.appendChild(icon);
  warning.appendChild(text);
  document.body.appendChild(warning);
  setTimeout(() => {
    if (warning.matches(":hover")) {
      warning.addEventListener("mouseleave", () => {
        warning.remove();
      });
    } else {
      warning.remove();
    }
  }, 3000);
}
