import { isNotNil } from "es-toolkit";
import { useTranslation } from "react-i18next";
import ColorPickerIcon from "@/assets/icons/ColorPicker.svg?react";
import CursorOutlineIcon from "@/assets/icons/CursorDefault.svg?react";
import CursorTextIcon from "@/assets/icons/CursorText.svg?react";
import EyeIcon from "@/assets/icons/Eye.svg?react";
import FilterIcon from "@/assets/icons/Filter.svg?react";
import FontSizeIcon from "@/assets/icons/FontSize.svg?react";
import GithubIcon from "@/assets/icons/Github.svg?react";
import HeartIcon from "@/assets/icons/Heart.svg?react";
import HiraganaIcon from "@/assets/icons/Hiragana.svg?react";
import PowerIcon from "@/assets/icons/Power.svg?react";
import SettingIcon from "@/assets/icons/Setting.svg?react";
import ShareIcon from "@/assets/icons/Share.svg?react";
import { DisplayMode, ExtEvent, ExtStorage, FuriganaType, SelectMode } from "@/commons/constants";
import { cn, sendMessage } from "@/commons/utils";
import { Button } from "./components/Button";
import { CheckBox } from "./components/CheckBox";
import { ColorPicker } from "./components/ColorPicker";
import { Link } from "./components/Link";
import { RangeSlider } from "./components/RangeSlider";
import { Select } from "./components/Select";
import { SharedCard } from "./components/SharedCard";
import { useGeneralSettingsStore } from "./store";

