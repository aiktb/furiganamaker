import { debounce } from "es-toolkit";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ExtStorage, type MoreSettings } from "@/constants";
import { moreSettings, moreSettingsFallback } from "@/storage/settings";

const STORAGE_WRITE_DEBOUNCE_WAIT = 100;
/**
 * Debounce storage writes to avoid async write order inversions and excessive
 * calls that can exceed Chrome extension storage API limits.
 */
const setMoreSettingsDebounced = debounce((value: MoreSettings) => {
  moreSettings.setValue(value);
}, STORAGE_WRITE_DEBOUNCE_WAIT);

interface MoreSettingsStoreActions {
  setLanguage: (language: string) => void;
  toggleDisableWarning: () => void;
  toggleColoringKanji: () => void;
  setIncludeSites: (sites: string[]) => void;
  setExcludeSites: (sites: string[]) => void;
  setAlwaysRunSites: (sites: string[]) => void;
  resetMoreSettings: () => void;
}
interface MoreSettingsStoreState {
  data: MoreSettings;
  actions: MoreSettingsStoreActions;
}
type PersistedMoreSettingsStoreState = Pick<MoreSettingsStoreState, "data">;

export const useMoreSettingsStore = create<MoreSettingsStoreState>()(
  persist(
    (set, get) => ({
      data: moreSettingsFallback,
      actions: {
        setLanguage: (language) => {
          set(({ data }) => ({ data: { ...data, [ExtStorage.Language]: language } }));
        },
        toggleDisableWarning: () => {
          set(({ data }) => ({
            data: {
              ...data,
              [ExtStorage.DisableWarning]: !get().data[ExtStorage.DisableWarning],
            },
          }));
        },
        toggleColoringKanji: () => {
          set(({ data }) => ({
            data: {
              ...data,
              [ExtStorage.ColoringKanji]: !get().data[ExtStorage.ColoringKanji],
            },
          }));
        },
        setIncludeSites: (sites) => {
          set(({ data }) => ({ data: { ...data, [ExtStorage.IncludeSites]: sites } }));
        },
        setExcludeSites: (sites) => {
          set(({ data }) => ({ data: { ...data, [ExtStorage.ExcludeSites]: sites } }));
        },
        setAlwaysRunSites: (sites) => {
          set(({ data }) => ({ data: { ...data, [ExtStorage.AlwaysRunSites]: sites } }));
        },
        resetMoreSettings: () => {
          set({ data: moreSettingsFallback });
        },
      },
    }),
    {
      name: "more-settings-storage",
      partialize: (state): PersistedMoreSettingsStoreState => ({ data: state.data }),
      storage: {
        async getItem() {
          return {
            state: { data: await moreSettings.getValue() },
          };
        },
        setItem(_, value) {
          setMoreSettingsDebounced(value.state.data);
        },
        async removeItem() {
          await moreSettings.removeValue();
        },
      },
    },
  ),
);

moreSettings.watch((value) => {
  useMoreSettingsStore.setState({ data: value });
});
