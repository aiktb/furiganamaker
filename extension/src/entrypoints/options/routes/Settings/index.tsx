import { Dialog, DialogPanel, DialogTitle, Switch } from "@headlessui/react";
import { uniq } from "es-toolkit";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ExtStorage } from "@/commons/constants";
import { PopupTransition } from "@/entrypoints/options/components/PopupTransition";
import { DomainListHandler } from "./components/DomainListHandler";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { useMoreSettingsStore } from "./store";

export function Settings() {
  const language = useMoreSettingsStore((state) => state[ExtStorage.Language]);
  const warningDisabled = useMoreSettingsStore((state) => state[ExtStorage.DisableWarning]);
  const coloringKanjiEnabled = useMoreSettingsStore((state) => state[ExtStorage.ColoringKanji]);
  const includeSites = useMoreSettingsStore((state) => state[ExtStorage.IncludeSites]);
  const excludedSites = useMoreSettingsStore((state) => state[ExtStorage.ExcludeSites]);
  const alwaysRunSites = useMoreSettingsStore((state) => state[ExtStorage.AlwaysRunSites]);
  const setLanguage = useMoreSettingsStore((state) => state.setLanguage);
  const setIncludeSites = useMoreSettingsStore((state) => state.setIncludeSites);
  const setExcludeSites = useMoreSettingsStore((state) => state.setExcludeSites);
  const setAlwaysRunSites = useMoreSettingsStore((state) => state.setAlwaysRunSites);
  const toggleColoringKanji = useMoreSettingsStore((state) => state.toggleColoringKanji);
  const toggleDisableWarning = useMoreSettingsStore((state) => state.toggleDisableWarning);
  const resetMoreSettings = useMoreSettingsStore((state) => state.resetMoreSettings);
  const { i18n, t } = useTranslation();
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  function handleLanguageChange(newLanguage: string) {
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
    document.documentElement.lang = newLanguage;
  }

  function handleIncludeListChange(sites: string[]) {
    const unrepeatedSites = uniq(sites);
    setIncludeSites(unrepeatedSites);
  }

  function handleExclusionListChange(sites: string[]) {
    const unrepeatedSites = uniq(sites);
    setExcludeSites(unrepeatedSites);
  }

  function handleAlwaysRunSitesChange(sites: string[]) {
    const unrepeatedSites = uniq(sites);
    setAlwaysRunSites(unrepeatedSites);
  }

  function handleResetSettings() {
    resetMoreSettings();
    i18n.changeLanguage("en");
    document.documentElement.lang = "en";
    setIsResetDialogOpen(false);
  }

  return (
    <menu className="flex flex-col items-center justify-between space-y-10 text-pretty lg:max-w-5xl lg:px-8">
      <li className="flex w-full items-center justify-between gap-4">
        <div>
          <div className="font-bold text-lg text-slate-800 dark:text-slate-200">
            {t("settingsLanguage")}
          </div>
          <div>{t("settingsLanguageDesc")}</div>
        </div>
        <LanguageSwitcher language={language ?? i18n.language} onChange={handleLanguageChange} />
      </li>
      <li className="flex w-full items-center justify-between gap-4">
        <div>
          <div className="font-bold text-lg text-slate-800 dark:text-slate-200">
            {t("settingsColoringKanji")}
          </div>
          <div>{t("settingsColoringKanjiDesc")}</div>
        </div>
        <SettingSwitch enabled={coloringKanjiEnabled} onChange={toggleColoringKanji} />
      </li>
      <DomainListHandler
        sites={includeSites}
        onChange={handleIncludeListChange}
        mode="includeSites"
      />
      <DomainListHandler
        sites={excludedSites}
        onChange={handleExclusionListChange}
        mode="excludedSites"
      />
      <li className="flex w-full items-center justify-between gap-4">
        <div>
          <div className="font-bold text-lg text-slate-800 dark:text-slate-200">
            {t("settingsDisableWarning")}
          </div>
          <div>{t("settingsDisableWarningDesc")}</div>
        </div>
        <SettingSwitch enabled={warningDisabled} onChange={toggleDisableWarning} />
      </li>
      <DomainListHandler
        sites={alwaysRunSites}
        onChange={handleAlwaysRunSitesChange}
        mode="alwaysRunSites"
      />
      <li className="flex w-full items-center justify-between gap-4">
        <div>
          <div className="font-bold text-lg text-slate-800 dark:text-slate-200">
            {t("settingsResetAll")}
          </div>
          <div>{t("settingsResetAllDesc")}</div>
        </div>
        <button
          className="inline-flex cursor-pointer justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 font-bold text-slate-900 text-sm transition hover:bg-red-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:bg-red-800 dark:text-slate-200 dark:hover:bg-red-900"
          onClick={() => setIsResetDialogOpen(true)}
        >
          {t("btnReset")}
        </button>
      </li>
      {isResetDialogOpen && (
        <PopupTransition show={isResetDialogOpen}>
          <Dialog
            as="div"
            className="-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 z-40"
            onClose={() => setIsResetDialogOpen(false)}
          >
            <DialogPanel className="w-full min-w-85 max-w-md transform overflow-hidden rounded-2xl bg-white p-5 text-left align-middle text-sm shadow-xl transition-all dark:bg-slate-900 dark:text-slate-100">
              <DialogTitle as="h3" className="font-semibold text-lg">
                {t("settingsResetDialogTitle")}
              </DialogTitle>
              <p className="mt-2 text-slate-500 dark:text-slate-400">
                {t("settingsResetDialogDesc")}
              </p>
              <p className="mt-1 text-slate-500 dark:text-slate-400">{t("undoneDesc")}</p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  className="cursor-pointer rounded-md bg-slate-950/5 px-4 py-2 text-slate-800 transition hover:text-sky-500 dark:bg-white/5 dark:text-white"
                  onClick={() => {
                    setIsResetDialogOpen(false);
                  }}
                >
                  {t("btnCancel")}
                </button>
                <button
                  className="inline-flex cursor-pointer justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 font-bold text-slate-900 text-sm transition hover:bg-red-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:bg-red-800 dark:text-slate-200 dark:hover:bg-red-900"
                  onClick={handleResetSettings}
                >
                  {t("btnConfirm")}
                </button>
              </div>
            </DialogPanel>
          </Dialog>
        </PopupTransition>
      )}
    </menu>
  );
}

function SettingSwitch({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}) {
  return (
    <div>
      <Switch
        checked={enabled}
        onChange={onChange}
        className="group relative flex h-7 w-14 cursor-pointer rounded-full bg-slate-900/10 p-1 transition duration-200 ease-in-out hover:backdrop-brightness-75 focus:outline-hidden data-checked:bg-sky-500 data-focus:outline-1 data-focus:outline-white dark:bg-white/10 dark:hover:backdrop-brightness-175"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-7"
        />
      </Switch>
    </div>
  );
}
