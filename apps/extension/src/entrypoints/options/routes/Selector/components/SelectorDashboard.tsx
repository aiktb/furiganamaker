import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { saveAs } from "file-saver";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import defaultSelectorRules from "@/assets/rules/selector.json";
import { cn } from "@/commons/utils";
import { PopupTransition } from "../../../components/PopupTransition";
import { CreateNewSelectorRuleButton } from "../components/CreateNewSelectorRuleButton";
import { useSelectorsStore } from "../store";
import { ImportSelectorRuleButton } from "./ImportSelectorRuleButton";

export const SelectorDashboard = () => {
  const [resetRuleDialogIsOpen, setResetRuleDialogIsOpen] = useState(false);
  const setSelectors = useSelectorsStore((state) => state.setSelectors);
  const clearSelectors = useSelectorsStore((state) => state.clearSelectors);
  const selectors = useSelectorsStore((state) => state.selectors);
  const { t } = useTranslation();

  function resetConfig() {
    setSelectors(defaultSelectorRules);
  }

  function exportConfig() {
    const blob = new Blob([JSON.stringify(selectors, null, 2)], { type: "application/json" });
    saveAs(blob, "furigana-maker-selectors.json");
  }

  const [clearRuleDialogIsOpen, setClearRuleDialogIsOpen] = useState(false);
  function clearConfig() {
    clearSelectors();
    setClearRuleDialogIsOpen(false);
  }
  return (
    <div className="flex flex-col items-center gap-2.5 font-bold text-base text-slate-700 dark:text-slate-300">
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <button
          onClick={() => {
            setClearRuleDialogIsOpen(true);
          }}
          className={cn(
            "flex w-40 cursor-pointer items-center justify-center gap-1 rounded-md bg-slate-950/5 px-1.5 py-2 text-slate-800 transition enabled:hover:text-sky-500 sm:px-3 dark:bg-white/5 dark:text-white",
            selectors.length === 0 && "cursor-not-allowed opacity-50",
          )}
          disabled={selectors.length === 0}
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
                className="font-semibold text-lg text-slate-900 leading-6 dark:text-white"
              >
                {t("clearConfigDialogTitle")}
              </DialogTitle>
              <div className="mt-2">
                <p className="whitespace-pre-wrap text-slate-500 text-sm dark:text-slate-400">
                  {t("undoneDesc")}
                </p>
              </div>
              <div className="mt-4 flex gap-2.5">
                <button
                  className="inline-flex cursor-pointer justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 font-semibold text-slate-900 text-sm transition hover:bg-red-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:bg-red-800 dark:text-slate-200 dark:hover:bg-red-900"
                  onClick={clearConfig}
                >
                  {t("btnConfirm")}
                </button>
                <button
                  className="inline-flex cursor-pointer justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 font-semibold text-blue-900 text-sm transition hover:bg-blue-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
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
          className="flex w-40 cursor-pointer items-center justify-center gap-1 rounded-md bg-slate-950/5 px-1.5 py-2 text-slate-800 transition hover:text-sky-500 sm:px-3 dark:bg-white/5 dark:text-white"
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
                className="font-semibold text-lg text-slate-900 leading-6 dark:text-white"
              >
                {t("resetWarning")}
              </DialogTitle>
              <div className="mt-2">
                <p className="whitespace-pre-wrap text-slate-500 text-sm dark:text-slate-400">
                  {t("undoneDesc")}
                </p>
              </div>
              <div className="mt-4 flex gap-2.5">
                <button
                  className="inline-flex cursor-pointer justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 font-semibold text-slate-900 text-sm transition hover:bg-red-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:bg-red-800 dark:text-slate-200 dark:hover:bg-red-900"
                  onClick={() => {
                    resetConfig();
                    setResetRuleDialogIsOpen(false);
                  }}
                >
                  {t("btnReset")}
                </button>
                <button
                  className="inline-flex cursor-pointer justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 font-semibold text-blue-900 text-sm transition hover:bg-blue-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
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
            "flex w-40 cursor-pointer items-center justify-center gap-1 overflow-hidden overflow-ellipsis whitespace-nowrap rounded-md bg-slate-950/5 px-1.5 py-2 text-slate-800 transition enabled:hover:text-sky-500 sm:px-3 dark:bg-white/5 dark:text-white",
            selectors.length === 0 && "cursor-not-allowed opacity-50",
          )}
          onClick={exportConfig}
          disabled={selectors.length === 0}
        >
          <i className="i-tabler-file-export size-5" />
          <span className="max-w-32 overflow-hidden overflow-ellipsis whitespace-nowrap">
            {t("btnExportConfig")}
          </span>
        </button>
        <ImportSelectorRuleButton />
      </div>
      <CreateNewSelectorRuleButton />
    </div>
  );
};
