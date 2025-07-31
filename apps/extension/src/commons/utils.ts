import { type ClassValue, clsx } from "clsx";
import { type DBSchema, openDB } from "idb";
import { twMerge } from "tailwind-merge";

import defaultKanjiFilterRules from "@/assets/rules/filter.json";
import defaultSelectorRules from "@/assets/rules/selector.json";

import {
  DisplayMode,
  type ExtMessageEvent,
  ExtStorage,
  ExtStorageChange,
  type FilterRule,
  FuriganaType,
  type GeneralSettings,
  type MoreSettings,
  SelectMode,
  type SelectorRule,
  type StorageChangeEvent,
} from "./constants";

export const toStorageKey = (event: StorageChangeEvent) => {
  switch (event) {
    case ExtStorageChange.ToggleKanjiFilter:
      return ExtStorage.KanjiFilter;
    case ExtStorageChange.SwitchDisplayMode:
      return ExtStorage.DisplayMode;
    case ExtStorageChange.AdjustFontColor:
      return ExtStorage.FontColor;
    case ExtStorageChange.AdjustFontSize:
      return ExtStorage.FontSize;
    case ExtStorageChange.SwitchFuriganaType:
      return ExtStorage.FuriganaType;
    case ExtStorageChange.SwitchSelectMode:
      return ExtStorage.SelectMode;
    case ExtStorageChange.ToggleAutoMode:
      return ExtStorage.AutoMode;
  }
};

/**
 * Some pages are unable to inject content scripts,
 * so it is not possible to register a message listener with the page,
 * such as `chrome://newtab` and `chrome.google.com`, and this error on those sites is a noise.
 */
export const sendMessage = async (id: number, event: ExtMessageEvent) => {
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

/**
 * Changing this key will result in destructive changes, so it cannot be modified.
 */
export const customSelectors = storage.defineItem<SelectorRule[]>("local:customRules", {
  version: 1,
  fallback: defaultSelectorRules,
});

export const DB = {
  name: "kanjiFilterDB",
  version: 1,
  onlyTable: "kanjiFilterTable",
} as const;
interface KanjiFilterDB extends DBSchema {
  [DB.onlyTable]: {
    key: string;
    value: FilterRule;
  };
}

export const getKanjiFilterDB = async () => {
  const db = await openDB<KanjiFilterDB>(DB.name, DB.version, {
    /**
     * @param transaction
     * Don't use `db.transaction(...)`, the upgrade callback will run a version change transaction,
     * and new transactions can't be created until this transaction ends.
     */
    upgrade(db, _, __, transaction) {
      db.createObjectStore(DB.onlyTable, { keyPath: "kanji" });
      const store = transaction.objectStore(DB.onlyTable);
      for (const rule of defaultKanjiFilterRules) {
        store.put(rule);
      }
    },
  });
  return db;
};

export function cn(...args: ClassValue[]) {
  return twMerge(clsx(args));
}
