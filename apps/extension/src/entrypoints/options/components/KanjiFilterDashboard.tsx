import type { FilterRule } from "@/commons/constants";
import { DB, cn, getKanjiFilterDB } from "@/commons/utils";

import defaultKanjiFilterRules from "@/assets/rules/filter.json";

import { Dialog, DialogPanel, DialogTitle, Textarea } from "@headlessui/react";
import { saveAs } from "file-saver";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { isKanji } from "wanakana";
import PopupTransition from "./PopupTransition";

interface KanjiFilterDashboardProps {
  className?: string;
  disableExportAndClear: boolean;
  onNewButtonClick: () => void;
  onChange: (rules: FilterRule[]) => void;
}
export default function KanjiFilterDashboard({
  className,
  disableExportAndClear,
  onNewButtonClick,
  onChange,
}: KanjiFilterDashboardProps) {
  const { t } = useTranslation();

  const [resetRuleDialogIsOpen, setResetRuleDialogIsOpen] = useState(false);
  const resetConfig = async () => {
    const db = await getKanjiFilterDB();
    await db.clear(DB.onlyTable);
    const store = db.transaction(DB.onlyTable, "readwrite").objectStore(DB.onlyTable);
    for (const rule of defaultKanjiFilterRules) {
      store.put(rule);
    }
    onChange(await db.getAll(DB.onlyTable));
    setResetRuleDialogIsOpen(false);
  };

  const [clearRuleDialogIsOpen, setClearRuleDialogIsOpen] = useState(false);
  const clearConfig = async () => {
    const db = await getKanjiFilterDB();
    await db.clear(DB.onlyTable);
    setClearRuleDialogIsOpen(false);
    onChange([]);
  };

  const exportConfig = async () => {
    const db = await getKanjiFilterDB();
    const rules = await db.getAll(DB.onlyTable);
    const blob = new Blob([JSON.stringify(rules, null, 2)], { type: "application/json" });
    saveAs(blob, "furigana-maker-kanji-filter.json");
  };

  const [importDialogIsOpen, setImportDialogIsOpen] = useState(false);
  const [importFailedDialogIsOpen, setImportFailedDialogIsOpen] = useState(false);
  const [importFailedMessage, setImportFailedMessage] = useState("");
  async function importConfig() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    const file: File | null | undefined = await new Promise((resolve) => {
      input.addEventListener("change", () => {
        resolve(input.files?.length ? input.files[0] : null);
      });
      input.click();
    });

    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const checkResult = checkJSONErrorMessage(reader.result as string);
        if (checkResult) {
          setImportFailedMessage(checkResult);
          setImportFailedDialogIsOpen(true);
          return;
        }
        const importedRules = JSON.parse(reader.result as string) as FilterRule[];
        const db = await getKanjiFilterDB();
        await Promise.all(
          importedRules.map(async (rule) => {
            const existingRule = await db.get(DB.onlyTable, rule.kanji);
            if (existingRule) {
              const mergedYomikatas =
                existingRule.yomikatas === undefined || rule.yomikatas === undefined
                  ? undefined
                  : Array.from(new Set([...existingRule.yomikatas, ...rule.yomikatas]));

              await db.put(DB.onlyTable, {
                ...existingRule,
                yomikatas: mergedYomikatas,
              });
            } else {
              await db.put(DB.onlyTable, rule);
            }
          }),
        );
        onChange(await db.getAll(DB.onlyTable));
      };
      reader.readAsText(file);
    }

    function checkJSONErrorMessage(data: string) {
      try {
        const RuleSchema = z.object({
          kanji: z.string(),
          yomikatas: z.array(z.string()),
        });
        const RulesSchema = z.array(RuleSchema);
        const result = RulesSchema.safeParse(JSON.parse(data));
        return result.success ? null : result.error.message;
      } catch (error) {
        return (error as Error).message;
      }
    }
  }

  const [quickStartDialogIsOpen, setQuickStartDialogIsOpen] = useState(false);
  const [quickStartInput, setQuickStartInput] = useState("");
  const batchCreateKanjiFilters = async () => {
    const db = await getKanjiFilterDB();
    const kanjiList = Array.from(
      new Set(
        quickStartInput.split(/[\s\n]+/).filter((kanji) => kanji.length > 0 && isKanji(kanji)),
      ),
    );

    await Promise.all(kanjiList.map((kanji) => db.put(DB.onlyTable, { kanji })));

    onChange(await db.getAll(DB.onlyTable));
    setQuickStartDialogIsOpen(false);
  };
  return (
    <div className={cn("flex grow flex-col items-center justify-start lg:px-8", className)}>
      <div className="flex flex-wrap items-center justify-center gap-1.5 font-bold text-base text-slate-700 dark:text-slate-300">
        <button
          onClick={onNewButtonClick}
          className="playwright-kanji-filter-add-new-rule-btn flex max-w-40 grow cursor-pointer items-center justify-center gap-1 overflow-hidden overflow-ellipsis whitespace-nowrap rounded-md bg-slate-950/5 px-1.5 py-2 text-slate-800 transition hover:text-sky-500 sm:px-3 dark:bg-white/5 dark:text-white"
        >
          <i className="i-tabler-code-plus size-5" />
          <span className="max-w-32 overflow-hidden overflow-ellipsis whitespace-nowrap">
            {t("btnAddRule")}
          </span>
        </button>
        <button
          onClick={() => {
            setClearRuleDialogIsOpen(true);
          }}
          className={cn(
            "playwright-kanji-filter-clear-config-btn",
            "flex max-w-40 grow cursor-pointer items-center justify-center gap-1 rounded-md bg-slate-950/5 px-1.5 py-2 text-slate-800 transition enabled:hover:text-sky-500 sm:px-3 dark:bg-white/5 dark:text-white",
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
          className="playwright-kanji-filter-reset-config-btn flex max-w-40 grow cursor-pointer items-center justify-center gap-1 rounded-md bg-slate-950/5 px-1.5 py-2 text-slate-800 transition hover:text-sky-500 sm:px-3 dark:bg-white/5 dark:text-white"
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
            "flex max-w-40 grow cursor-pointer items-center justify-center gap-1 overflow-hidden overflow-ellipsis whitespace-nowrap rounded-md bg-slate-950/5 px-1.5 py-2 text-slate-800 transition enabled:hover:text-sky-500 sm:px-3 dark:bg-white/5 dark:text-white",
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

        <button
          onClick={() => {
            setImportDialogIsOpen(true);
          }}
          className="playwright-kanji-filter-import-config-btn flex max-w-40 grow cursor-pointer items-center justify-center gap-1 overflow-hidden overflow-ellipsis whitespace-nowrap rounded-md bg-slate-950/5 px-1.5 py-2 text-slate-800 transition hover:text-sky-500 sm:px-3 dark:bg-white/5 dark:text-white"
        >
          <i className="i-tabler-file-import size-5" />
          <span className="max-w-32 overflow-hidden overflow-ellipsis whitespace-nowrap">
            {t("btnImportConfig")}
          </span>
        </button>
        <button
          onClick={() => {
            setQuickStartDialogIsOpen(true);
          }}
          className="playwright-kanji-filter-quick-create-btn flex max-w-40 grow cursor-pointer items-center justify-center gap-1 overflow-hidden overflow-ellipsis whitespace-nowrap rounded-md bg-slate-950/5 px-1.5 py-2 text-slate-800 transition hover:text-sky-500 sm:px-3 dark:bg-white/5 dark:text-white"
        >
          <i className="i-tabler-star size-5" />
          <span className="max-w-32 overflow-hidden overflow-ellipsis whitespace-nowrap">
            {t("btnQuickCreate")}
          </span>
        </button>
        <PopupTransition show={importDialogIsOpen}>
          <Dialog
            as="div"
            className="-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 z-40"
            onClose={() => {
              setImportDialogIsOpen(false);
            }}
          >
            <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-slate-900">
              <DialogTitle
                as="h3"
                className="font-medium text-gray-900 text-lg leading-6 dark:text-white"
              >
                {t("titleWarning")}
              </DialogTitle>
              <div className="mt-2">
                <p className="text-gray-500 text-sm dark:text-gray-400">{t("msgImportConfig")}</p>
              </div>
              <div className="mt-4 flex gap-2.5">
                <button
                  className="inline-flex cursor-pointer justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 font-medium text-slate-900 text-sm transition hover:bg-red-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:bg-red-800 dark:text-slate-200 dark:hover:bg-red-900"
                  onClick={() => {
                    importConfig();
                    setImportDialogIsOpen(false);
                  }}
                >
                  {t("btnConfirm")}
                </button>
                <button
                  className="inline-flex cursor-pointer justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 font-medium text-blue-900 text-sm transition hover:bg-blue-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  onClick={() => {
                    setImportDialogIsOpen(false);
                  }}
                >
                  {t("btnCancel")}
                </button>
              </div>
            </DialogPanel>
          </Dialog>
        </PopupTransition>

        <PopupTransition show={importFailedDialogIsOpen}>
          <Dialog
            as="div"
            className="-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 z-40 min-w-80"
            onClose={() => {
              setImportFailedDialogIsOpen(false);
            }}
          >
            <DialogPanel className="w-full min-w-[20rem] max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-slate-900">
              <DialogTitle
                as="h3"
                className="font-medium text-gray-900 text-lg leading-6 dark:text-white"
              >
                {t("warningInvalid")}
              </DialogTitle>
              <div className="mt-2">
                <p className="whitespace-pre-wrap text-gray-500 text-sm dark:text-gray-400">
                  {importFailedMessage}
                </p>
              </div>
              <div className="mt-4">
                <button
                  className="inline-flex cursor-pointer justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 font-medium text-blue-900 text-sm transition hover:bg-blue-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  onClick={() => {
                    setImportFailedDialogIsOpen(false);
                  }}
                >
                  {t("iGotIt")}
                </button>
              </div>
            </DialogPanel>
          </Dialog>
        </PopupTransition>
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
      </div>
    </div>
  );
}
