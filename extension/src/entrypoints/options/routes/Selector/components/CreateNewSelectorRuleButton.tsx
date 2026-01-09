import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelectorsStore } from "../store";
import { SelectorRuleEditorDialog } from "./SelectorRuleEditorDialog";

export const CreateNewSelectorRuleButton = () => {
  const { t } = useTranslation();
  const [createRuleDialogIsOpen, setCreateRuleDialogIsOpen] = useState(false);
  const addSelector = useSelectorsStore((state) => state.addSelectors);
  return (
    <>
      <button
        className="flex w-40 cursor-pointer items-center justify-center gap-1 overflow-hidden overflow-ellipsis whitespace-nowrap rounded-md bg-sky-600 px-1.5 py-2 text-white transition hover:bg-sky-500 sm:px-3"
        onClick={() => {
          setCreateRuleDialogIsOpen(true);
        }}
      >
        <i className="i-tabler-code-plus size-5" />
        <span className="max-w-32 overflow-hidden overflow-ellipsis whitespace-nowrap">
          {t("btnAddRule")}
        </span>
      </button>
      <SelectorRuleEditorDialog
        mode="create"
        open={createRuleDialogIsOpen}
        onCreate={(newRule) => {
          addSelector(newRule);
          setCreateRuleDialogIsOpen(false);
        }}
        onClose={() => setCreateRuleDialogIsOpen(false)}
      />
    </>
  );
};
