import { Dialog, DialogPanel, DialogTitle, Field, Input } from "@headlessui/react";
import { t } from "i18next";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DomainFieldDesc } from "@/entrypoints/options/components/DomainFieldDesc";
import { PopupTransition } from "../../../components/PopupTransition";

interface ExclusionHandlerProps {
  sites: string[];
  onChange: (sites: string[]) => void;
}
export function ExclusionHandler({ sites, onChange }: ExclusionHandlerProps) {
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
            className="cursor-pointer rounded-md bg-slate-950/5 px-4 py-2 text-slate-800 transition hover:text-sky-500 dark:bg-white/5 dark:text-white"
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
                <div className="mt-2 pl-4">
                  <DomainFieldDesc />
                </div>
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
                    placeholder="www.example.com"
                    autoFocus={true}
                    className={
                      "mt-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-sky-600 focus:ring-inset disabled:cursor-not-allowed sm:text-sm sm:leading-6 dark:bg-slate-900 dark:text-white dark:ring-gray-700 dark:focus:ring-sky-600"
                    }
                  />
                </Field>
                <div className="mt-3 flex w-full justify-end gap-2">
                  <button
                    className="cursor-pointer rounded-md bg-slate-950/5 px-4 py-2 text-slate-800 transition hover:text-sky-500 dark:bg-white/5 dark:text-white"
                    onClick={() => {
                      setInput("");
                      setDialogIsOpen(false);
                    }}
                  >
                    {t("btnCancel")}
                  </button>
                  <button
                    className="cursor-pointer rounded-md bg-sky-600 px-4 py-2 text-white transition enabled:hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!input}
                    onClick={() => {
                      onChange([...sites, input.replace(/^https?:\/\//, "")]);
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
            className="cursor-pointer text-nowrap rounded-md bg-slate-950/5 px-4 py-2 text-slate-800 transition hover:text-sky-500 dark:bg-white/5 dark:text-white"
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
    <div className="space-y-2 rounded-lg bg-slate-950/5 p-4 text-slate-800 dark:bg-white/5 dark:text-slate-200">
      {sites.length === 0 ? (
        <div className="flex items-center justify-center">{t("messageEmptyList")}</div>
      ) : (
        sites.map((site) => (
          <div key={site} className="flex justify-between">
            <div className="select-all">{site}</div>
            <button
              className="flex cursor-pointer items-center text-slate-300 hover:text-slate-100"
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
