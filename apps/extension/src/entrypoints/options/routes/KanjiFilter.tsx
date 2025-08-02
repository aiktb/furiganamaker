import { Dialog, DialogPanel, DialogTitle, Transition } from "@headlessui/react";
import { Suspense, use, useState } from "react";
import { useTranslation } from "react-i18next";
import { ExtEvent, type FilterRule } from "@/commons/constants";
import { cn, DB, getKanjiFilterDB } from "@/commons/utils";

import KanjiFilterDashboard from "../components/KanjiFilterDashboard";
import KanjiFilterEditorDialog from "../components/KanjiFilterEditorDialog";
import NotFoundRule from "../components/NotFoundRule";
import Page from "../components/Page";
import PopupTransition from "../components/PopupTransition";

export default function KanjiFilter() {
  const { t } = useTranslation();
  const getKanjiFilterRules = async () => {
    const db = await getKanjiFilterDB();
    const rules = await db.getAll(DB.onlyTable);
    return rules;
  };

  return (
    <Page title={t("navKanjiFilter")} icon="i-tabler-filter">
      <Suspense>
        <Transition
          as="div"
          appear
          show={true}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <KanjiFilterPage
            className="playwright-kanji-filter-page"
            promise={getKanjiFilterRules()}
          />
        </Transition>
      </Suspense>
    </Page>
  );
}

interface KanjiFilterPageProps {
  promise: Promise<FilterRule[]>;
  className?: string;
}

const KanjiFilterPage = ({ promise, className }: KanjiFilterPageProps) => {
  const [rules, setRules] = useState(use(promise));
  const { t } = useTranslation();

  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);
  const [kanjiToDelete, setKanjiToDelete] = useState<string>();
  const deleteKanjiFilter = async (kanji: string) => {
    const db = await getKanjiFilterDB();
    await db.delete(DB.onlyTable, kanji);
    const updatedRules = rules.filter((rule) => rule.kanji !== kanji);
    setRules(updatedRules);
    browser.runtime.sendMessage(ExtEvent.ModifyKanjiFilter);
  };

  const [updateOrCreateDialogIsOpen, setUpdateOrCreateDialogIsOpen] = useState(false);
  const [ruleToUpdateOrCreate, setRuleToUpdateOrCreate] = useState<FilterRule>();

  const handleCreateKanjiFilter = async (rule: FilterRule) => {
    const db = await getKanjiFilterDB();
    await db.add(DB.onlyTable, rule);
    setRules([rule, ...rules]);
    browser.runtime.sendMessage(ExtEvent.ModifyKanjiFilter);
  };

  const handleUpdateKanjiFilter = async (oldRule: FilterRule, newRule: FilterRule) => {
    const db = await getKanjiFilterDB();
    const tx = db.transaction(DB.onlyTable, "readwrite");
    await tx.store.delete(oldRule.kanji);
    await tx.store.add(newRule);
    await tx.done;
    const updatedRules = rules.map((rule) => (rule.kanji === oldRule.kanji ? newRule : rule));
    setRules(updatedRules);
    browser.runtime.sendMessage(ExtEvent.ModifyKanjiFilter);
  };
  return (
    <>
      <div
        className={cn(
          "flex w-full flex-col items-center justify-center lg:max-w-5xl lg:px-8",
          className,
        )}
      >
        <KanjiFilterDashboard
          className="mb-5"
          disableExportAndClear={rules.length === 0}
          onChange={(rules) => {
            setRules(rules);
            browser.runtime.sendMessage(ExtEvent.ModifyKanjiFilter);
          }}
          onNewButtonClick={() => {
            setRuleToUpdateOrCreate(undefined);
            setUpdateOrCreateDialogIsOpen(true);
          }}
        />
        {rules.length > 0 ? (
          <div className="grid grid-cols-2 flex-wrap gap-3 sm:grid-cols-3 2xl:grid-cols-4">
            {rules.map((rule, index) => (
              <div className="playwright-kanji-filter-item relative" key={rule.kanji}>
                <div className="pointer-events-none absolute right-4 bottom-4 font-semibold text-lg italic opacity-30">
                  #{index + 1}
                </div>
                <button
                  onClick={() => {
                    setRuleToUpdateOrCreate(rule);
                    setUpdateOrCreateDialogIsOpen(true);
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
                    setKanjiToDelete(rule.kanji);
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
            ))}
          </div>
        ) : (
          <NotFoundRule />
        )}
      </div>
      {updateOrCreateDialogIsOpen && (
        <KanjiFilterEditorDialog
          mode={ruleToUpdateOrCreate ? "update" : "create"}
          open={updateOrCreateDialogIsOpen}
          onCreate={handleCreateKanjiFilter}
          onUpdate={handleUpdateKanjiFilter}
          onClose={() => {
            setUpdateOrCreateDialogIsOpen(false);
          }}
          rule={ruleToUpdateOrCreate}
        />
      )}
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
                  kanji: kanjiToDelete,
                })}\n ${t("msgDeleteRule")}`}
              </p>
            </div>
            <div className="mt-4 flex gap-2.5">
              <button
                className="inline-flex cursor-pointer justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 font-medium text-slate-900 text-sm transition hover:bg-red-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:bg-red-800 dark:text-slate-200 dark:hover:bg-red-900"
                onClick={() => {
                  if (kanjiToDelete) {
                    deleteKanjiFilter(kanjiToDelete);
                  }
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
    </>
  );
};
