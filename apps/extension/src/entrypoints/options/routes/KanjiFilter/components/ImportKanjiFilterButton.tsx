import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import type { FilterRule } from "@/commons/constants";
import { DB, getKanjiFilterDB } from "@/commons/utils";
import { PopupTransition } from "@/entrypoints/options/components/PopupTransition";
import { useKanjiFiltersStore } from "../store";

export const ImportKanjiFilterButton = () => {
  const [importDialogIsOpen, setImportDialogIsOpen] = useState(false);
  const [importFailedDialogIsOpen, setImportFailedDialogIsOpen] = useState(false);
  const [importFailedMessage, setImportFailedMessage] = useState("");

  const addKanjiFilters = useKanjiFiltersStore((state) => state.addKanjiFilter);
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
        addKanjiFilters(...importedRules);
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
  const { t } = useTranslation();
  return (
    <>
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
    </>
  );
};
