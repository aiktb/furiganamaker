import { registerOnCommand } from "./listeners/onCommand";
import { registerOnCtxMenuClick } from "./listeners/onCtxMenuClick";
import { registerOnGetKanjiMarksMessage } from "./listeners/onGetKanjiMarksMessage";
import { registerOnGetSelector } from "./listeners/onGetSelectorMessage";
import { registerOnInstalled } from "./listeners/onInstalled";
import { registerOnMarkActiveMessage } from "./listeners/onMarkActiveMessage";

export default defineBackground({
  type: "module",
  // Service worker must synchronous, not support async function.
  main() {
    registerOnInstalled();
    registerOnCommand();
    registerOnCtxMenuClick();

    // chrome.runtime.onMessage.addListener(...)
    registerOnGetKanjiMarksMessage();
    registerOnGetSelector();
    registerOnMarkActiveMessage();
  },
});
