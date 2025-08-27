import { useState } from "react";
import { type FuriganaSegment, JapaneseTextarea } from "./components/JapaneseTextarea";
import { TextWithFurigana } from "./components/TextWithFurigana";

export const Playground = () => {
  const [furiganaSegments, setFuriganaSegments] = useState<FuriganaSegment[]>([]);

  return (
    <div className="mt-3 grid w-full grid-cols-2 gap-2.5 text-xl">
      <JapaneseTextarea onChange={setFuriganaSegments} />
      <TextWithFurigana furiganaSegments={furiganaSegments} />
    </div>
  );
};
