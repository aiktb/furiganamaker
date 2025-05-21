import defaultSelectorRules from "@/assets/rules/selector.json";
import {
  DisplayMode,
  ExtEvent,
  ExtStorage,
  FuriganaType,
  type GeneralSettings,
  type MoreSettings,
  SelectMode,
  type SelectorRule,
  type StorageChangeEvent,
} from "./constants";

export const toStorageKey = (event: StorageChangeEvent) => {
  switch (event) {
    case ExtEvent.ToggleKanjiFilter:
      return ExtStorage.KanjiFilter;
    case ExtEvent.SwitchDisplayMode:
      return ExtStorage.DisplayMode;
    case ExtEvent.AdjustFontColor:
      return ExtStorage.FontColor;
    case ExtEvent.AdjustFontSize:
      return ExtStorage.FontSize;
    case ExtEvent.SwitchFuriganaType:
      return ExtStorage.FuriganaType;
    case ExtEvent.SwitchSelectMode:
      return ExtStorage.SelectMode;
    case ExtEvent.ToggleAutoMode:
      return ExtStorage.AutoMode;
  }
};

/**
 * Some pages are unable to inject content scripts,
 * so it is not possible to register a message listener with the page,
 * such as `chrome://newtab` and `chrome.google.com`, and this error on those sites is a noise.
 */
export const sendMessage = async (id: number, event: ExtEvent) => {
  try {
    await browser.tabs.sendMessage(id, event);
  } catch (error) {
    if (
      !(error instanceof Error) ||
      error.message !== "Could not establish connection. Receiving end does not exist."
    ) {
      throw error;
    }
  }
};

export const generalSettings = storage.defineItem<GeneralSettings>("local:generalSettings", {
  version: 1,
  fallback: {
    [ExtStorage.AutoMode]: true,
    [ExtStorage.KanjiFilter]: false,
    [ExtStorage.DisplayMode]: DisplayMode.Always,
    [ExtStorage.FuriganaType]: FuriganaType.Hiragana,
    [ExtStorage.SelectMode]: SelectMode.Default,
    [ExtStorage.FontSize]: 75,
    [ExtStorage.FontColor]: "currentColor",
  },
});

export async function setGeneralSettings<K extends keyof GeneralSettings>(
  key: K,
  value: GeneralSettings[K],
) {
  await generalSettings.setValue({ ...(await generalSettings.getValue()), [key]: value });
}

export async function getGeneralSettings<K extends keyof GeneralSettings>(key: K) {
  return (await generalSettings.getValue())[key];
}

export const moreSettings = storage.defineItem<MoreSettings>("local:moreSettings", {
  version: 1,
  fallback: {
    [ExtStorage.Language]: undefined,
    [ExtStorage.DisableWarning]: false,
    [ExtStorage.ColoringKanji]: false,
    [ExtStorage.ExcludeSites]: ["example.com"],
  },
});

export async function setMoreSettings<K extends keyof MoreSettings>(
  key: K,
  value: MoreSettings[K],
) {
  await moreSettings.setValue({ ...(await moreSettings.getValue()), [key]: value });
}

export async function getMoreSettings<K extends keyof MoreSettings>(key: K) {
  return (await moreSettings.getValue())[key];
}

export const customRules = storage.defineItem<SelectorRule[]>("local:customRules", {
  version: 1,
  fallback: defaultSelectorRules,
});
