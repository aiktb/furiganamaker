import { cn } from "@/commons/utils";
import { NotFoundRule } from "../../components/NotFoundRule";
import { KanjiFilterDashboard } from "./components/KanjiFilterDashboard";
import { KanjiFilterItem } from "./components/KanjiFilterItem";
import { useKanjiFiltersStore } from "./store";

export function KanjiFilter() {
  const kanjiFilters = useKanjiFiltersStore((state) => state.kanjiFilters);

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center lg:max-w-5xl lg:px-8",
        "playwright-kanji-filter-page",
      )}
    >
      <KanjiFilterDashboard className="mb-5" disableExportAndClear={kanjiFilters.length === 0} />
      {kanjiFilters.length > 0 ? (
        <div className="grid grid-cols-2 flex-wrap gap-3 sm:grid-cols-3 2xl:grid-cols-4">
          {kanjiFilters.map((rule, index) => (
            <KanjiFilterItem key={rule.kanji} rule={rule} index={index} />
          ))}
        </div>
      ) : (
        <NotFoundRule />
      )}
    </div>
  );
}
