import { Fragment, useState } from "react";
import { type FuriganaSegment, JapaneseTextarea } from "./components/JapaneseTextarea";

export const Playground = () => {
  const [furiganaSegments, setFuriganaSegments] = useState<FuriganaSegment[]>([]);

  return (
    <div className="grid w-full grid-cols-2 gap-2.5 text-xl">
      <JapaneseTextarea onChange={setFuriganaSegments} />
      <div className="mt-3 block w-full rounded-lg border-none bg-slate-950/5 px-4 py-3 text-slate-950 ring-0 dark:bg-white/5 dark:text-white">
        {furiganaSegments.length > 0 ? (
          <TextWithFurigana furiganaSegments={furiganaSegments} />
        ) : (
          <span>Furiganaify</span>
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
