import { ExtEvent } from "@/commons/constants";
import { sendMessage } from "@/commons/utils";

export const registerOnCtxMenuClick = () => {
  browser.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === ExtEvent.AddFurigana) {
      await sendMessage(tab!.id!, ExtEvent.AddFurigana);
    }
  });
};
