import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import type { FuriganaSegment } from "./JapaneseTextarea";

interface TextWithFuriganaProps {
  furiganaSegments: FuriganaSegment[];
}

export const TextWithFurigana = ({ furiganaSegments }: TextWithFuriganaProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex w-full flex-col gap-2 rounded-lg border-none bg-slate-950/5 px-6 py-4 text-slate-950 ring-0 dark:bg-white/5 dark:text-white">
      <div className="flex-1">
        {furiganaSegments.length > 0 ? (
          <div className="wrap-anywhere w-full whitespace-break-spaces">
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
        ) : (
          <span className="text-slate-700 dark:text-slate-300">{t("tipPleaseEnter")}</span>
        )}
      </div>
      <div className="flex justify-end">
        <button
          disabled={furiganaSegments.length === 0}
          onClick={() => {
            const text = furiganaSegments
              .map((segment) =>
                segment.type === "text"
                  ? segment.original
                  : `${segment.original}(${segment.reading})`,
              )
              .join("");
            navigator.clipboard
              .writeText(text)
              .then(() => toast.info(t("msgCopied")))
              .catch(() => toast.error(t("msgCopyFailed")));
          }}
          className="flex items-center justify-center rounded-full p-2 transition enabled:cursor-pointer enabled:hover:bg-slate-500/10 disabled:cursor-not-allowed disabled:opacity-50 enabled:hover:dark:bg-white/10"
        >
          <i className="i-tabler-copy-plus-filled size-5" />
          <span className="sr-only">{t("tipCopy")}</span>
        </button>
      </div>
    </div>
  );
};
