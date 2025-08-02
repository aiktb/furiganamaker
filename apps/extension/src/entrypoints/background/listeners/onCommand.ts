import type { Command } from "@@/wxt.config";
import { DisplayMode, ExtEvent, ExtStorage } from "@/commons/constants";
import { getGeneralSettings, sendMessage, setGeneralSettings } from "@/commons/utils";

export const registerOnCommand = () => {
  // Please see `wxt.config.ts` for a list of shortcut keys.
  browser.commands.onCommand.addListener(async (command, tab) => {
    const tabId = tab!.id!;

    switch (command as Command) {
      case "addFurigana": {
        await sendMessage(tabId, ExtEvent.AddFurigana);
        break;
      }
      case "toggleAutoMode": {
        const autoMode = await getGeneralSettings(ExtStorage.AutoMode);
        await setGeneralSettings(ExtStorage.AutoMode, !autoMode);
        break;
      }
      case "toggleKanjiFilter": {
        const kanjiFilter = await getGeneralSettings(ExtStorage.KanjiFilter);
        await setGeneralSettings(ExtStorage.KanjiFilter, !kanjiFilter);
        await sendMessage(tabId, ExtEvent.ToggleKanjiFilter);
        break;
      }
      case "toggleFuriganaDisplay": {
        const displayMode = await getGeneralSettings(ExtStorage.DisplayMode);
        if (displayMode === DisplayMode.Always) {
          await setGeneralSettings(ExtStorage.DisplayMode, DisplayMode.Never);
          await sendMessage(tabId, ExtEvent.SwitchDisplayMode);
        } else {
          await setGeneralSettings(ExtStorage.DisplayMode, DisplayMode.Always);
          await sendMessage(tabId, ExtEvent.SwitchDisplayMode);
        }
        break;
      }
    }
  });
};
