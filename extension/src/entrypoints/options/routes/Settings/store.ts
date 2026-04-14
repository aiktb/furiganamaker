import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ExtEvent, ExtStorage, type MoreSettings } from "@/commons/constants";
import { moreSettings, moreSettingsFallback } from "@/commons/utils";

interface MoreSettingsStore extends MoreSettings {
  setLanguage: (language: string) => void;
  toggleDisableWarning: () => void;
  toggleColoringKanji: () => void;
  setIncludeSites: (sites: string[]) => void;
  setExcludeSites: (sites: string[]) => void;
  setAlwaysRunSites: (sites: string[]) => void;
  setN5Color: (color: string) => void;
  setN4Color: (color: string) => void;
  resetMoreSettings: () => void;
}

export const useMoreSettingsStore = create<MoreSettingsStore>()(
  persist(
    (set, get) => ({
      ...moreSettingsFallback,
      setLanguage: (language) => {
        set({ [ExtStorage.Language]: language });
      },
      toggleDisableWarning: () => {
        set({
          [ExtStorage.DisableWarning]: !get()[ExtStorage.DisableWarning],
        });
      },
      toggleColoringKanji: () => {
        set({
          [ExtStorage.ColoringKanji]: !get()[ExtStorage.ColoringKanji],
        });
      },
      setIncludeSites: (sites) => {
        set({ [ExtStorage.IncludeSites]: sites });
      },
      setExcludeSites: (sites) => {
        set({ [ExtStorage.ExcludeSites]: sites });
      },
      setAlwaysRunSites: (sites) => {
        set({ [ExtStorage.AlwaysRunSites]: sites });
      },
      setN5Color: (color) => {
        set({ [ExtStorage.N5Color]: color });
        browser.runtime.sendMessage(ExtEvent.UpdateJlptColors);
      },
      setN4Color: (color) => {
        set({ [ExtStorage.N4Color]: color });
        browser.runtime.sendMessage(ExtEvent.UpdateJlptColors);
      },
      resetMoreSettings: () => {
        set({ ...moreSettingsFallback });
      },
    }),
    {
      name: "more-settings-storage",
      storage: {
        async getItem() {
          return {
            state: await moreSettings.getValue(),
          };
        },
        async setItem(_, value) {
          await moreSettings.setValue(value.state);
        },
        async removeItem() {
          await moreSettings.removeValue();
        },
      },
    },
  ),
);
