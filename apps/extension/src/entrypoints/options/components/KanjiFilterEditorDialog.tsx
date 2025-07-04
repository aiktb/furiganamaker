import type { FilterRule } from "@/commons/constants";
import { cn } from "@/commons/utils";
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
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import PopupTransition from "./PopupTransition";

interface KanjiFilterEditorDialogProps {
  rule?: FilterRule | undefined;
  open: boolean;
  onConfirm: (rule: FilterRule) => void;
  onClose: () => void;
}

export default function KanjiFilterDialogEditor({
  rule = { kanji: "", katakanas: [] },
  onClose,
  onConfirm,
  open,
}: KanjiFilterEditorDialogProps) {
  const { t } = useTranslation();
  const [kanjiInput, setKanjiInput] = useState(rule.kanji);
  const [katakanasInput, setKatakanasInput] = useState(rule.katakanas);
  return (
    <PopupTransition show={open}>
      <Dialog
        as="div"
        className="-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 z-40"
        onClose={onClose}
      >
        <DialogPanel className="w-full min-w-[28rem] max-w-md transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all sm:mx-auto sm:w-full sm:max-w-sm dark:bg-slate-900">
          <Disclosure as="div">
            {({ open }) => (
              <>
                <DisclosureButton className="flex w-full cursor-pointer items-center justify-between rounded-lg bg-sky-100 px-4 py-2 text-left font-medium text-sky-900 text-sm hover:bg-sky-200 focus:outline-hidden focus-visible:ring-3 focus-visible:ring-sky-500/75 dark:bg-sky-900 dark:text-sky-300 dark:hover:bg-sky-700">
                  <h1>How to use kanji filter?</h1>
                  <i
                    className={`${
                      open ? "rotate-180 transform" : ""
                    } -rotate-90 i-tabler-chevron-left size-4 text-sky-500`}
                  />
                </DisclosureButton>
                <DisclosurePanel className="px-4 pt-4 pb-2 text-sm">
                  <section>
                    <ul className="list-disc marker:text-black dark:marker:text-white">
                      <li className="my-2">
                        Please use the web search tool in your browser to search for a specific
                        Kanji or Yomikata and click the button to start editing. Editing the Kanji
                        field is prohibited in edit mode. In addition, Yomikata must be in Katakana
                        format. Romaji or Hiragana aren't accepted.
                      </li>
                      <li className="my-2">
                        It is recommended to first use the word segmentation tool at the top of this
                        page to enter the complete Japanese sentence to obtain the corresponding
                        Kanji and Yomikata, and fill them in the table below respectively.
                        Otherwise, the Kanji filter can't be guaranteed to work properly.
                      </li>
                    </ul>
                  </section>
                </DisclosurePanel>
              </>
            )}
          </Disclosure>

          <div className="flex min-h-full flex-col justify-center p-6 lg:px-8">
            <DialogTitle
              as="h3"
              className="text-center font-bold text-2xl text-gray-900 leading-9 tracking-tight dark:text-white"
            >
              Edit your kanji filter
            </DialogTitle>
            <div className="mt-10 space-y-6 sm:mx-auto sm:w-full sm:max-w-sm">
              <Field>
                <Label className="font-medium text-slate-950 text-sm/6 dark:text-white">
                  Kanji
                </Label>
                <Input
                  value={kanjiInput}
                  onChange={(e) => setKanjiInput(e.target.value.trim())}
                  placeholder="漢字"
                  autoFocus={true}
                  className={
                    "mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-sky-600 focus:ring-inset disabled:cursor-not-allowed sm:text-sm sm:leading-6 dark:bg-slate-900 dark:text-white dark:ring-gray-700 dark:focus:ring-sky-600"
                  }
                />
              </Field>
              <Field>
                <Label className="font-medium text-slate-950 text-sm/6 dark:text-white">
                  Yomikata
                </Label>
                <KatakanaTagsAdder
                  className="mt-2"
                  katakanas={katakanasInput}
                  onChange={setKatakanasInput}
                />
              </Field>
              <div className="mt-4 flex gap-2.5">
                <button
                  type="button"
                  className="flex w-full cursor-pointer justify-center rounded-md bg-sky-600 px-3 py-1.5 font-semibold text-sm text-white leading-6 shadow-xs hover:bg-sky-500 focus-visible:outline-2 focus-visible:outline-sky-600 focus-visible:outline-offset-2 disabled:cursor-not-allowed"
                  onClick={() => {
                    onConfirm({ kanji: kanjiInput, katakanas: katakanasInput });
                  }}
                  disabled={!kanjiInput || katakanasInput.length === 0}
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

interface KatakanaTagsAdderProps {
  katakanas: string[];
  onChange: (katakanas: string[]) => void;
  className?: string;
}

const KatakanaTagsAdder = ({ katakanas, className, onChange }: KatakanaTagsAdderProps) => {
  const [inputValue, setInputValue] = useState("");
  const [inputting, setInputting] = useState(false);
  const handleInputConfirm = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !katakanas.includes(trimmedValue)) {
      onChange([...katakanas, trimmedValue]);
    }
    setInputValue("");
    setInputting(false);
  };

  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div
      className={cn(
        "flex w-full flex-wrap gap-1.5 rounded-md border-0 px-1 py-1.5 shadow-xs ring-1 ring-gray-300 ring-inset focus:ring-2 focus:ring-sky-600 focus:ring-inset disabled:cursor-not-allowed sm:text-sm sm:leading-6 dark:bg-slate-900 dark:ring-gray-700 dark:focus:ring-sky-600",
        "has-focus:ring-2 has-focus:ring-sky-600 has-focus:ring-inset dark:has-focus:ring-sky-600",
        className,
      )}
    >
      {katakanas.map((katakana) => {
        return (
          <div
            className="flex items-center justify-center gap-1 rounded-md bg-slate-950/5 px-1.5 dark:bg-white/5"
            key={katakana}
          >
            <span className="text-slate-950 dark:text-white">{katakana}</span>
            <button
              onClick={() => {
                onChange(katakanas.filter((k) => k !== katakana));
              }}
              className="flex cursor-pointer items-center justify-center transition hover:text-slate-950 dark:hover:text-white"
            >
              <i className="i-tabler-x size-3" />
              <span className="sr-only">{`Delete ${katakana}`}</span>
            </button>
          </div>
        );
      })}
      {!inputting && (
        <button
          type="button"
          onClick={() => {
            inputRef.current?.focus();
            setInputting(true);
          }}
          className="flex cursor-pointer items-center justify-center rounded-full bg-slate-950/5 p-1 dark:bg-white/5"
        >
          <i className="i-tabler-plus size-4 transition hover:text-slate-950 dark:hover:text-white" />
          <span className="sr-only">Add Katakana</span>
        </button>
      )}
      <Input
        value={inputValue}
        ref={inputRef}
        onFocus={() => setInputting(true)}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            setInputting(false);
            setInputValue("");
            if (inputRef.current) {
              inputRef.current.blur();
            }
          }

          if (e.key === "Enter") {
            handleInputConfirm();
          }
        }}
        onBlur={handleInputConfirm}
        type="text"
        className="min-w-8 flex-1 border-0 p-0 text-gray-900 ring-0 sm:text-sm sm:leading-6 dark:bg-slate-900 dark:text-white"
      />
    </div>
  );
};
