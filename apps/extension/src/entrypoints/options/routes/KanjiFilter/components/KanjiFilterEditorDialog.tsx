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
  Switch,
} from "@headlessui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { isKanji, isKatakana } from "wanakana";
import type { FilterRule } from "@/commons/constants";

import { PopupTransition } from "../../../components/PopupTransition";
import { useKanjiFiltersStore } from "../store";
import { YomikatasInput } from "./YomikatasInput";

interface UpdateProps {
  mode: "update";
  open: boolean;
  onClose: () => void;
  onUpdate: (newRule: FilterRule, oldRule: FilterRule) => void;
  originalRule: FilterRule;
}

interface CreateProps {
  mode: "create";
  open: boolean;
  onClose: () => void;
  onCreate: (rule: FilterRule) => void;
}

type KanjiFilterEditorDialogProps = UpdateProps | CreateProps;

export function KanjiFilterEditorDialog(props: KanjiFilterEditorDialogProps) {
  const { onClose, open, mode } = props;
  const { t } = useTranslation();
  const [kanjiInput, setKanjiInput] = useState(mode === "create" ? "" : props.originalRule.kanji);
  const kanjiFilters = useKanjiFiltersStore((state) => state.kanjiFilters);
  const [yomikatasInput, setYomikatasInput] = useState(
    mode === "create" ? [] : (props.originalRule.yomikatas ?? []),
  );
  const [matchAll, setMatchAll] = useState(
    mode === "create" ? false : props.originalRule.yomikatas === undefined,
  );

  const [kanjiInputErrorMessage, setKanjiInputErrorMessage] = useState("");
  const [yomikatasInputErrorMessage, setYomikatasInputErrorMessage] = useState("");
  const validateKanjiInput = (kanji: string) => {
    setKanjiInputErrorMessage("");
    if (kanji.length === 0) {
      setKanjiInputErrorMessage(t("validationRequired"));
      return false;
    }

    if (!isKanji(kanji)) {
      setKanjiInputErrorMessage(t("validationPureKanji"));
      return false;
    }

    const kanjiIsDuplicated = kanjiFilters.some((filter) => filter.kanji === kanji);
    if (
      (mode === "create" && kanjiIsDuplicated) ||
      (mode === "update" && kanji !== props.originalRule.kanji && kanjiIsDuplicated)
    ) {
      setKanjiInputErrorMessage(t("validationNonRepetitiveKanji"));
      return false;
    }

    return true;
  };

  const validateYomikatasInput = (yomikatas: string[]) => {
    setYomikatasInputErrorMessage("");

    if (yomikatas.length === 0 && !matchAll) {
      setYomikatasInputErrorMessage(t("validationRequired"));
      return false;
    }
    if (yomikatas.some((input) => !isKatakana(input))) {
      setYomikatasInputErrorMessage(t("validationPureKatakana"));
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    const valid = validateKanjiInput(kanjiInput) && validateYomikatasInput(yomikatasInput);
    if (!valid) {
      return;
    }
    const newRule = {
      kanji: kanjiInput,
      yomikatas: matchAll ? undefined : yomikatasInput,
    };
    if (mode === "create") {
      props.onCreate(newRule);
    } else {
      props.onUpdate(newRule, props.originalRule);
    }
    onClose();
  };

  return (
    <PopupTransition show={open}>
      <Dialog
        as="div"
        className="-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 z-40 max-h-[60vh] overflow-y-auto"
        onClose={onClose}
      >
        <DialogPanel className="w-full min-w-[28rem] max-w-md transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all sm:mx-auto sm:w-full sm:max-w-sm dark:bg-slate-900">
          <Disclosure as="div">
            {({ open }) => (
              <>
                <DisclosureButton className="flex w-full cursor-pointer items-center justify-between rounded-lg bg-sky-100 px-4 py-2 text-left font-semibold text-sky-900 text-sm hover:bg-sky-200 focus:outline-hidden focus-visible:ring-3 focus-visible:ring-sky-500/75 dark:bg-sky-900 dark:text-sky-300 dark:hover:bg-sky-700">
                  <h1>{t("createKanjiFilterDialogTitle")}</h1>
                  <i
                    className={`${
                      open ? "rotate-180 transform" : ""
                    } -rotate-90 i-tabler-chevron-left size-4 text-sky-500`}
                  />
                </DisclosureButton>
                <DisclosurePanel className="text-pretty px-4 pt-4 pb-2 text-sm">
                  <ul className="list-disc marker:text-black dark:marker:text-white">
                    <li className="my-2">{t("createKanjiFilterDialogDesc1")}</li>
                    <li className="my-2">{t("createKanjiFilterDialogDesc2")}</li>
                  </ul>
                </DisclosurePanel>
              </>
            )}
          </Disclosure>

          <div className="flex min-h-full flex-col justify-center p-6 lg:px-8">
            <DialogTitle
              as="h3"
              className="text-center font-bold text-2xl text-slate-900 leading-9 tracking-tight dark:text-white"
            >
              {t("titleKanjiFilterEditor", {
                verbs: mode === "update" ? t("update") : t("create"),
              })}
            </DialogTitle>
            <div className="mt-10 space-y-6 sm:mx-auto sm:w-full sm:max-w-sm">
              <Field className="relative">
                <Label className="font-semibold text-slate-950 text-sm/6 before:mr-1 before:text-red-500 before:content-['*'] after:ml-0.5 dark:text-white">
                  {t("fieldKanji")}
                </Label>
                <Input
                  value={kanjiInput}
                  onChange={(e) => {
                    setKanjiInput(e.target.value.trim());
                    validateKanjiInput(e.target.value.trim());
                  }}
                  placeholder="漢字"
                  autoFocus={true}
                  className={
                    "mt-2 block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-xs ring-1 ring-gray-300 ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-sky-600 focus:ring-inset disabled:cursor-not-allowed sm:text-sm sm:leading-6 dark:bg-slate-900 dark:text-white dark:ring-gray-700 dark:focus:ring-sky-600"
                  }
                />
                <p className="-bottom-5 absolute left-0 text-red-500">{kanjiInputErrorMessage}</p>
              </Field>
              <Field className="relative">
                <Label className="flex items-center font-semibold text-slate-950 text-sm/6 before:mr-1 before:text-red-500 before:content-['*'] after:ml-0.5 dark:text-white">
                  {t("fieldYomikata")}
                  <Field className="flex flex-1 items-center justify-end gap-1">
                    <Label>{t("fieldMatchAll")}</Label>
                    <Switch
                      checked={matchAll}
                      onChange={(checked) => {
                        setMatchAll(checked);
                      }}
                      className="group relative flex h-5 w-10 cursor-pointer rounded-full bg-slate-900/10 p-1 transition duration-200 ease-in-out hover:backdrop-brightness-75 focus:outline-hidden data-[checked]:bg-sky-500 data-[focus]:outline-1 data-[focus]:outline-white dark:bg-white/10 dark:hover:backdrop-brightness-175"
                    >
                      <span
                        aria-hidden="true"
                        className="pointer-events-none inline-block size-3 translate-x-0 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
                      />
                    </Switch>
                  </Field>
                </Label>
                <YomikatasInput
                  className="mt-2"
                  disabled={matchAll}
                  yomikatas={yomikatasInput}
                  onChange={(newYomikatas) => {
                    setYomikatasInput(newYomikatas);
                    validateYomikatasInput(newYomikatas);
                  }}
                />
                <p className="-bottom-5 absolute left-0 text-red-500">
                  {yomikatasInputErrorMessage}
                </p>
              </Field>
              <div className="mt-4">
                <button
                  className="flex w-full cursor-pointer justify-center rounded-md bg-sky-600 px-3 py-1.5 font-semibold text-sm text-white leading-6 shadow-xs focus-visible:outline-2 focus-visible:outline-sky-600 focus-visible:outline-offset-2 enabled:hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={handleSubmit}
                  disabled={!!kanjiInputErrorMessage || !!yomikatasInputErrorMessage}
                >
                  {t("submit")}
                </button>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </PopupTransition>
  );
}
