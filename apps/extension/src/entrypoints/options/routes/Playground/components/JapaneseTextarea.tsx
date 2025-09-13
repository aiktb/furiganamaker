import { Textarea } from "@headlessui/react";
import { debounce } from "es-toolkit";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toHiragana, toRomaji } from "wanakana";
import type { FuriganaType } from "@/commons/constants";
import { sendMessage } from "@/commons/message";
import type { KanjiMark } from "@/entrypoints/background/listeners/onGetKanjiMarksMessage";

type JapaneseTextareaProps = {
  onSegmentsChange: (segments: FuriganaSegment[]) => void;
  furiganaType: FuriganaType;
};

export const JapaneseTextarea = ({ onSegmentsChange, furiganaType }: JapaneseTextareaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [userInput, setUserInput] = useState("");
  const getKanjiMarksAndResponse = debounce(async (text: string) => {
    const { tokens } = await sendMessage("getKanjiMarks", { text });
    const segments = getFuriganaSegments(tokens, text, furiganaType);
    onSegmentsChange(segments);
  }, 100);
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target;
    setUserInput(el.value);
    // If auto is not set, the container will not be able to shrink
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
    getKanjiMarksAndResponse(el.value);
  };
  const MAX_LENGTH = 5000;
  const { i18n } = useTranslation();
  const numberFormatter = new Intl.NumberFormat(i18n.language);
  const { t } = useTranslation();

  return (
    <div
      onClick={() => textareaRef.current?.focus()}
      className="flex w-full flex-col gap-2 rounded-lg border border-gray-200 px-6 py-4 text-slate-950 shadow-xs dark:border-slate-800 dark:text-white"
    >
      <Textarea
        data-testid="playground-japanese-textarea"
        ref={textareaRef}
        className="block min-h-40 w-full flex-1 resize-none border-none bg-transparent p-0 text-xl outline-none ring-0 placeholder:text-2xl"
        maxLength={MAX_LENGTH}
        autoFocus
        value={userInput}
        onInput={handleTextareaChange}
        placeholder={t("placeholderTypeFurigana")}
      />
      <div className="flex items-center justify-end gap-2">
        <div className="text-slate-800 text-xs dark:text-slate-200">{`${numberFormatter.format(userInput.length)} / ${numberFormatter.format(MAX_LENGTH)}`}</div>
        <button
          disabled={userInput.length === 0}
          onClick={() => {
            setUserInput("");
            onSegmentsChange([]);
          }}
          className="flex items-center justify-center rounded-full p-2 transition enabled:cursor-pointer enabled:hover:bg-slate-500/10 disabled:cursor-not-allowed disabled:opacity-50 enabled:hover:dark:bg-white/10"
        >
          <i className="i-tabler-square-rounded-x-filled size-5" />
          <span className="sr-only">{t("tipClearText")}</span>
        </button>
      </div>
    </div>
  );
};

export type FuriganaSegment =
  | {
      type: "text";
      original: string;
      id: string;
    }
  | {
      type: "furigana";
      original: string;
      reading: string;
      id: string;
    };

const getFuriganaSegments = (tokens: KanjiMark[], text: string, furiganaType: FuriganaType) => {
  const result: FuriganaSegment[] = [];
  let lastIndex = 0;
  const getFurigana = (token: KanjiMark) => {
    const data = {
      type: "furigana",
      original: text.slice(token.start, token.end),
      id: crypto.randomUUID(),
      reading: token.reading,
    } as const;
    switch (furiganaType) {
      case "katakana":
        return data;
      case "hiragana":
        return {
          ...data,
          reading: toHiragana(token.reading),
        };
      default:
        return {
          ...data,
          reading: toRomaji(token.reading),
        };
    }
  };
  for (const token of tokens) {
    if (token.start > lastIndex) {
      result.push({
        type: "text",
        original: text.slice(lastIndex, token.start),
        id: crypto.randomUUID(),
      });
    }
    const furigana = getFurigana(token);
    result.push(furigana);
    lastIndex = token.end;
  }

  if (lastIndex < text.length) {
    result.push({
      type: "text",
      original: text.slice(lastIndex),
      id: crypto.randomUUID(),
    });
  }
  return result;
};
