import { union } from "es-toolkit";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SelectorRule } from "@/commons/constants";
import { customSelectors } from "@/commons/utils";

interface SelectorsStore {
  selectors: SelectorRule[];
  editSelector: (newRule: SelectorRule, oldRule: SelectorRule) => void;
  addSelectors: (...selectors: SelectorRule[]) => void;
  setSelectors: (selectors: SelectorRule[]) => void;
  clearSelectors: () => void;
  removeSelector: (domain: string) => void;
}

export const useSelectorsStore = create<SelectorsStore>()(
  persist(
    (set, get) => ({
      selectors: [],
      addSelectors: (...selectors) => {
        set({ selectors: union(selectors, get().selectors) });
      },
      editSelector: (newRule, oldRule) => {
        set({
          selectors: get().selectors.map((rule) =>
            rule.domain === oldRule.domain ? newRule : rule,
          ),
        });
      },
      setSelectors: (selectors) => set({ selectors }),
      clearSelectors: () => set({ selectors: [] }),
      removeSelector: (domain) => {
        set({
          selectors: get().selectors.filter((rule) => rule.domain !== domain),
        });
      },
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
