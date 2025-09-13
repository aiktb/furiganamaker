import { cn } from "@/commons/utils";
import { NotFoundRule } from "../../components/NotFoundRule";
import { KanjiFilterDashboard } from "./components/KanjiFilterDashboard";
import { KanjiFilterTable } from "./components/KanjiFilterTable";
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
      {kanjiFilters.length > 0 ? <KanjiFilterTable /> : <NotFoundRule />}
    </div>
  );
}
