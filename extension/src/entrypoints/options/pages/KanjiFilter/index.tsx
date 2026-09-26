import { Button, Field, Input, Label, Switch } from "@headlessui/react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/cn";
import { NotFoundRule } from "../../components/NotFoundRule";
import { KanjiFilterDashboard } from "./components/KanjiFilterDashboard";
import { KanjiFilterItem } from "./components/KanjiFilterItem";
import { useKanjiFiltersStore } from "./store";

const PAGE_SIZE = 100;

export function KanjiFilter() {
  const kanjiFilters = useKanjiFiltersStore((state) => state.kanjiFilters);

  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [matchAllOnly, setMatchAllOnly] = useState(false);
  const [page, setPage] = useState(1);
  const filteredRules = useMemo(() => {
    const search = query.trim();
    return kanjiFilters.filter(
      (rule) =>
        !(matchAllOnly && rule.yomikatas) &&
        (!search ||
          rule.kanji.includes(search) ||
          rule.yomikatas?.some((reading) => reading.includes(search))),
    );
  }, [kanjiFilters, query, matchAllOnly]);
  const pageCount = Math.max(1, Math.ceil(filteredRules.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  if (page !== currentPage) {
    setPage(currentPage);
  }
  const offset = (currentPage - 1) * PAGE_SIZE;

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center lg:max-w-5xl lg:px-8",
        "playwright-kanji-filter-page",
      )}
    >
      <KanjiFilterDashboard className="mb-5" disableExportAndClear={kanjiFilters.length === 0} />
      <div className="mb-5 flex w-full flex-wrap items-center justify-center gap-3">
        <Field className="w-64 max-w-full">
          <Label className="sr-only">{t("kanjiFilterSearch")}</Label>
          <Input
            type="search"
            placeholder={t("kanjiFilterSearch")}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-xs ring-1 ring-gray-300 ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-sky-600 focus:ring-inset disabled:cursor-not-allowed sm:text-sm sm:leading-6 dark:bg-slate-900 dark:text-white dark:ring-gray-700 dark:focus:ring-sky-600"
          />
        </Field>
        <Field className="flex items-center gap-2">
          <Label className="font-semibold text-slate-950 text-sm/6 dark:text-white">
            {t("kanjiFilterMatchAllOnly")}
          </Label>
          <Switch
            checked={matchAllOnly}
            onChange={(checked) => {
              setMatchAllOnly(checked);
              setPage(1);
            }}
            className="group relative flex h-5 w-10 shrink-0 cursor-pointer rounded-full bg-slate-900/10 p-1 transition duration-200 ease-in-out hover:backdrop-brightness-75 focus:outline-hidden data-checked:bg-sky-500 data-focus:outline-1 data-focus:outline-white dark:bg-white/10 dark:hover:backdrop-brightness-175"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none inline-block size-3 translate-x-0 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-5"
            />
          </Switch>
        </Field>
      </div>
      {filteredRules.length > 0 ? (
        <div className="grid grid-cols-2 flex-wrap gap-3 sm:grid-cols-3 2xl:grid-cols-4">
          {filteredRules.slice(offset, offset + PAGE_SIZE).map((rule, index) => (
            <KanjiFilterItem key={rule.kanji} rule={rule} index={offset + index} />
          ))}
        </div>
      ) : kanjiFilters.length > 0 ? (
        <output>{t("kanjiFilterNoResults")}</output>
      ) : (
        <NotFoundRule />
      )}
      <nav aria-label={t("kanjiFilterPagination")} className="mt-5 flex items-center gap-3">
        <Button
          disabled={currentPage === 1}
          onClick={() => setPage(currentPage - 1)}
          className="inline-flex cursor-pointer items-center justify-center rounded-md bg-slate-950/5 px-3 py-2 text-slate-800 transition focus-visible:outline-2 focus-visible:outline-sky-600 focus-visible:outline-offset-2 enabled:hover:text-sky-500 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white/5 dark:text-white"
        >
          {t("kanjiFilterPrevious")}
        </Button>
        <output>
          {t("kanjiFilterPage", {
            page: currentPage,
            pages: pageCount,
            total: filteredRules.length,
          })}
        </output>
        <Button
          disabled={currentPage === pageCount}
          onClick={() => setPage(currentPage + 1)}
          className="inline-flex cursor-pointer items-center justify-center rounded-md bg-slate-950/5 px-3 py-2 text-slate-800 transition focus-visible:outline-2 focus-visible:outline-sky-600 focus-visible:outline-offset-2 enabled:hover:text-sky-500 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white/5 dark:text-white"
        >
          {t("kanjiFilterNext")}
        </Button>
      </nav>
    </div>
  );
}
