import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { saveAs } from "file-saver";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn, DB, getKanjiFilterDB } from "@/commons/utils";
import { PopupTransition } from "../../../components/PopupTransition";
import { useKanjiFiltersStore } from "../store";
import { BatchCreateKanjiFilterButton } from "./BatchCreateKanjiFilterButton";
import { CreateKanjiFilterButton } from "./CreateKanjiFilterButton";
import { ImportKanjiFilterButton } from "./ImportKanjiFilterButton";

interface KanjiFilterDashboardProps {
  className?: string;
  disableExportAndClear: boolean;
}
export function KanjiFilterDashboard({
  className,
  disableExportAndClear,
}: KanjiFilterDashboardProps) {
  const resetKanjiFilters = useKanjiFiltersStore((state) => state.resetKanjiFilters);
  const clearKanjiFilters = useKanjiFiltersStore((state) => state.clearKanjiFilters);
  const { t } = useTranslation();
  const [resetRuleDialogIsOpen, setResetRuleDialogIsOpen] = useState(false);
  const resetConfig = () => {
    resetKanjiFilters();
    setResetRuleDialogIsOpen(false);
  };

  const [clearRuleDialogIsOpen, setClearRuleDialogIsOpen] = useState(false);
  const clearConfig = () => {
    setClearRuleDialogIsOpen(false);
    clearKanjiFilters();
  };

  const exportConfig = async () => {
    const db = await getKanjiFilterDB();
    const rules = await db.getAll(DB.onlyTable);
    const blob = new Blob([JSON.stringify(rules, null, 2)], { type: "application/json" });
    saveAs(blob, "furigana-maker-kanji-filter.json");
  };

  return (
    <div className={cn("flex grow flex-col items-center justify-start lg:px-8", className)}>
      <div className="flex flex-col items-center justify-center gap-2.5 font-bold text-base text-slate-700 dark:text-slate-300">
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          <CreateKanjiFilterButton />
          <button
            onClick={() => {
              setClearRuleDialogIsOpen(true);
            }}
            className={cn(
              "playwright-kanji-filter-clear-config-btn",
              "flex w-40 cursor-pointer items-center justify-center gap-1 rounded-md bg-slate-950/5 px-1.5 py-2 text-slate-800 transition enabled:hover:text-sky-500 sm:px-3 dark:bg-white/5 dark:text-white",
              disableExportAndClear && "cursor-not-allowed opacity-50",
            )}
            disabled={disableExportAndClear}
          >
            <i className="i-tabler-clear-all size-5" />
            <span className="max-w-32 overflow-hidden overflow-ellipsis whitespace-nowrap">
              {t("btnClearConfig")}
            </span>
          </button>
          <PopupTransition show={clearRuleDialogIsOpen}>
            <Dialog
              as="div"
              className="-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 z-40 min-w-80"
              onClose={() => {
                setClearRuleDialogIsOpen(false);
              }}
            >
              <DialogPanel className="w-full min-w-[20rem] max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-slate-900">
                <DialogTitle
                  as="h3"
                  className="font-medium text-gray-900 text-lg leading-6 dark:text-white"
                >
                  {t("clearConfigDialogTitle")}
                </DialogTitle>
                <div className="mt-2">
                  <p className="whitespace-pre-wrap text-gray-500 text-sm dark:text-gray-400">
                    {t("undoneDesc")}
                  </p>
                </div>
                <div className="mt-4 flex gap-2.5">
                  <button
                    className="inline-flex cursor-pointer justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 font-medium text-slate-900 text-sm transition hover:bg-red-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:bg-red-800 dark:text-slate-200 dark:hover:bg-red-900"
                    onClick={clearConfig}
                  >
                    {t("btnConfirm")}
                  </button>
                  <button
                    className="inline-flex cursor-pointer justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 font-medium text-blue-900 text-sm transition hover:bg-blue-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    onClick={() => {
                      setClearRuleDialogIsOpen(false);
                    }}
                  >
                    {t("btnCancel")}
                  </button>
                </div>
              </DialogPanel>
            </Dialog>
          </PopupTransition>
          <button
            className="playwright-kanji-filter-reset-config-btn flex w-40 cursor-pointer items-center justify-center gap-1 rounded-md bg-slate-950/5 px-1.5 py-2 text-slate-800 transition hover:text-sky-500 sm:px-3 dark:bg-white/5 dark:text-white"
            onClick={() => {
              setResetRuleDialogIsOpen(true);
            }}
          >
            <i className="i-tabler-restore size-5" />
            <span className="max-w-32 overflow-hidden overflow-ellipsis whitespace-nowrap">
              {t("btnResetConfig")}
            </span>
          </button>
          <PopupTransition show={resetRuleDialogIsOpen}>
            <Dialog
              as="div"
              className="-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 z-40 min-w-80"
              onClose={() => {
                setResetRuleDialogIsOpen(false);
              }}
            >
              <DialogPanel className="w-full min-w-[20rem] max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-slate-900">
                <DialogTitle
                  as="h3"
                  className="font-medium text-gray-900 text-lg leading-6 dark:text-white"
                >
                  {t("resetWarning")}
                </DialogTitle>
                <div className="mt-2">
                  <p className="whitespace-pre-wrap text-gray-500 text-sm dark:text-gray-400">
                    {t("undoneDesc")}
                  </p>
                </div>
                <div className="mt-4 flex gap-2.5">
                  <button
                    className="inline-flex cursor-pointer justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 font-medium text-slate-900 text-sm transition hover:bg-red-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:bg-red-800 dark:text-slate-200 dark:hover:bg-red-900"
                    onClick={resetConfig}
                  >
                    {t("btnConfirm")}
                  </button>
                  <button
                    className="inline-flex cursor-pointer justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 font-medium text-blue-900 text-sm transition hover:bg-blue-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    onClick={() => {
                      setResetRuleDialogIsOpen(false);
                    }}
                  >
                    {t("btnCancel")}
                  </button>
                </div>
              </DialogPanel>
            </Dialog>
          </PopupTransition>

          <button
            className={cn(
              "playwright-kanji-filter-export-config-btn",
              "flex w-40 cursor-pointer items-center justify-center gap-1 overflow-hidden overflow-ellipsis whitespace-nowrap rounded-md bg-slate-950/5 px-1.5 py-2 text-slate-800 transition enabled:hover:text-sky-500 sm:px-3 dark:bg-white/5 dark:text-white",
              disableExportAndClear && "cursor-not-allowed opacity-50",
            )}
            disabled={disableExportAndClear}
            onClick={exportConfig}
          >
            <i className="i-tabler-file-export size-5" />
            <span className="max-w-32 overflow-hidden overflow-ellipsis whitespace-nowrap">
              {t("btnExportConfig")}
            </span>
          </button>

          <ImportKanjiFilterButton />
        </div>
        <BatchCreateKanjiFilterButton />
      </div>
    </div>
  );
}
