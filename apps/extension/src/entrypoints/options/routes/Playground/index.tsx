import { Textarea } from "@headlessui/react";
import { Fragment, useState } from "react";
import { sendMessage } from "@/commons/message";
import { cn } from "@/commons/utils";

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

export const Playground = () => {
  const [furiganaSegments, setFuriganaSegments] = useState<FuriganaSegment[]>();

  return (
    <div className="grid w-full grid-cols-2 gap-2.5 text-xl">
      <Textarea
        className={cn(
          "mt-3 block w-full resize-none rounded-lg border border-gray-200 bg-transparent px-4 py-3 text-slate-950 ring-0 dark:border-slate-800 dark:text-white",
          "data-focus:-outline-offset-2 resize-y focus:not-data-focus:outline-none data-focus:outline-2 data-focus:outline-sky-500",
        )}
        rows={10}
        autoFocus
        onChange={async (e) => {
          const text = e.target.value;
          const { tokens } = await sendMessage("getKanjiMarks", { text });
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
          setFuriganaSegments(result);
        }}
      />
      <div className="mt-3 block w-full resize-none rounded-lg border-none bg-slate-950/5 px-4 py-3 text-slate-950 ring-0 dark:bg-white/5 dark:text-white">
        {furiganaSegments ? (
          furiganaSegments.map((item) => (
            <Fragment key={item.id}>
              {item.type === "text" ? (
                item.original
              ) : (
                <ruby>
                  {item.original}
                  <rt>{item.reading}</rt>
                </ruby>
              )}
            </Fragment>
          ))
        ) : (
          <span className="">Furiganaify</span>
        )}
      </div>
    </div>
  );
};
