import { Transition } from "@headlessui/react";
import { Suspense, use, useReducer } from "react";
import { useTranslation } from "react-i18next";

import {
  DisplayMode,
  ExtEvent,
  ExtStorage,
  FuriganaType,
  type GeneralSettings,
  SelectMode,
} from "@/commons/constants";
import { generalSettings, sendMessage, setGeneralSettings, toStorageKey } from "@/commons/utils";

import ColorPickerIcon from "@/assets/icons/ColorPicker.svg?react";
import CursorOutlineIcon from "@/assets/icons/CursorDefault.svg?react";
import CursorTextIcon from "@/assets/icons/CursorText.svg?react";
import EyeIcon from "@/assets/icons/Eye.svg?react";
import FilterIcon from "@/assets/icons/Filter.svg?react";
import FontSizeIcon from "@/assets/icons/FontSize.svg?react";
import GithubIcon from "@/assets/icons/Github.svg?react";
import HeartIcon from "@/assets/icons/Heart.svg?react";
import HiraganaIcon from "@/assets/icons/Hiragana.svg?react";
import Logo from "@/assets/icons/Logo.svg?react";
import PowerIcon from "@/assets/icons/Power.svg?react";
import SettingIcon from "@/assets/icons/Setting.svg?react";
import ShareIcon from "@/assets/icons/Share.svg?react";

import Button from "./components/Button";
import CheckBox from "./components/CheckBox";
import ColorPicker from "./components/ColorPicker";
import Link from "./components/Link";
import RangeSlider from "./components/RangeSlider";
import Select from "./components/Select";
import SharedCard from "./components/SharedCard";

export default function Popup() {
  return (
    <Suspense fallback={<Logo className="size-48" />}>
      <Transition
        as="div"
        appear
        show={true}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Menu configPromise={generalSettings.getValue()} />
      </Transition>
    </Suspense>
  );
}

async function addFurigana() {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  await sendMessage(tab!.id!, ExtEvent.AddFurigana);
}

type ACTIONTYPE =
  | { type: typeof ExtEvent.ToggleAutoMode; payload: boolean }
  | { type: typeof ExtEvent.ToggleKanjiFilter; payload: boolean }
  | { type: typeof ExtEvent.SwitchDisplayMode; payload: DisplayMode }
  | { type: typeof ExtEvent.SwitchFuriganaType; payload: FuriganaType }
  | { type: typeof ExtEvent.SwitchSelectMode; payload: SelectMode }
  | { type: typeof ExtEvent.AdjustFontSize; payload: number }
  | { type: typeof ExtEvent.AdjustFontColor; payload: string };

function reducer(state: GeneralSettings, action: ACTIONTYPE) {
  browser.tabs.query({ active: true, currentWindow: true }).then(async (tabs) => {
    await setGeneralSettings(toStorageKey(action.type), action.payload);
    const tabId = tabs[0]!.id!;
    await sendMessage(tabId, action.type);
  });

  switch (action.type) {
    case ExtEvent.ToggleAutoMode:
      return { ...state, [ExtStorage.AutoMode]: action.payload };
    case ExtEvent.ToggleKanjiFilter:
      return { ...state, [ExtStorage.KanjiFilter]: action.payload };
    case ExtEvent.SwitchDisplayMode:
      return { ...state, [ExtStorage.DisplayMode]: action.payload };
    case ExtEvent.SwitchFuriganaType:
      return { ...state, [ExtStorage.FuriganaType]: action.payload };
    case ExtEvent.SwitchSelectMode:
      return { ...state, [ExtStorage.SelectMode]: action.payload };
    case ExtEvent.AdjustFontSize:
      return { ...state, [ExtStorage.FontSize]: action.payload };
    case ExtEvent.AdjustFontColor:
      return { ...state, [ExtStorage.FontColor]: action.payload };
  }
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

function Menu({ configPromise }: { configPromise: Promise<GeneralSettings> }) {
  const [state, dispatch] = useReducer(reducer, use(configPromise));
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

  return (
    <menu className="space-y-2 border-sky-500 border-r-2 pr-1 font-sans">
      <MenuItem icon={<CursorOutlineIcon />}>
        <Button tip={t("tipEscShortcut")} text={t("btnAddFurigana")} onClick={addFurigana} />
      </MenuItem>
      <MenuItem icon={<PowerIcon className={state.autoMode ? "text-sky-500" : ""} />}>
        <CheckBox
          tip={t("tipRefreshPage")}
          text={t("toggleAutoMode")}
          checked={state.autoMode}
          onChange={(checked) => {
            dispatch({ type: ExtEvent.ToggleAutoMode, payload: checked });
          }}
        />
      </MenuItem>
      <MenuItem icon={<FilterIcon className={state.kanjiFilter ? "text-sky-500" : ""} />}>
        <CheckBox
          tip={t("tipFilterLevel")}
          text={t("toggleKanjiFilter")}
          checked={state.kanjiFilter}
          onChange={(checked) => {
            dispatch({
              type: ExtEvent.ToggleKanjiFilter,
              payload: checked,
            });
          }}
        />
      </MenuItem>
      <MenuItem icon={<EyeIcon />}>
        <Select
          selected={state.displayMode}
          options={displayModeOptions}
          onChange={(selected) => {
            dispatch({
              type: ExtEvent.SwitchDisplayMode,
              payload: selected as DisplayMode,
            });
          }}
        />
      </MenuItem>
      <MenuItem icon={<HiraganaIcon />}>
        <Select
          selected={state.furiganaType}
          options={furiganaTypeOptions}
          onChange={(selected) => {
            dispatch({
              type: ExtEvent.SwitchFuriganaType,
              payload: selected as FuriganaType,
            });
          }}
        />
      </MenuItem>
      <MenuItem icon={<CursorTextIcon />}>
        <Select
          tip={t("tipCopyText")}
          selected={state.selectMode}
          options={selectModeOptions}
          onChange={(selected) => {
            dispatch({
              type: ExtEvent.SwitchSelectMode,
              payload: selected as SelectMode,
            });
          }}
        />
      </MenuItem>
      <MenuItem icon={<FontSizeIcon />}>
        <RangeSlider
          value={state.fontSize}
          min={50}
          max={100}
          step={1}
          label={t("labelAdjustFont")}
          onChange={(value) => {
            dispatch({ type: ExtEvent.AdjustFontSize, payload: value });
          }}
        />
      </MenuItem>
      <MenuItem icon={<ColorPickerIcon />}>
        <ColorPicker
          color={state.fontColor}
          onChange={(color) => {
            dispatch({ type: ExtEvent.AdjustFontColor, payload: color });
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