export function Root() {
  const autoModeEnabled = useGeneralSettingsStore((state) => state[ExtStorage.AutoMode]);
  const kanjiFilterEnabled = useGeneralSettingsStore((state) => state[ExtStorage.KanjiFilter]);
  const selectedDisplayMode = useGeneralSettingsStore((state) => state[ExtStorage.DisplayMode]);
  const selectedFuriganaType = useGeneralSettingsStore((state) => state[ExtStorage.FuriganaType]);
  const selectedSelectMode = useGeneralSettingsStore((state) => state[ExtStorage.SelectMode]);
  const fontSize = useGeneralSettingsStore((state) => state[ExtStorage.FontSize]);
  const fontColor = useGeneralSettingsStore((state) => state[ExtStorage.FontColor]);
  const toggleAutoMode = useGeneralSettingsStore((state) => state.toggleAutoMode);
  const toggleKanjiFilter = useGeneralSettingsStore((state) => state.toggleKanjiFilter);
  const setDisplayMode = useGeneralSettingsStore((state) => state.setDisplayMode);
  const setFuriganaType = useGeneralSettingsStore((state) => state.setFuriganaType);
  const setSelectMode = useGeneralSettingsStore((state) => state.setSelectMode);
  const setFontSize = useGeneralSettingsStore((state) => state.setFontSize);
  const setFontColor = useGeneralSettingsStore((state) => state.setFontColor);
  const { t } = useTranslation();

  const displayModeOptions = [
    { label: t("optionAlwaysShow"), value: DisplayMode.Always },
    { label: t("optionNeverShow"), value: DisplayMode.Never },
    { label: t("optionHoverGap"), value: DisplayMode.Hover },
    { label: t("optionHoverNoGap"), value: DisplayMode.HoverNoGap },
    { label: t("optionHoverMask"), value: DisplayMode.HoverMask },
  ];
  const furiganaTypeOptions = [
    { label: t("optionHiragana"), value: FuriganaType.Hiragana },
    { label: t("optionKatakana"), value: FuriganaType.Katakana },
    { label: t("optionRomaji"), value: FuriganaType.Romaji },
  ];
  const selectModeOptions = [
    { label: t("optionDefault"), value: SelectMode.Default },
    { label: t("optionOriginal"), value: SelectMode.Original },
    { label: t("optionParentheses"), value: SelectMode.Parentheses },
  ];

  type ACTIONTYPE =
    | { type: typeof ExtEvent.ToggleAutoMode; payload: boolean }
    | { type: typeof ExtEvent.ToggleKanjiFilter; payload: boolean }
    | { type: typeof ExtEvent.SwitchDisplayMode; payload: DisplayMode }
    | { type: typeof ExtEvent.SwitchFuriganaType; payload: FuriganaType }
    | { type: typeof ExtEvent.SwitchSelectMode; payload: SelectMode }
    | { type: typeof ExtEvent.AdjustFontSize; payload: number }
    | { type: typeof ExtEvent.AdjustFontColor; payload: string };

  const handleEventHappened = async (action: ACTIONTYPE) => {
    // Query all tabs
    const tabs = await browser.tabs.query({});
    const ids = tabs.map((tab) => tab.id).filter(isNotNil);
    await Promise.all(ids.map((id) => sendMessage(id, action.type)));
  };

  return (
    <menu className="space-y-2 border-sky-500 border-r-2 pr-1 font-sans">
      <MenuItem icon={<CursorOutlineIcon />}>
        <Button
          className="playwright-add-furigana-btn"
          tip={t("tipEscShortcut")}
          text={t("btnAddFurigana")}
          onClick={addFurigana}
        />
      </MenuItem>
      <MenuItem icon={<PowerIcon className={cn(autoModeEnabled && "text-sky-500")} />}>
        <CheckBox
          className="playwright-toggle-auto-mode"
          tip={t("tipRefreshPage")}
          text={t("toggleAutoMode")}
          checked={autoModeEnabled}
          onChange={(enabled) => {
            toggleAutoMode();
            handleEventHappened({ type: ExtEvent.ToggleAutoMode, payload: enabled });
          }}
        />
      </MenuItem>
      <MenuItem icon={<FilterIcon className={cn(kanjiFilterEnabled && "text-sky-500")} />}>
        <CheckBox
          className="playwright-toggle-kanji-filter"
          tip={t("tipFilterLevel")}
          text={t("toggleKanjiFilter")}
          checked={kanjiFilterEnabled}
          onChange={(enabled) => {
            toggleKanjiFilter();
            handleEventHappened({ type: ExtEvent.ToggleKanjiFilter, payload: enabled });
          }}
        />
      </MenuItem>
      <MenuItem icon={<EyeIcon />}>
        <Select
          className="playwright-switch-display-mode"
          selected={selectedDisplayMode}
          options={displayModeOptions}
          onChange={(selected) => {
            setDisplayMode(selected as DisplayMode);
            handleEventHappened({
              type: ExtEvent.SwitchDisplayMode,
              payload: selected as DisplayMode,
            });
          }}
        />
      </MenuItem>
      <MenuItem icon={<HiraganaIcon />}>
        <Select
          className="playwright-switch-furigana-type"
          selected={selectedFuriganaType}
          options={furiganaTypeOptions}
          onChange={(selected) => {
            setFuriganaType(selected as FuriganaType);
            handleEventHappened({
              type: ExtEvent.SwitchFuriganaType,
              payload: selected as FuriganaType,
            });
          }}
        />
      </MenuItem>
      <MenuItem icon={<CursorTextIcon />}>
        <Select
          className="playwright-switch-select-mode"
          tip={t("tipCopyText")}
          selected={selectedSelectMode}
          options={selectModeOptions}
          onChange={(selected) => {
            setSelectMode(selected as SelectMode);
            handleEventHappened({
              type: ExtEvent.SwitchSelectMode,
              payload: selected as SelectMode,
            });
          }}
        />
      </MenuItem>
      <MenuItem icon={<FontSizeIcon />}>
        <RangeSlider
          className="playwright-adjust-font-size-slider"
          value={fontSize}
          min={50}
          max={100}
          step={1}
          label={t("labelAdjustFont")}
          onChange={(value) => {
            setFontSize(value);
            handleEventHappened({ type: ExtEvent.AdjustFontSize, payload: value });
          }}
        />
      </MenuItem>
      <MenuItem icon={<ColorPickerIcon />}>
        <ColorPicker
          className="playwright-adjust-font-color-picker"
          color={fontColor}
          onChange={(color) => {
            setFontColor(color);
            handleEventHappened({ type: ExtEvent.AdjustFontColor, payload: color });
          }}
        />
      </MenuItem>
      <MenuItem icon={<SettingIcon />}>
        <Link tip={t("tipOpenOptions")} href="options.html" text={t("linkSettings")} />
      </MenuItem>
      <MenuItem icon={<GithubIcon />}>
        <Link
          tip={t("tipOpenIssue")}
          href="https://github.com/aiktb/furiganamaker/issues"
          text={t("linkFeedback")}
        />
      </MenuItem>
      <MenuItem icon={<HeartIcon />}>
        <Link
          tip={t("tipBuyMeACoffee")}
          href="https://www.buymeacoffee.com/aiktb"
          text={t("linkSponsor")}
        />
      </MenuItem>
      <MenuItem icon={<ShareIcon />}>
        <SharedCard />
      </MenuItem>
    </menu>
  );
}

async function addFurigana() {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  await sendMessage(tab!.id!, ExtEvent.AddFurigana);
}

interface MenuItemProps {
  children: React.ReactNode;
  icon: React.ReactNode;
}

function MenuItem({ children, icon }: MenuItemProps) {
  return (
    <li className="flex items-center gap-x-1">
      <div className="text-2xl">{icon}</div>
      {children}
    </li>
  );
}
