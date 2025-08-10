import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ExtStorage, type GeneralSettings } from "@/commons/constants";
import { generalSettings, generalSettingsFallback } from "@/commons/utils";

interface GeneralSettingsStore extends GeneralSettings {
  toggleAutoMode: () => void;
  toggleKanjiFilter: () => void;
  setDisplayMode: (mode: GeneralSettings["displayMode"]) => void;
  setFuriganaType: (type: GeneralSettings["furiganaType"]) => void;
  setSelectMode: (mode: GeneralSettings["selectMode"]) => void;
  setFontSize: (size: GeneralSettings["fontSize"]) => void;
  setFontColor: (color: GeneralSettings["fontColor"]) => void;
}
export const useGeneralSettingsStore = create<GeneralSettingsStore>()(
  persist(
    (set, get) => ({
      ...generalSettingsFallback,
      toggleAutoMode: () => {
        set({ [ExtStorage.AutoMode]: !get()[ExtStorage.AutoMode] });
      },
      toggleKanjiFilter: () => {
        set({ [ExtStorage.KanjiFilter]: !get()[ExtStorage.KanjiFilter] });
      },
      setDisplayMode: (mode) => {
        set({ [ExtStorage.DisplayMode]: mode });
      },
      setFuriganaType: (type) => {
        set({ [ExtStorage.FuriganaType]: type });
      },
      setSelectMode: (mode) => {
        set({ [ExtStorage.SelectMode]: mode });
      },
      setFontSize: (size) => {
        set({ [ExtStorage.FontSize]: size });
      },
      setFontColor: (color) => {
        set({ [ExtStorage.FontColor]: color });
      },
    }),
    {
      name: "more-settings-storage",
      storage: {
        async getItem() {
          return {
            state: await generalSettings.getValue(),
          };
        },
        async setItem(_, value) {
          await generalSettings.setValue(value.state);
        },
        async removeItem() {
          await generalSettings.removeValue();
        },
      },
    },
  ),
);
