import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { SelectorRule } from "@/commons/constants";

import PopupTransition from "./PopupTransition";
import RuleEditor from "./SelectorRuleEditor";

interface SelectorRuleItemProps {
  rule: SelectorRule;
  index: number;
  onChange: (rule: SelectorRule) => void;
  onDelete: (rule: SelectorRule) => void;
}

export default function SelectorRuleItem({
  rule,
  onChange,
  onDelete,
  index,
}: SelectorRuleItemProps) {
  const [editorDialogIsOpen, setEditorIsOpen] = useState(false);
  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);

  const { t } = useTranslation();

  return (
    <>
      <div className="flex flex-col justify-between gap-x-6 py-5 sm:flex-row">
        <div className="flex min-w-0 gap-x-4">
          <div className="relative size-12">
            <i className="i-tabler-layers-intersect absolute size-12 flex-none bg-slate-950/5 dark:bg-white/5" />
            <div className="flex size-12 items-center justify-center font-bold text-slate-900 italic dark:text-white">
              {index + 1}
            </div>
          </div>
          <div className="flex-auto">
            <a
              className="w-auto flex-inline items-center truncate font-semibold text-black text-sm leading-6 underline decoration-solid transition dark:text-white"
              href={encodeURI(`https://${rule.domain}`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {rule.domain}
              <i className="i-tabler-arrow-up-right" />
            </a>
            <p className="w-64 truncate text-xs leading-5 sm:w-96 xl:w-[32rem] 2xl:w-[40rem]">
              {rule.selector}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end">
          <div className="flex w-full items-center justify-between gap-x-1.5 sm:flex-col sm:items-end sm:justify-evenly">
            <button
              className="flex cursor-pointer items-center gap-1 rounded-md px-1.5 py-0.5"
              onClick={() => {
                onChange({ ...rule, active: !rule.active });
              }}
            >
              <div className="text-sm leading-5 transition hover:text-slate-950 dark:hover:text-white">
                {rule.active ? t("markActive") : t("markInactive")}
              </div>
              <span className="relative flex size-2">
                <span
                  className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                    rule.active ? "bg-sky-400" : "bg-gray-400"
                  }`}
                />
                <span
                  className={`relative inline-flex size-2 rounded-full ${
                    rule.active ? "bg-sky-500" : "bg-gray-500"
                  }`}
                />
              </span>
            </button>
            <div className="mt-1 flex gap-x-1.5">
              <button
                className="flex cursor-pointer items-center gap-1 rounded-md bg-slate-950/5 px-2 py-1 text-slate-800 transition hover:text-sky-500 dark:bg-white/5 dark:text-white"
                onClick={() => {
                  setEditorIsOpen(true);
                }}
              >
                <i className="i-tabler-edit size-4" />
                {t("btnEdit")}
              </button>
              <button
                className="flex cursor-pointer items-center gap-1 rounded-md bg-slate-950/5 px-2 py-1 text-slate-800 transition hover:text-sky-500 dark:bg-white/5 dark:text-white"
                onClick={() => {
                  setDeleteDialogIsOpen(true);
                }}
              >
                <i className="i-tabler-trash size-4" />
                {t("btnDelete")}
              </button>
            </div>
          </div>
        </div>
      </div>

      <PopupTransition show={editorDialogIsOpen}>
        <Dialog
          as="div"
          className="-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 z-40"
          onClose={() => {
            setEditorIsOpen(false);
          }}
        >
          <DialogPanel className="w-full min-w-[28rem] max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-slate-900">
            <RuleEditor
              rule={rule}
              mode="update"
              onChange={(rule) => {
                onChange(rule);
                setEditorIsOpen(false);
              }}
            />
          </DialogPanel>
        </Dialog>
      </PopupTransition>

      <PopupTransition show={deleteDialogIsOpen}>
        <Dialog
          as="div"
          className="-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 z-40"
          onClose={() => {
            setDeleteDialogIsOpen(false);
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
              <p className="text-gray-500 text-sm dark:text-gray-400">{t("msgDeleteRule")}</p>
            </div>
            <div className="mt-4 flex gap-2.5">
              <button
                className="inline-flex cursor-pointer justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 font-medium text-slate-900 text-sm transition hover:bg-red-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:bg-red-800 dark:text-slate-200 dark:hover:bg-red-900"
                onClick={() => {
                  onDelete(rule);
                  setDeleteDialogIsOpen(false);
                }}
              >
                {t("btnDelete")}
              </button>
              <button
                className="inline-flex cursor-pointer justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 font-medium text-blue-900 text-sm transition hover:bg-blue-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                onClick={() => {
                  setDeleteDialogIsOpen(false);
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
}
