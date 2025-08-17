import { Dialog, DialogPanel, DialogTitle, Textarea } from "@headlessui/react";
import { uniq } from "es-toolkit";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { isKanji } from "wanakana";
import { cn } from "@/commons/utils";
import { PopupTransition } from "@/entrypoints/options/components/PopupTransition";
import { useKanjiFiltersStore } from "../store";

export const BatchCreateKanjiFilterButton = () => {
  const { t } = useTranslation();
  const addKanjiFilters = useKanjiFiltersStore((state) => state.addKanjiFilter);
  const [quickStartInput, setQuickStartInput] = useState("");
  const [quickStartDialogIsOpen, setQuickStartDialogIsOpen] = useState(false);
  const batchCreateKanjiFilters = () => {
    const wordList = quickStartInput
      .split(/[\s\n]+/)
      .filter((kanji) => kanji.length > 0 && isKanji(kanji));
    const kanjiList = uniq(wordList);
    addKanjiFilters(...kanjiList.map((kanji) => ({ kanji })));
    setQuickStartInput("");
    setQuickStartDialogIsOpen(false);
  };
  return (
    <>
      <button
        onClick={() => {
          setQuickStartDialogIsOpen(true);
        }}
        className="playwright-kanji-filter-quick-create-btn flex w-40 cursor-pointer items-center justify-center gap-1 overflow-hidden overflow-ellipsis whitespace-nowrap rounded-md bg-sky-600 px-1.5 py-2 text-white transition hover:bg-sky-500 sm:px-3"
      >
        <i className="i-tabler-star size-5" />
        <span className="max-w-32 overflow-hidden overflow-ellipsis whitespace-nowrap">
          {t("btnQuickCreate")}
        </span>
      </button>
      <PopupTransition show={quickStartDialogIsOpen}>
        <Dialog
          as="div"
          className="-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 z-40 min-w-80"
          onClose={() => {
            setQuickStartDialogIsOpen(false);
            setQuickStartInput("");
          }}
        >
          <DialogPanel className="w-full min-w-[20rem] max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-slate-900">
            <DialogTitle
              as="h3"
              className="font-medium text-gray-900 text-lg leading-6 dark:text-white"
            >
              {t("quickCreateModalTitle")}
            </DialogTitle>
            <p className="mt-2 text-gray-500 text-sm dark:text-gray-400">
              {t("quickCreateModalDesc1")}
            </p>
            <p className="mt-2 text-gray-500 text-sm dark:text-gray-400">
              {t("quickCreateModalDesc2")}
            </p>
            <Textarea
              value={quickStartInput}
              onChange={(e) => setQuickStartInput(e.target.value)}
              className={cn(
                "mt-3 block w-full resize-none rounded-lg border-none bg-slate-950/5 px-3 py-1.5 text-slate-950 text-sm/6 ring-0 dark:bg-white/5 dark:text-white",
                "data-focus:-outline-offset-2 resize-y focus:not-data-focus:outline-none data-focus:outline-2 data-focus:outline-sky-500",
              )}
              rows={3}
            />
            <div className="mt-4 flex gap-2.5">
              <button
                className="inline-flex cursor-pointer justify-center rounded-md border border-transparent bg-sky-600 px-4 py-2 font-medium text-sm text-white shadow-xs transition hover:bg-sky-500 focus:outline-hidden focus-visible:outline-2 focus-visible:outline-sky-600 focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-offset-2"
                onClick={() => {
                  batchCreateKanjiFilters();
                }}
              >
                {t("btnConfirm")}
              </button>
              <button
                className="inline-flex cursor-pointer justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 font-medium text-blue-900 text-sm transition hover:bg-blue-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                onClick={() => {
                  setQuickStartDialogIsOpen(false);
                  setQuickStartInput("");
                }}
              >
                {t("btnCancel")}
              </button>
            </div>
          </DialogPanel>
        </Dialog>
      </PopupTransition>
    </>
  );
};
