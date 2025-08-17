import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Field,
  Input,
  Label,
} from "@headlessui/react";
import { trimStart } from "es-toolkit";
import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import type { SelectorRule } from "@/commons/constants";
import { cn } from "@/commons/utils";
import { DomainFieldDesc } from "@/entrypoints/options/components/DomainFieldDesc";
import { PopupTransition } from "@/entrypoints/options/components/PopupTransition";
import { useSelectorsStore } from "../store";

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
  const selectorRules = useSelectorsStore((state) => state.selectors);
  const [domainInput, setDomainInput] = useState(
    mode === "create" ? "" : props.originalRule.domain,
  );
  const [selectorInput, setSelectorInput] = useState(
    mode === "create" ? "" : props.originalRule.selector,
  );
  const active = mode === "create" ? true : props.originalRule.active;

  const { t } = useTranslation();

  const [domainInputErrorMessage, setDomainInputErrorMessage] = useState("");
  const [selectorInputErrorMessage, setSelectorInputErrorMessage] = useState("");
  const validateDomainInput = (domain: string) => {
    setDomainInputErrorMessage("");
    if (domain.length === 0) {
      setDomainInputErrorMessage(t("validationRequired"));
      return false;
    }

    const selectorIsDuplicated = selectorRules.some((rule) => rule.domain === domain);
    if (
      (mode === "create" && selectorIsDuplicated) ||
      (mode === "update" && domain !== props.originalRule.domain && selectorIsDuplicated)
    ) {
      setDomainInputErrorMessage(t("validationNonRepetitiveDomain"));
      return false;
    }

    return true;
  };

  const validateSelectorInput = (selector: string) => {
    setSelectorInputErrorMessage("");
    if (selector.length === 0) {
      setSelectorInputErrorMessage(t("validationRequired"));
      return false;
    }
    return true;
  };

  function handleSubmit() {
    const valid = validateDomainInput(domainInput) && validateSelectorInput(selectorInput);
    if (valid) {
      const newRule = { domain: domainInput, selector: selectorInput, active };
      if (mode === "create") {
        props.onCreate(newRule);
      } else {
        props.onUpdate(newRule, props.originalRule);
      }
      onClose();
    }
  }

  return (
    <PopupTransition show={open}>
      <Dialog
        as="div"
        className="-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 z-40 max-h-[80vh] overflow-y-scroll"
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
            <Disclosure as="div">
              {({ open }) => (
                <>
                  <DisclosureButton className="mt-3 flex w-full cursor-pointer items-center justify-between rounded-lg bg-sky-100 px-4 py-2 text-left font-medium text-sky-900 text-sm hover:bg-sky-200 focus:outline-hidden focus-visible:ring-3 focus-visible:ring-sky-500/75 dark:bg-sky-900 dark:text-sky-300 dark:hover:bg-sky-700">
                    <h1>{t("disclosureDomain")}</h1>
                    <i
                      className={cn(
                        "-rotate-90 i-tabler-chevron-left size-4 text-sky-500",
                        open && "rotate-180 transform",
                      )}
                    />
                  </DisclosureButton>
                  <DisclosurePanel className="px-4 pt-4 pb-2 text-sm">
                    <ul className="list-disc marker:text-black dark:marker:text-white">
                      <DomainFieldDesc />
                    </ul>
                  </DisclosurePanel>
                </>
              )}
            </Disclosure>
            <div className="flex min-h-full flex-col justify-center p-6 lg:px-8">
              <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <DialogTitle
                  as="h3"
                  className="text-center font-bold text-2xl text-gray-900 leading-9 tracking-tight dark:text-white"
                >
                  {t("titleEditSelectorDialog", {
                    verbs: mode === "update" ? t("update") : t("create"),
                  })}
                </DialogTitle>
              </div>

              <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="space-y-6">
                  <Field className="relative">
                    <Label
                      htmlFor="domain"
                      className="block font-medium text-gray-900 text-sm capitalize leading-6 before:mr-1 before:text-red-500 before:content-['*'] after:ml-0.5 dark:text-slate-200"
                    >
                      {t("fieldDomain")}
                    </Label>
                    <div className="mt-2">
                      <Input
                        id="domain"
                        name="domain"
                        required
                        placeholder="*.example.com"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-sky-600 focus:ring-inset disabled:cursor-not-allowed sm:text-sm sm:leading-6 dark:bg-slate-900 dark:text-white dark:ring-gray-700 dark:focus:ring-sky-600"
                        value={domainInput}
                        onChange={(e) => {
                          const value = e.target.value.trim().replace(/^https?:\/\//, "");
                          setDomainInput(value);
                          validateDomainInput(value);
                        }}
                      />
                    </div>
                    <p className="-bottom-5 absolute left-0 text-red-500">
                      {domainInputErrorMessage}
                    </p>
                  </Field>

                  <Field className="relative">
                    <Label
                      htmlFor="selector"
                      className="block font-medium text-gray-900 text-sm capitalize leading-6 before:mr-1 before:text-red-500 before:content-['*'] after:ml-0.5 dark:text-slate-200"
                    >
                      {t("fieldSelector")}
                    </Label>
                    <div className="mt-2">
                      <Input
                        id="selector"
                        name="selector"
                        required
                        placeholder="body"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-sky-600 focus:ring-inset sm:text-sm sm:leading-6 dark:bg-slate-900 dark:text-white dark:ring-gray-700 dark:focus:ring-sky-600"
                        value={selectorInput}
                        onChange={(e) => {
                          const value = trimStart(e.target.value);
                          setSelectorInput(value);
                          validateSelectorInput(value);
                        }}
                      />
                    </div>
                    <p className="-bottom-5 absolute left-0 text-red-500">
                      {selectorInputErrorMessage}
                    </p>
                  </Field>

                  <div>
                    <button
                      className="flex w-full cursor-pointer justify-center rounded-md bg-sky-600 px-3 py-1.5 font-semibold text-sm text-white leading-6 shadow-xs focus-visible:outline-2 focus-visible:outline-sky-600 focus-visible:outline-offset-2 enabled:hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={!!domainInputErrorMessage || !!selectorInputErrorMessage}
                      onClick={handleSubmit}
                    >
                      {t("submit")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </PopupTransition>
  );
}
