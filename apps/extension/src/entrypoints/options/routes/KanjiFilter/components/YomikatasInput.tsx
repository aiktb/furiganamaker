import { Input } from "@headlessui/react";
import { t } from "i18next";
import { useRef, useState } from "react";
import { cn } from "@/commons/utils";

interface YomikatasInputProps {
  yomikatas: string[];
  onChange: (yomikatas: string[]) => void;
  className?: string;
  disabled?: boolean;
}

export function YomikatasInput({
  yomikatas,
  className,
  onChange,
  disabled = false,
}: YomikatasInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [inputting, setInputting] = useState(false);
  const handleInputConfirm = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !yomikatas.includes(trimmedValue)) {
      onChange([...yomikatas, trimmedValue]);
    }
    setInputValue("");
  };

  const inputRef = useRef<HTMLInputElement>(null);
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Even without keyboard events support, full accessibility is provided.
    // biome-ignore lint/a11y/noStaticElementInteractions: Same reason as above.
    <div
      className={cn(
        "flex w-full cursor-text flex-wrap gap-1.5 rounded-md border-0 px-1 py-1.5 shadow-xs ring-1 ring-gray-300 ring-inset focus:ring-2 focus:ring-sky-600 focus:ring-inset disabled:cursor-not-allowed sm:text-sm sm:leading-6 dark:bg-slate-900 dark:ring-gray-700 dark:focus:ring-sky-600",
        "has-focus:ring-2 has-focus:ring-sky-600 has-focus:ring-inset dark:has-focus:ring-sky-600",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
      onClick={() => {
        if (!disabled) {
          setInputting(true);
        }
      }}
    >
      {yomikatas.map((katakana) => {
        return (
          <div
            className="flex items-center justify-center gap-1 rounded-md bg-slate-950/5 px-1.5 dark:bg-white/5"
            key={katakana}
          >
            <span className="text-slate-950 dark:text-white">{katakana}</span>
            <button
              onClick={() => {
                onChange(yomikatas.filter((k) => k !== katakana));
              }}
              className="flex items-center justify-center transition enabled:cursor-pointer enabled:hover:text-slate-950 disabled:cursor-not-allowed enabled:dark:hover:text-white"
              disabled={disabled}
            >
              <i className="i-tabler-x size-3" />
              <span className="sr-only">{`Delete ${katakana}`}</span>
            </button>
          </div>
        );
      })}
      {inputting ? (
        <Input
          value={inputValue}
          ref={inputRef}
          onFocus={() => setInputting(true)}
          onChange={(e) => setInputValue(e.target.value)}
          autoFocus
          disabled={disabled}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              setInputting(false);
              setInputValue("");
              if (inputRef.current) {
                inputRef.current.blur();
              }
            }

            if (e.key === "Enter") {
              handleInputConfirm();
            }
          }}
          onBlur={() => {
            handleInputConfirm();
            setInputting(false);
          }}
          placeholder={inputting ? "カタカナ" : ""}
          type="text"
          className={cn(
            "min-w-8 flex-1 border-0 px-2 py-0 text-gray-900 ring-0 sm:text-sm sm:leading-6 dark:bg-slate-900 dark:text-white",
            yomikatas.length > 0 && "p-0",
          )}
        />
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            inputRef.current?.focus();
            setInputting(true);
          }}
          className={cn(
            "group flex items-center justify-center rounded-full bg-slate-950/5 p-1 enabled:cursor-pointer dark:bg-white/5",
            disabled && "cursor-not-allowed",
          )}
        >
          <i className="i-tabler-plus size-4 transition group-enabled:hover:text-slate-950 group-enabled:dark:hover:text-white" />
          <span className="sr-only">{t("btnAddKatakana")}</span>
        </button>
      )}
      {disabled && yomikatas.length === 0 && t("inputProhibitedTip")}
    </div>
  );
}
