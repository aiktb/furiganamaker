export const FURIGANA_CLASS = "--furigana--";

export const ExtEvent = {
  AddFurigana: "addFurigana",
  ToggleAutoMode: "toggleAutoMode",
  ToggleKanjiFilter: "toggleKanjiFilter",
  SwitchDisplayMode: "switchDisplayMode",
  SwitchFuriganaType: "switchFuriganaType",
  SwitchSelectMode: "switchSelectMode",
  AdjustFontSize: "adjustFontSize",
  AdjustFontColor: "adjustFontColor",
  MarkActiveTab: "markActiveTab",
  MarkDisabledTab: "markDisabledTab",
  ModifyKanjiFilter: "modifyKanjiFilter",
} as const;
export type ExtEvent = (typeof ExtEvent)[keyof typeof ExtEvent];

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

export type StyleEvent =
  | typeof ExtEvent.ToggleAutoMode
  | typeof ExtEvent.SwitchDisplayMode
  | typeof ExtEvent.SwitchSelectMode
  | typeof ExtEvent.AdjustFontSize
  | typeof ExtEvent.AdjustFontColor
  | typeof ExtEvent.ToggleKanjiFilter;

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
 * Only used in Popup pages.
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
 * Only used in Options pages.
 */
export interface MoreSettings {
  /**
   * If null, the detected system language is used.
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
  | typeof ExtEvent.ToggleKanjiFilter
  | typeof ExtEvent.SwitchDisplayMode
  | typeof ExtEvent.AdjustFontColor
  | typeof ExtEvent.AdjustFontSize
  | typeof ExtEvent.SwitchFuriganaType
  | typeof ExtEvent.SwitchSelectMode
  | typeof ExtEvent.ToggleAutoMode;
