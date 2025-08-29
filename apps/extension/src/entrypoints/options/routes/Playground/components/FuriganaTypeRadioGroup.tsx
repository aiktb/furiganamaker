import { Radio, RadioGroup } from "@headlessui/react";
import type { FuriganaType } from "@/commons/constants";

interface FuriganaTypeOption {
  name: FuriganaType;
  displayValue: string;
}
const furiganaTypeOptions = [
  { name: "katakana", displayValue: "カタカナ" },
  { name: "hiragana", displayValue: "ひらがな" },
  { name: "romaji", displayValue: "Romaji" },
] as const satisfies FuriganaTypeOption[];

interface FuriganaTypeRadioGroupProps {
  selected: FuriganaType;
  onChange: (value: FuriganaType) => void;
}

export const FuriganaTypeRadioGroup = ({ selected, onChange }: FuriganaTypeRadioGroupProps) => {
  return (
    <div className="w-full">
      <div className="w-full">
        <RadioGroup
          value={selected}
          onChange={onChange}
          aria-label="Furigana Type"
          className="grid w-fit grid-cols-3 gap-2"
        >
          {furiganaTypeOptions.map((option) => (
            <Radio
              key={option.name}
              value={option.name}
              className="group cursor-pointer text-nowrap rounded-md bg-slate-950/5 px-4 py-2 font-semibold text-slate-800 transition hover:text-sky-500 data-disabled:cursor-not-allowed dark:bg-white/5 dark:text-white"
            >
              <div className="flex w-full items-center justify-between">
                <div className="text-base/6">
                  <div className="flex gap-2 opacity-70 transition group-data-checked:opacity-100">
                    <i className="!size-6 i-tabler-circle-dashed-check group-data-checked:i-tabler-circle-check-filled" />
                    <div>{option.displayValue}</div>
                  </div>
                </div>
              </div>
            </Radio>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};
