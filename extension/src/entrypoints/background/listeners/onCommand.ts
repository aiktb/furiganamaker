import type { Command } from "@@/wxt.config";
import { match } from "ts-pattern";
import { DisplayMode, ExtStorage } from "@/constants";
import { sendMessage } from "@/message";
import { getOptionsUrl } from "@/optionsUrl";
import { getGeneralSettings, setGeneralSettings } from "@/storage/settings";

export const registerOnCommand = () => {
  // Please see `wxt.config.ts` for a list of shortcut keys.
  browser.commands.onCommand.addListener(async (command, tab) => {
    const tabId = tab!.id!;

    await match(command as Command)
      .with("addFurigana", async () => {
        await sendMessage("addFurigana", undefined, tabId);
      })
      .with("toggleAutoMode", async () => {
        const autoMode = await getGeneralSettings(ExtStorage.AutoMode);
        await setGeneralSettings(ExtStorage.AutoMode, !autoMode);
      })
      .with("toggleKanjiFilter", async () => {
        const kanjiFilter = await getGeneralSettings(ExtStorage.KanjiFilter);
        await setGeneralSettings(ExtStorage.KanjiFilter, !kanjiFilter);
      })
      .with("toggleFuriganaVisibility", async () => {
        const displayMode = await getGeneralSettings(ExtStorage.DisplayMode);
        const nextDisplayMode =
          displayMode === DisplayMode.Never ? DisplayMode.Always : DisplayMode.Never;
        await setGeneralSettings(ExtStorage.DisplayMode, nextDisplayMode);
      })
      .with("openPlaygroundPage", () => {
        browser.tabs.create({ url: getOptionsUrl("/playground") });
      })
      .with("openOptionsPage", () => {
        browser.runtime.openOptionsPage();
      })
      .exhaustive();
  });
};
