import { toHiragana, toKatakana, toRomaji } from "wanakana";

import {
  DisplayMode,
  ExtEvent,
  ExtStorage,
  FURIGANA_CLASS,
  FuriganaType,
  SelectMode,
  type StyleEvent,
} from "@/commons/constants";
import { Selector } from "@/commons/selectElement";
import { getGeneralSettings, getMoreSettings, toStorageKey } from "@/commons/utils";

export default defineContentScript({
  matches: ["*://*/*"],
  runAt: "document_start",

  async main() {
    // styleHandler uses storage and is called immediately,
    // so it needs to be initialized immediately.
    const styleEvents = [
      ExtEvent.SwitchDisplayMode,
      ExtEvent.SwitchSelectMode,
      ExtEvent.AdjustFontSize,
      ExtEvent.AdjustFontColor,
      ExtEvent.ToggleKanjiFilter,
    ] as const satisfies StyleEvent[];
    await Promise.all(styleEvents.map((item) => styleHandler(item)));
    const isStyleEvent = (event: ExtEvent): event is StyleEvent => styleEvents.includes(event);
    browser.runtime.onMessage.addListener((event: ExtEvent) => {
      if (event === ExtEvent.AddFurigana) {
        addFuriganaHandler();
      } else if (event === ExtEvent.SwitchFuriganaType) {
        switchFuriganaHandler();
      } else if (isStyleEvent(event)) {
        styleHandler(event);
      }
    });
  },
});

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: This doesn't look complicated.
async function styleHandler(type: StyleEvent) {
  const rubySelector = `ruby.${FURIGANA_CLASS}`;
  const rtSelector = `${rubySelector} > rt`;
  const rtHoverSelector = `${rubySelector}:hover > rt`;
  const rpSelector = `${rubySelector} > rp`;
  const filteredRtSelector = `${rubySelector}.isFiltered > rt`;

  const value = await getGeneralSettings(toStorageKey(type));
  let css = "";
  switch (type) {
    case ExtEvent.SwitchDisplayMode:
      if (value === DisplayMode.Never) {
        css = `
          ${rtSelector} {
            display: none;
          }`;
      } else if (value === DisplayMode.Hover) {
        css = `
          ${rtSelector} {
            opacity: 0;
          }

          ${rtHoverSelector} {
            opacity: 1;
          }`;
      } else if (value === DisplayMode.HoverNoGap) {
        css = `
          ${rtSelector} {
            display: none;
          }

          ${rtHoverSelector} {
            display: revert;
          }`;
      } else if (value === DisplayMode.HoverMask) {
        css = `
          ${rtSelector} {
            background-color: currentColor;
            border-radius: 0.25em;
          }

          ${rtHoverSelector} {
            background-color: transparent;
            transition: background-color 0.15s ease-in-out;
          }`;
      }
      break;
    case ExtEvent.SwitchSelectMode:
      css = `
        ${rtSelector} {
          user-select: ${value === SelectMode.Original ? "none" : "text"};
        }

        ${rpSelector} {
          display: ${value === SelectMode.Parentheses ? "block" : "none"};
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }`;
      break;
    case ExtEvent.AdjustFontSize:
      css = `
        ${rtSelector} {
          font-size: ${value}%;
        }`;
      break;
    case ExtEvent.AdjustFontColor: {
      const coloringKanji = await getMoreSettings(ExtStorage.ColoringKanji);
      css = `
        ${coloringKanji ? rubySelector : rtSelector} {
          color: ${value};
        }`;
      break;
    }
    case ExtEvent.ToggleKanjiFilter:
      if (value) {
        css = `
          ${filteredRtSelector} {
            display: none;
          }`;
      }
      break;
  }
  const id = `${FURIGANA_CLASS}${type}`;
  const oldStyle = document.getElementById(id);
  if (oldStyle) {
    oldStyle.textContent = css;
  } else {
    const style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.setAttribute("id", id);
    style.textContent = css;
    document.head.appendChild(style);
  }
}

async function switchFuriganaHandler() {
  const rtSelector = `ruby.${FURIGANA_CLASS} > rt`;
  const nodes = document.querySelectorAll(rtSelector);
  const value = await getGeneralSettings(ExtStorage.FuriganaType);
  switch (value) {
    case FuriganaType.Hiragana:
      for (const node of nodes) {
        node.textContent = toHiragana(node.textContent!);
      }
      break;
    case FuriganaType.Katakana:
      for (const node of nodes) {
        node.textContent = toKatakana(node.textContent!);
      }
      break;
    case FuriganaType.Romaji:
      for (const node of nodes) {
        node.textContent = toRomaji(node.textContent!);
      }
      break;
  }
}

function addFuriganaHandler() {
  const selector = Selector.create();
  const selectHandler = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      selector.close();
      document.removeEventListener("keydown", selectHandler);
    }
  };
  selector.open();
  document.addEventListener("keydown", selectHandler);
}
