import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useKanjiFiltersStore } from "../store";
import { KanjiFilterEditorDialog } from "./KanjiFilterEditorDialog";

export const CreateKanjiFilterButton = () => {
  const { t } = useTranslation();
  const [createDialogIsOpen, setCreateDialogIsOpen] = useState(false);
  const addKanjiFilter = useKanjiFiltersStore((state) => state.addKanjiFilter);
  return (
    <>
      <button
        onClick={() => {
          setCreateDialogIsOpen(true);
        }}
        className="playwright-kanji-filter-add-new-rule-btn flex max-w-40 grow cursor-pointer items-center justify-center gap-1 overflow-hidden overflow-ellipsis whitespace-nowrap rounded-md bg-slate-950/5 px-1.5 py-2 text-slate-800 transition hover:text-sky-500 sm:px-3 dark:bg-white/5 dark:text-white"
      >
        <i className="i-tabler-code-plus size-5" />
        <span className="max-w-32 overflow-hidden overflow-ellipsis whitespace-nowrap">
          {t("btnAddRule")}
        </span>
      </button>
      {createDialogIsOpen && (
        <KanjiFilterEditorDialog
          mode="create"
          open={createDialogIsOpen}
          onCreate={addKanjiFilter}
          onClose={() => {
            setCreateDialogIsOpen(false);
          }}
        />
      )}
    </>
  );
};
