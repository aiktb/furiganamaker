import { Textarea } from "@headlessui/react";
import { useRef } from "react";
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
  const handleTextareaChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target;
    // If auto is not set, the container will not be able to shrink
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
    const text = e.target.value;
    const { tokens } = await sendMessage("getKanjiMarks", { text });
    const segments = getFuriganaSegments(tokens, text, furiganaType);
    onSegmentsChange(segments);
  };
  const MAX_LENGTH = 5000;
  const { i18n } = useTranslation();
  const numberFormatter = new Intl.NumberFormat(i18n.language);

  return (
    <div
      onClick={() => textareaRef.current?.focus()}
      className="flex w-full flex-col gap-2 rounded-lg border border-gray-200 px-6 py-4 text-slate-950 shadow-xs dark:border-slate-800 dark:text-white"
    >
      <Textarea
        ref={textareaRef}
        defaultValue="ずっと真夜中でいいのに。"
        className="block min-h-40 w-full resize-none border-none bg-transparent p-0 text-xl outline-none ring-0 placeholder:text-2xl"
        maxLength={MAX_LENGTH}
        autoFocus
        onInput={handleTextareaChange}
        placeholder="Type to furiganaify."
      />
      <div className="self-end text-slate-800 text-xs dark:text-slate-200">{`${numberFormatter.format(textareaRef.current?.value.length ?? 0)} / ${numberFormatter.format(MAX_LENGTH)}`}</div>
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
