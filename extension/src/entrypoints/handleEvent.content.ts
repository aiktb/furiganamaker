import { match } from "ts-pattern";
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
    await applyJlptColorsHandler();
    const isStyleEvent = (event: ExtEvent): event is StyleEvent => styleEvents.includes(event);
    browser.runtime.onMessage.addListener((event: ExtEvent) => {
      if (event === ExtEvent.AddFurigana) {
        addFuriganaHandler();
      } else if (event === ExtEvent.SwitchFuriganaType) {
        switchFuriganaHandler();
      } else if (event === ExtEvent.UpdateJlptColors) {
        applyJlptColorsHandler();
      } else if (isStyleEvent(event)) {
        styleHandler(event);
      }
    });
  },
});

async function styleHandler(type: StyleEvent) {
  const rubySelector = `ruby.${FURIGANA_CLASS}`;
  const rtSelector = `${rubySelector} > rt`;
  const rtHoverSelector = `${rubySelector}:hover > rt`;
  const rpSelector = `${rubySelector} > rp`;
  const filteredRtSelector = `${rubySelector}.isFiltered > rt`;

  const value = await getGeneralSettings(toStorageKey(type));
  const css = await match(type)
    .with(ExtEvent.SwitchDisplayMode, () =>
      match(value as DisplayMode)
        .with(
          DisplayMode.Never,
          () => `
          ${rtSelector} {
            display: none;
          }`,
        )
        .with(
          DisplayMode.Hover,
          () => `
          ${rtSelector} {
            opacity: 0;
          }

          ${rtHoverSelector} {
            opacity: 1;
          }`,
        )
        .with(
          DisplayMode.HoverNoGap,
          () => `
          ${rtSelector} {
            display: none;
          }

          ${rtHoverSelector} {
            display: revert;
          }`,
        )
        .with(
          DisplayMode.HoverMask,
          () => `
          ${rtSelector} {
            background-color: currentColor;
            border-radius: 0.25em;
          }

          ${rtHoverSelector} {
            background-color: transparent;
            transition: background-color 0.15s ease-in-out;
          }`,
        )
        .with(DisplayMode.Always, () => "")
        .exhaustive(),
    )
    .with(
      ExtEvent.SwitchSelectMode,
      () => `
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
        }`,
    )
    .with(
      ExtEvent.AdjustFontSize,
      () => `
        ${rtSelector} {
          font-size: ${value}%;
        }`,
    )
    .with(ExtEvent.AdjustFontColor, async () => {
      const coloringKanji = await getMoreSettings(ExtStorage.ColoringKanji);
      return `
        ${coloringKanji ? rubySelector : rtSelector} {
          color: ${value};
        }`;
    })
    .with(ExtEvent.ToggleKanjiFilter, () =>
      value
        ? `
          ${filteredRtSelector} {
            display: none;
          }`
        : "",
    )
    .exhaustive();
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
  const transformer = match(value)
    .with(FuriganaType.Hiragana, () => toHiragana)
    .with(FuriganaType.Katakana, () => toKatakana)
    .with(FuriganaType.Romaji, () => toRomaji)
    .exhaustive();
  for (const node of nodes) {
    node.textContent = transformer(node.textContent!);
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

async function applyJlptColorsHandler() {
  const rubySelector = `ruby.${FURIGANA_CLASS}`;
  const n5ColorSelector = `${rubySelector}.level-n5`;
  const n4ColorSelector = `${rubySelector}.level-n4`;
  const n3ColorSelector = `${rubySelector}.level-n3`;
  const n2ColorSelector = `${rubySelector}.level-n2`;
  const n1ColorSelector = `${rubySelector}.level-n1`;

  const n5Color = await getMoreSettings(ExtStorage.N5Color);
  const n4Color = await getMoreSettings(ExtStorage.N4Color);
  const n3Color = await getMoreSettings(ExtStorage.N3Color);
  const n2Color = await getMoreSettings(ExtStorage.N2Color);
  const n1Color = await getMoreSettings(ExtStorage.N1Color);

  const css = `
    ${n5ColorSelector} {
      color: ${n5Color};
    }
    ${n4ColorSelector} {
      color: ${n4Color};
    }
    ${n3ColorSelector} {
      color: ${n3Color};
    }
    ${n2ColorSelector} {
      color: ${n2Color};
    }
    ${n1ColorSelector} {
      color: ${n1Color};
    }
  `;

  const id = `${FURIGANA_CLASS}${ExtEvent.UpdateJlptColors}`;
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
