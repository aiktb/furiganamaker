import { Textarea } from "@headlessui/react";
import { Fragment, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { sendMessage } from "@/commons/message";
import type { KanjiMark } from "@/entrypoints/background/listeners/onGetKanjiMarksMessage";

type FuriganaSegment =
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

export const Playground = () => {
  const [furiganaSegments, setFuriganaSegments] = useState<FuriganaSegment[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const handleTextareaChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
    const text = e.target.value;
    const { tokens } = await sendMessage("getKanjiMarks", { text });
    const segments = getFuriganaSegments(tokens, text);
    setFuriganaSegments(segments);
  };
  const MAX_LENGTH = 5000;
  const { i18n } = useTranslation();
  const numberFormatter = new Intl.NumberFormat(i18n.language);
  return (
    <div className="grid w-full grid-cols-2 gap-2.5 text-xl">
      <div className="mt-3 flex w-full flex-col gap-2 rounded-lg border border-gray-200 px-4 py-3 text-slate-950 dark:border-slate-800 dark:text-white">
        <Textarea
          ref={textareaRef}
          className="block min-h-40 w-full resize-none border-none bg-transparent text-xl outline-none ring-0"
          maxLength={MAX_LENGTH}
          autoFocus
          onInput={handleTextareaChange}
        />
        <div className="self-end text-slate-800 text-xs dark:text-slate-200">{`${numberFormatter.format(textareaRef.current?.value.length ?? 0)} / ${numberFormatter.format(MAX_LENGTH)}`}</div>
      </div>
      <div className="mt-3 block w-full rounded-lg border-none bg-slate-950/5 px-4 py-3 text-slate-950 ring-0 dark:bg-white/5 dark:text-white">
        {furiganaSegments.length > 0 ? (
          <TextWithFurigana furiganaSegments={furiganaSegments} />
        ) : (
          <span className="">Furiganaify</span>
        )}
      </div>
    </div>
  );
};

interface TextWithFuriganaProps {
  furiganaSegments: FuriganaSegment[];
}

const TextWithFurigana = ({ furiganaSegments }: TextWithFuriganaProps) => {
  return (
    <div className="wrap-anywhere w-full">
      {furiganaSegments.map((item) => (
        <Fragment key={item.id}>
          {item.type === "text" ? (
            item.original
          ) : (
            <ruby>
              {item.original}
              <rt className="text-[75%]">{item.reading}</rt>
            </ruby>
          )}
        </Fragment>
      ))}
    </div>
  );
};
