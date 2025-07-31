import { ExtMessageEvent } from "@/commons/constants";
import { sendMessage } from "@/commons/utils";

export const registerOnCtxMenuClick = () => {
  browser.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === ExtMessageEvent.AddFurigana) {
      await sendMessage(tab!.id!, ExtMessageEvent.AddFurigana);
    }
  });
};
