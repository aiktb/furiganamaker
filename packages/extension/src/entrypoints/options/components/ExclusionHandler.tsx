import { Dialog, DialogPanel, DialogTitle, Field, Input } from "@headlessui/react";
import { t } from "i18next";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import PopupTransition from "./PopupTransition";

interface ExclusionHandlerProps {
  sites: string[];
  onChange: (sites: string[]) => void;
}
export default function ExclusionHandler({ sites, onChange }: ExclusionHandlerProps) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const { t } = useTranslation();

  return (
    <li className="w-full items-center justify-between gap-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="font-bold text-lg text-slate-800 dark:text-slate-200">
            {t("settingsExclusionList")}
          </div>
          <div>{t("settingsExclusionListDesc")}</div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            className="rounded-md bg-slate-950/5 px-4 py-2 text-slate-800 dark:bg-white/5 dark:text-white"
            onClick={() => {
              setDialogIsOpen(true);
            }}
          >
            {t("btnAdd")}
          </button>
          <PopupTransition show={dialogIsOpen}>
            <Dialog
              as="div"
              className="-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 z-40"
              onClose={() => {
                setDialogIsOpen(false);
              }}
            >
              <DialogPanel className="w-full min-w-[28rem] max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle text-base shadow-xl transition-all dark:bg-slate-900">
                <DialogTitle
                  as="h3"
                  className="font-medium text-gray-900 text-lg leading-6 dark:text-white"
                >
                  {t("dialogExcludeTitle")}
                </DialogTitle>
                <Field>
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && input) {
                        onChange([...sites, input]);
                        setInput("");
                        setDialogIsOpen(false);
                      }
                    }}
                    placeholder="example.com"
                    autoFocus={true}
                    className={
                      "mt-3 block w-full rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white focus:outline-none data-[focus]:outline-2 data-[focus]:outline-sky-400 data-[focus]:outline-offset-1"
                    }
                  />
                </Field>
                <div className="mt-3 flex w-full justify-end gap-2">
                  <button
                    className="rounded-md bg-slate-950/5 px-4 py-2 text-slate-800 dark:bg-white/5 dark:text-white"
                    onClick={() => {
                      setInput("");
                      setDialogIsOpen(false);
                    }}
                  >
                    {t("btnCancel")}
                  </button>
                  <button
                    className="rounded-md bg-slate-950/5 px-4 py-2 text-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white/5 dark:text-white"
                    disabled={!input}
                    onClick={() => {
                      onChange([...sites, input]);
                      setInput("");
                      setDialogIsOpen(false);
                    }}
                  >
                    {t("btnOK")}
                  </button>
                </div>
              </DialogPanel>
            </Dialog>
          </PopupTransition>
          <button
            className="text-nowrap rounded-md bg-slate-950/5 px-4 py-2 text-slate-800 dark:bg-white/5 dark:text-white"
            onClick={() => onChange([])}
          >
            {t("btnClearAll")}
          </button>
        </div>
      </div>
      <SiteList sites={sites} onChange={onChange} />
    </li>
  );
}

function SiteList({ sites, onChange }: ExclusionHandlerProps) {
  return (
    <div className="space-y-2 rounded-lg bg-slate-950/5 p-4 text-slate-800 dark:bg-white/5 dark:text-slate-200 ">
      {sites.length === 0 ? (
        <div className="flex items-center justify-center">{t("messageEmptyList")}</div>
      ) : (
        sites.map((site) => (
          <div key={site} className="flex justify-between">
            <div className="select-all">{site}</div>
            <button
              className="flex items-center text-slate-300 hover:text-slate-100"
              onClick={() => {
                onChange(sites.filter((s) => s !== site));
              }}
            >
              <span className="sr-only">{t("btnDelete")}</span>
              <i className="i-tabler-x size-5" />
            </button>
          </div>
        ))
      )}
    </div>
  );
}
