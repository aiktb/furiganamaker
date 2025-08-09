import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ExtStorage, type MoreSettings } from "@/commons/constants";
import { moreSettings } from "@/commons/utils";

interface MoreSettingsStore extends MoreSettings {
  setLanguage: (language: string) => void;
  toggleDisableWarning: () => void;
  toggleColoringKanji: () => void;
  setExcludeSites: (sites: string[]) => void;
}

export const useMoreSettingsStore = create<MoreSettingsStore>()(
  persist(
    (set, get) => ({
      [ExtStorage.Language]: null,
      [ExtStorage.DisableWarning]: false,
      [ExtStorage.ColoringKanji]: false,
      [ExtStorage.ExcludeSites]: ["example.com"],
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
