import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { t } from "i18next";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import type { SelectorRule } from "@/commons/constants";
import { PopupTransition } from "@/entrypoints/options/components/PopupTransition";
import { useSelectorsStore } from "../store";

function validateJSONStructure(data: string) {
  const RuleSchema = z.object({
    domain: z.string(),
    selector: z.string(),
    active: z.boolean(),
  });
  const RulesSchema = z.array(RuleSchema);
  const result = RulesSchema.safeParse(JSON.parse(data));
  if (!result.success) {
    return { success: false, error: result.error.message } as const;
  }
  return { success: true, data: result.data } as const;
}

function validateRulesData(rules: SelectorRule[], existedRules: SelectorRule[]) {
  const domainSet = new Set<string>();
  const duplicatedDomains = new Set<string>();
  const existedDomains = new Set<string>();
  const dbDomains = new Set(existedRules.map((rule) => rule.domain));
  for (const rule of rules) {
    if (dbDomains.has(rule.domain)) {
      existedDomains.add(rule.domain);
      continue;
    }
    if (domainSet.has(rule.domain)) {
      duplicatedDomains.add(rule.domain);
    }
    domainSet.add(rule.domain);
  }

  return { duplicatedDomains, existedDomains };
}

function generateValidationMessages(duplicatedDomains: Set<string>, existedDomains: Set<string>) {
  const messages = [t("importFailedTip")];
  if (duplicatedDomains.size > 0) {
    messages.push(
      t("importFailedCauseByDuplicatedDomains", {
        domains: Array.from(duplicatedDomains).join(", "),
      }),
    );
  }
  if (existedDomains.size > 0) {
    messages.push(
      t("importFailedCauseByExistedDomain", { domains: Array.from(existedDomains).join(", ") }),
    );
  }
  return messages.join("\n");
}
function checkJSONErrorMessage(data: string, existedRules: SelectorRule[]) {
  try {
    const structureResult = validateJSONStructure(data);
    if (!structureResult.success) {
      return structureResult.error;
    }

    const { existedDomains, duplicatedDomains } = validateRulesData(
      structureResult.data,
      existedRules,
    );
    if (existedDomains.size === 0 && duplicatedDomains.size === 0) {
      return null;
    }
    return generateValidationMessages(existedDomains, duplicatedDomains);
  } catch (error) {
    return (error as Error).message;
  }
}
export const ImportSelectorRuleButton = () => {
  const [importDialogIsOpen, setImportDialogIsOpen] = useState(false);
  const [importFailedDialogIsOpen, setImportFailedDialogIsOpen] = useState(false);
  const [importFailedMessage, setImportFailedMessage] = useState("");
  const addSelectors = useSelectorsStore((state) => state.addSelectors);
  const selectors = useSelectorsStore((state) => state.selectors);
  const { t } = useTranslation();

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
      reader.onload = () => {
        const checkResult = checkJSONErrorMessage(reader.result as string, selectors);
        if (checkResult) {
          setImportFailedMessage(checkResult);
          setImportFailedDialogIsOpen(true);
          return;
        }
        const importedRules = JSON.parse(reader.result as string) as SelectorRule[];
        addSelectors(...importedRules);
      };
      reader.readAsText(file);
    }
  }

  return (
    <>
      <button
        className="flex w-40 cursor-pointer items-center justify-center gap-1 overflow-hidden overflow-ellipsis whitespace-nowrap rounded-md bg-slate-950/5 px-1.5 py-2 text-slate-800 transition hover:text-sky-500 sm:px-3 dark:bg-white/5 dark:text-white"
        onClick={() => {
          setImportDialogIsOpen(true);
        }}
      >
        <i className="i-tabler-file-import size-5" />
        <span className="max-w-32 overflow-hidden overflow-ellipsis whitespace-nowrap">
          {t("btnImportConfig")}
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
              {t("titleNote")}
            </DialogTitle>
            <div className="mt-2">
              <p className="text-gray-500 text-sm dark:text-gray-400">{t("msgImportConfig")}</p>
            </div>
            <div className="mt-4 flex gap-2.5">
              <button
                className="inline-flex cursor-pointer justify-center rounded-md border border-transparent bg-sky-600 px-4 py-2 font-medium text-sm text-white shadow-xs transition hover:bg-sky-500 focus:outline-hidden focus-visible:outline-2 focus-visible:outline-sky-600 focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-offset-2"
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
    </>
  );
};
