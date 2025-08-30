import { useState } from "react";
import { toHiragana, toKatakana, toRomaji } from "wanakana";
import type { FuriganaType } from "@/commons/constants";
import { FuriganaTypeRadioGroup } from "./components/FuriganaTypeRadioGroup";
import { type FuriganaSegment, JapaneseTextarea } from "./components/JapaneseTextarea";
import { TextWithFurigana } from "./components/TextWithFurigana";

export const Playground = () => {
  const [furiganaSegments, setFuriganaSegments] = useState<FuriganaSegment[]>([]);
  const [selectedFuriganaType, setSelectedFuriganaType] = useState<FuriganaType>("katakana");

  return (
    <div className="w-full">
      <FuriganaTypeRadioGroup
        selected={selectedFuriganaType}
        onChange={(value) => {
          setSelectedFuriganaType(value);
          setFuriganaSegments((segments) => {
            return segments.map((segment) => {
              if (segment.type === "furigana") {
                let reading: string;
                switch (value) {
                  case "katakana":
                    reading = toKatakana(segment.reading);
                    break;
                  case "hiragana":
                    reading = toHiragana(segment.reading);
                    break;
                  default:
                    reading = toRomaji(segment.reading);
                }
                return {
                  ...segment,
                  reading,
                };
              }
              return segment;
            });
          });
        }}
      />
      <div className="mt-3 grid w-full grid-rows-2 gap-2.5 text-xl md:grid-cols-2">
        <JapaneseTextarea
          onSegmentsChange={setFuriganaSegments}
          furiganaType={selectedFuriganaType}
        />
        <TextWithFurigana furiganaSegments={furiganaSegments} />
      </div>
    </div>
  );
};
