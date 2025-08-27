import { Textarea } from "@headlessui/react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { sendMessage } from "@/commons/message";
import type { KanjiMark } from "@/entrypoints/background/listeners/onGetKanjiMarksMessage";

type JapaneseTextareaProps = {
  onChange: (segments: FuriganaSegment[]) => void;
};

export const JapaneseTextarea = ({ onChange }: JapaneseTextareaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const handleTextareaChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
    const text = e.target.value;
    const { tokens } = await sendMessage("getKanjiMarks", { text });
    const segments = getFuriganaSegments(tokens, text);
    onChange(segments);
  };
  const MAX_LENGTH = 5000;
  const { i18n } = useTranslation();
  const numberFormatter = new Intl.NumberFormat(i18n.language);

  return (
    <div
      onClick={() => textareaRef.current?.focus()}
      className="mt-3 flex w-full flex-col gap-2 rounded-lg border border-gray-200 px-4 py-3 text-slate-950 shadow-xs dark:border-slate-800 dark:text-white"
    >
      <Textarea
        ref={textareaRef}
        className="block min-h-40 w-full resize-none border-none bg-transparent text-xl outline-none ring-0 placeholder:text-2xl"
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

const getFuriganaSegments = (tokens: KanjiMark[], text: string) => {
  const result: FuriganaSegment[] = [];
  let lastIndex = 0;

  for (const token of tokens) {
    if (token.start > lastIndex) {
      result.push({
        type: "text",
        original: text.slice(lastIndex, token.start),
        id: crypto.randomUUID(),
      });
    }
    result.push({
      type: "furigana",
      original: text.slice(token.start, token.end),
      reading: token.reading,
      id: crypto.randomUUID(),
    });
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
