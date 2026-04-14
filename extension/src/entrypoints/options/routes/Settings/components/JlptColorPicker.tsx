import { useTranslation } from "react-i18next";

interface JlptColorPickerProps {
  n5Color: string;
  n4Color: string;
  onN5ColorChange: (color: string) => void;
  onN4ColorChange: (color: string) => void;
  onReset: () => void;
}

export function JlptColorPicker({
  n5Color,
  n4Color,
  onN5ColorChange,
  onN4ColorChange,
  onReset,
}: JlptColorPickerProps) {
  const { t } = useTranslation();
  const n5ColorInputId = "jlpt-n5-color";
  const n4ColorInputId = "jlpt-n4-color";

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full items-end justify-between gap-4">
        <div className="flex flex-1 flex-col gap-2">
          <label
            htmlFor={n5ColorInputId}
            className="font-semibold text-slate-800 dark:text-slate-200"
          >
            {t("settingsJlptN5Color")}
          </label>
          <div className="flex gap-3">
            <input
              id={n5ColorInputId}
              type="color"
              value={n5Color}
              onChange={(e) => onN5ColorChange(e.target.value)}
              className="size-10 cursor-pointer rounded-md border border-slate-300 transition hover:border-sky-500 dark:border-slate-600"
            />
            <input
              type="text"
              value={n5Color}
              onChange={(e) => onN5ColorChange(e.target.value)}
              placeholder="#1E90FF"
              className="flex-1 rounded-md border border-slate-300 px-3 py-2 font-mono text-sm dark:border-slate-600 dark:bg-slate-800"
            />
          </div>
        </div>
        <div
          className="size-10 rounded-md border-2 border-slate-300 dark:border-slate-600"
          style={{ backgroundColor: n5Color }}
          title={n5Color}
        />
      </div>

      <div className="flex w-full items-end justify-between gap-4">
        <div className="flex flex-1 flex-col gap-2">
          <label
            htmlFor={n4ColorInputId}
            className="font-semibold text-slate-800 dark:text-slate-200"
          >
            {t("settingsJlptN4Color")}
          </label>
          <div className="flex gap-3">
            <input
              id={n4ColorInputId}
              type="color"
              value={n4Color}
              onChange={(e) => onN4ColorChange(e.target.value)}
              className="size-10 cursor-pointer rounded-md border border-slate-300 transition hover:border-sky-500 dark:border-slate-600"
            />
            <input
              type="text"
              value={n4Color}
              onChange={(e) => onN4ColorChange(e.target.value)}
              placeholder="#FF8C00"
              className="flex-1 rounded-md border border-slate-300 px-3 py-2 font-mono text-sm dark:border-slate-600 dark:bg-slate-800"
            />
          </div>
        </div>
        <div
          className="size-10 rounded-md border-2 border-slate-300 dark:border-slate-600"
          style={{ backgroundColor: n4Color }}
          title={n4Color}
        />
      </div>

      <div className="flex items-end justify-between gap-4 rounded-md border border-slate-300 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-800/50">
        <div className="flex gap-3">
          <div>
            <span className="font-bold" style={{ color: n5Color }}>
              N5
            </span>
            {` ${t("settingsJlptPreview")}`}
          </div>
          <span>|</span>
          <div>
            <span className="font-bold" style={{ color: n4Color }}>
              N4
            </span>
            {` ${t("settingsJlptPreview")}`}
          </div>
        </div>
        <button
          onClick={onReset}
          className="whitespace-nowrap rounded-md bg-slate-200 px-3 py-1 font-semibold text-sm transition hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
        >
          {t("btnReset")}
        </button>
      </div>

      <div className="text-slate-600 text-sm dark:text-slate-400">{t("settingsJlptColorDesc")}</div>
    </div>
  );
}
