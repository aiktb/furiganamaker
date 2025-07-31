export const FURIGANA_CLASS = "--furigana--";

export const ExtMessageEvent = {
  AddFurigana: "addFurigana",
  MarkActiveTab: "markActiveTab",
  MarkDisabledTab: "markDisabledTab",
  ModifyKanjiFilter: "modifyKanjiFilter",
} as const;
export type ExtMessageEvent = (typeof ExtMessageEvent)[keyof typeof ExtMessageEvent];

export const ExtStorageChange = {
  ToggleAutoMode: "toggleAutoMode",
  ToggleKanjiFilter: "toggleKanjiFilter",
  SwitchDisplayMode: "switchDisplayMode",
  SwitchFuriganaType: "switchFuriganaType",
  SwitchSelectMode: "switchSelectMode",
  AdjustFontSize: "adjustFontSize",
  AdjustFontColor: "adjustFontColor",
} as const;
export type ExtStorageChange = (typeof ExtStorageChange)[keyof typeof ExtStorageChange];

export const ExtStorage = {
  AutoMode: "autoMode",
  KanjiFilter: "kanjiFilter",
  DisplayMode: "displayMode",
  FuriganaType: "furiganaType",
  SelectMode: "selectMode",
  FontSize: "fontSize",
  FontColor: "fontColor",
  Language: "language",
  DisableWarning: "disableWarning",
  ColoringKanji: "coloringKanji",
  ExcludeSites: "excludeSites",
  SelectorRules: "selectorRules",
  FilterRules: "filterRules",
} as const;
export type ExtStorage = (typeof ExtStorage)[keyof typeof ExtStorage];

export const DisplayMode = {
  Always: "always show",
  Never: "never show",
  Hover: "hover gap",
  HoverNoGap: "hover no-gap",
  HoverMask: "hover mask",
} as const;
export type DisplayMode = (typeof DisplayMode)[keyof typeof DisplayMode];

export const FuriganaType = {
  Hiragana: "hiragana",
  Katakana: "katakana",
  Romaji: "romaji",
} as const;
export type FuriganaType = (typeof FuriganaType)[keyof typeof FuriganaType];

export const SelectMode = {
  Default: "default",
  Original: "original",
  Parentheses: "parentheses",
} as const;
export type SelectMode = (typeof SelectMode)[keyof typeof SelectMode];

/**
 * Can only be modified on the Popup page.
 */
export interface GeneralSettings {
  [ExtStorage.AutoMode]: boolean;
  [ExtStorage.KanjiFilter]: boolean;
  [ExtStorage.DisplayMode]: DisplayMode;
  [ExtStorage.FuriganaType]: FuriganaType;
  [ExtStorage.SelectMode]: SelectMode;
  [ExtStorage.FontSize]: number;
  [ExtStorage.FontColor]: string;
}

/**
 * Can only be modified on the Options page.
 */
export interface MoreSettings {
  /**
   * If undefined, the detected system language is used.
   */
  [ExtStorage.Language]: string | undefined;
  [ExtStorage.DisableWarning]: boolean;
  [ExtStorage.ColoringKanji]: boolean;
  [ExtStorage.ExcludeSites]: string[];
}

export interface SelectorRule {
  domain: string; // This field is unique.
  selector: string;
  active: boolean;
}

export type FilterRule = {
  kanji: string;
  yomikatas?: string[] | undefined; // If undefined, it matches all yomikatas.
};

export type StorageChangeEvent =
  | typeof ExtStorageChange.ToggleKanjiFilter
  | typeof ExtStorageChange.SwitchDisplayMode
  | typeof ExtStorageChange.AdjustFontColor
  | typeof ExtStorageChange.AdjustFontSize
  | typeof ExtStorageChange.SwitchFuriganaType
  | typeof ExtStorageChange.SwitchSelectMode
  | typeof ExtStorageChange.ToggleAutoMode;
