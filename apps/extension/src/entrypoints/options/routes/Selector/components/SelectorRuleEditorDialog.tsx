import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";

import type { SelectorRule } from "@/commons/constants";
import { cn } from "@/commons/utils";
import { PopupTransition } from "@/entrypoints/options/components/PopupTransition";

type SelectorRuleEditorDialogProps = UpdateProps | CreateProps;

interface UpdateProps {
  originalRule: SelectorRule;
  mode: "update";
  onUpdate: (newRule: SelectorRule, oldRule: SelectorRule) => void;
  onClose: () => void;
  open: boolean;
}

interface CreateProps {
  mode: "create";
  onCreate: (rule: SelectorRule) => void;
  onClose: () => void;
  open: boolean;
}

export function SelectorRuleEditorDialog(props: SelectorRuleEditorDialogProps) {
  const { mode, open, onClose } = props;
  const [domain, setDomain] = useState(mode === "create" ? "" : props.originalRule.domain);
  const [selector, setSelector] = useState(mode === "create" ? "" : props.originalRule.selector);
  const active = mode === "create" ? true : props.originalRule.active;

  function submit(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (mode === "create") {
      props.onCreate({ domain, selector, active });
    } else {
      props.onUpdate({ domain, selector, active }, props.originalRule);
    }
  }

  const { t } = useTranslation();

  return (
    <PopupTransition show={open}>
      <Dialog
        as="div"
        className="-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 z-40"
        onClose={onClose}
      >
        <DialogPanel className="w-full min-w-[28rem] max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-slate-900">
          <div className="mx-auto w-full max-w-md rounded-2xl p-2">
            <Disclosure as="div">
              {({ open }) => (
                <>
                  <DisclosureButton className="flex w-full cursor-pointer items-center justify-between rounded-lg bg-sky-100 px-4 py-2 text-left font-medium text-sky-900 text-sm hover:bg-sky-200 focus:outline-hidden focus-visible:ring-3 focus-visible:ring-sky-500/75 dark:bg-sky-900 dark:text-sky-300 dark:hover:bg-sky-700">
                    <h1>{t("disclosureSelector")}</h1>
                    <i
                      className={cn(
                        "-rotate-90 i-tabler-chevron-left size-4 text-sky-500",
                        open && "rotate-180 transform",
                      )}
                    />
                  </DisclosureButton>
                  <DisclosurePanel className="px-4 pt-4 pb-2 text-sm">
                    <section>
                      <ul className="list-disc marker:text-black dark:marker:text-white">
                        <li className="my-2">
                          <Trans
                            i18nKey="msgCssSelector"
                            components={{
                              boldSelectorField: (
                                <b className="font-semibold text-slate-900 text-sm dark:text-slate-200">
                                  {t("fieldSelector")}
                                </b>
                              ),
                              mdnCssSelectorLink: (
                                <a
                                  className="cursor-pointer border-sky-500 border-b font-semibold text-slate-900 hover:border-b-2 dark:text-slate-200"
                                  href="https://developer.mozilla.org/docs/Web/CSS/CSS_selectors"
                                >
                                  {t("cssSelector")}
                                </a>
                              ),
                            }}
                          />
                        </li>
                        <li className="my-2">{t("msgDoNotModify")}</li>
                      </ul>
                    </section>
                  </DisclosurePanel>
                </>
              )}
            </Disclosure>

            <div className="flex min-h-full flex-col justify-center p-6 lg:px-8">
              <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="text-center font-bold text-2xl text-gray-900 leading-9 tracking-tight dark:text-white">
                  {t("titleEditSelectorDialog", {
                    verbs: mode === "update" ? t("update") : t("create"),
                  })}
                </h2>
              </div>

              <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6">
                  <div>
                    <label
                      htmlFor="domain"
                      className="block font-medium text-gray-900 text-sm capitalize leading-6 before:mr-1 before:text-red-500 before:content-['*'] after:ml-0.5 dark:text-slate-200"
                    >
                      {t("fieldDomain")}
                    </label>
                    <div className="mt-2">
                      <input
                        id="domain"
                        name="domain"
                        disabled={mode === "update"}
                        required
                        placeholder="*.example.com"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-sky-600 focus:ring-inset disabled:cursor-not-allowed sm:text-sm sm:leading-6 dark:bg-slate-900 dark:text-white dark:ring-gray-700 dark:focus:ring-sky-600"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="selector"
                        className="block font-medium text-gray-900 text-sm capitalize leading-6 before:mr-1 before:text-red-500 before:content-['*'] after:ml-0.5 dark:text-slate-200"
                      >
                        {t("fieldSelector")}
                      </label>
                    </div>
                    <div className="mt-2">
                      <input
                        id="selector"
                        name="selector"
                        required
                        placeholder="body"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-sky-600 focus:ring-inset sm:text-sm sm:leading-6 dark:bg-slate-900 dark:text-white dark:ring-gray-700 dark:focus:ring-sky-600"
                        value={selector}
                        onChange={(e) => setSelector(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      className="flex w-full cursor-pointer justify-center rounded-md bg-sky-600 px-3 py-1.5 font-semibold text-sm text-white leading-6 shadow-xs focus-visible:outline-2 focus-visible:outline-sky-600 focus-visible:outline-offset-2 enabled:hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={!(domain && selector)}
                      onClick={submit}
                    >
                      {t("submit")}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </PopupTransition>
  );
}
