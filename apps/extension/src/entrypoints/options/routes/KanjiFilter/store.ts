import { create } from "zustand";
import { persist } from "zustand/middleware";
import defaultKanjiFilterRules from "@/assets/rules/filter.json";
import { ExtEvent, type FilterRule } from "@/commons/constants";
import { DB, getKanjiFilterDB } from "@/commons/utils";

interface SelectorsStore {
  kanjiFilters: FilterRule[];
  clearKanjiFilters: () => void;
  addKanjiFilter: (...rules: FilterRule[]) => void;
  removeKanjiFilter: (kanji: string) => void;
  editKanjiFilter: (oldRule: FilterRule, newRule: FilterRule) => void;
  resetKanjiFilters: () => void;
}

export const useKanjiFiltersStore = create<SelectorsStore>()(
  persist(
    (set, get) => ({
      kanjiFilters: [],
      clearKanjiFilters: () => set({ kanjiFilters: [] }),
      addKanjiFilter: (...rules: FilterRule[]) => {
        set(() => {
          const deduplicated = get().kanjiFilters.filter(
            (oldRule) => !rules.some((newRule) => oldRule.kanji === newRule.kanji),
          );
          return {
            kanjiFilters: [...rules, ...deduplicated],
          };
        });
      },
      removeKanjiFilter: (kanji: string) => {
        set(() => ({
          kanjiFilters: get().kanjiFilters.filter((rule) => rule.kanji !== kanji),
        }));
      },
      editKanjiFilter: (oldRule: FilterRule, newRule: FilterRule) => {
        set(() => ({
          kanjiFilters: get().kanjiFilters.map((rule) =>
            rule.kanji === oldRule.kanji ? newRule : rule,
          ),
        }));
      },
      resetKanjiFilters: () => {
        set(() => ({
          kanjiFilters: defaultKanjiFilterRules,
        }));
      },
    }),
    {
      name: "kanji-filters-storage",
      storage: {
        async getItem() {
          const db = await getKanjiFilterDB();
          return {
            state: {
              kanjiFilters: await db.getAll(DB.onlyTable),
            },
          };
        },
        async setItem(_, value) {
          const db = await getKanjiFilterDB();
          const tx = db.transaction(DB.onlyTable, "readwrite");
          const store = tx.objectStore(DB.onlyTable);
          await store.clear();
          await Promise.all(value.state.kanjiFilters.map((rule) => store.put(rule)));
          await tx.done;
          browser.runtime.sendMessage(ExtEvent.ModifyKanjiFilter);
        },
        async removeItem() {
          const db = await getKanjiFilterDB();
          await db.clear(DB.onlyTable);
        },
      },
    },
  ),
);
