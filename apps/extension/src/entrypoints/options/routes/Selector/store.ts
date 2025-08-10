import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SelectorRule } from "@/commons/constants";
import { customSelectors } from "@/commons/utils";

interface SelectorsStore {
  selectors: SelectorRule[];
  setSelectors: (selectors: SelectorRule[]) => void;
  clearSelectors: () => void;
}

export const useSelectorsStore = create<SelectorsStore>()(
  persist(
    (set) => ({
      selectors: [],
      setSelectors: (selectors) => set({ selectors }),
      clearSelectors: () => set({ selectors: [] }),
    }),
    {
      name: "selectors-storage",
      storage: {
        async getItem() {
          return {
            state: {
              selectors: await customSelectors.getValue(),
            },
          };
        },
        async setItem(_, value) {
          await customSelectors.setValue(value.state.selectors);
        },
        async removeItem() {
          await customSelectors.removeValue();
        },
      },
    },
  ),
);
