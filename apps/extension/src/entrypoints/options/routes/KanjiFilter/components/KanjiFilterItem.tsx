import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { FilterRule } from "@/commons/constants";
import { PopupTransition } from "@/entrypoints/options/components/PopupTransition";
import { useKanjiFiltersStore } from "../store";
import { KanjiFilterEditorDialog } from "./KanjiFilterEditorDialog";

interface KanjiFilterItemProps {
  rule: FilterRule;
  index: number;
}

export const KanjiFilterItem = ({ rule, index }: KanjiFilterItemProps) => {
  const [updateDialogIsOpen, setUpdateDialogIsOpen] = useState(false);
  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);

  const removeKanjiFilter = useKanjiFiltersStore((state) => state.removeKanjiFilter);
  const editKanjiFilter = useKanjiFiltersStore((state) => state.editKanjiFilter);

  const { t } = useTranslation();

  return (
    <>
      <div className="playwright-kanji-filter-item relative" key={rule.kanji}>
        <div className="pointer-events-none absolute right-4 bottom-4 font-semibold text-lg italic opacity-30">
          #{index + 1}
        </div>
        <button
          onClick={() => {
            setUpdateDialogIsOpen(true);
          }}
          className="group grid w-40 cursor-pointer grid-cols-5 grid-rows-2 rounded-md bg-slate-950/5 px-4 py-2 sm:w-50 lg:w-55 dark:bg-white/5"
        >
          <div className="col-span-4 row-start-1 max-w-full justify-self-start overflow-hidden text-ellipsis whitespace-nowrap text-lg text-slate-800 dark:text-white">
            {rule.kanji}
          </div>
          <div className="col-span-5 row-start-2 max-w-full justify-self-start overflow-hidden text-ellipsis whitespace-nowrap">
            {rule.yomikatas ? rule.yomikatas.join(", ") : t("fieldMatchAll")}
          </div>
          <i className="i-tabler-edit col-start-5 row-start-1 size-5 scale-0 self-center justify-self-center text-slate-800 opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100 dark:text-white" />
        </button>
        <button
          onClick={() => {
            setDeleteDialogIsOpen(true);
          }}
          className="playwright-kanji-filter-item-delete-btn -translate-y-1/2 absolute top-0 right-0 translate-x-1/2 cursor-pointer rounded-full bg-white transition hover:text-slate-800 dark:bg-slate-900 dark:hover:text-white"
        >
          <div className="grid size-5 place-content-center rounded-full bg-slate-950/5 dark:bg-white/5">
            <i className="i-tabler-x size-4" />
            <span className="sr-only">{t("btnDelete")}</span>
          </div>
        </button>
      </div>
      {updateDialogIsOpen && (
        <KanjiFilterEditorDialog
          mode="update"
          open={updateDialogIsOpen}
          onUpdate={editKanjiFilter}
          onClose={() => {
            setUpdateDialogIsOpen(false);
          }}
          originalRule={rule}
        />
      )}
      {deleteDialogIsOpen && (
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
                <p className="whitespace-pre-line text-gray-500 text-sm dark:text-gray-400">
                  {`${t("msgDeleteKanjiFilterDesc", {
                    kanji: rule.kanji,
                  })}\n ${t("msgDeleteRule")}`}
                </p>
              </div>
              <div className="mt-4 flex gap-2.5">
                <button
                  className="inline-flex cursor-pointer justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 font-medium text-slate-900 text-sm transition hover:bg-red-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:bg-red-800 dark:text-slate-200 dark:hover:bg-red-900"
                  onClick={() => {
                    removeKanjiFilter(rule.kanji);
                    setDeleteDialogIsOpen(false);
                  }}
                >
                  {t("btnConfirm")}
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
      )}
    </>
  );
};
