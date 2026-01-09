import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ExtStorage, type MoreSettings } from "@/commons/constants";
import { moreSettings, moreSettingsFallback } from "@/commons/utils";

interface MoreSettingsStore extends MoreSettings {
  setLanguage: (language: string) => void;
  toggleDisableWarning: () => void;
  toggleColoringKanji: () => void;
  setExcludeSites: (sites: string[]) => void;
  setAlwaysRunSites: (sites: string[]) => void;
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
      setExcludeSites: (sites) => {
        set({ [ExtStorage.ExcludeSites]: sites });
      },
      setAlwaysRunSites: (sites) => {
        set({ [ExtStorage.AlwaysRunSites]: sites });
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
