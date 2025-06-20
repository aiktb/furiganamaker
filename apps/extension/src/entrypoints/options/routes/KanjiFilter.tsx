import type { FilterRule } from "@/commons/constants";
import { DB, getKanjiFilterDB } from "@/commons/utils";
import { Transition } from "@headlessui/react";
import { Suspense, use, useState } from "react";
import { useTranslation } from "react-i18next";
import Page from "../components/Page";

const getKanjiFilterRules = async () => {
  const db = await getKanjiFilterDB();
  const rules = await db.getAll(DB.onlyTable);
  return rules;
};

export default function KanjiFilter() {
  const { t } = useTranslation();

  return (
    <Page title={t("navKanjiFilter")} icon="i-tabler-filter">
      <Suspense>
        <Transition
          as="div"
          appear
          show={true}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <KanjiFilterPage promise={getKanjiFilterRules()} />
        </Transition>
      </Suspense>
    </Page>
  );
}

export const KanjiFilterPage = ({ promise }: { promise: Promise<FilterRule[]> }) => {
  const [rules] = useState(use(promise));
  const { t } = useTranslation();

  return (
    <div className="flex w-full justify-center lg:max-w-5xl lg:px-8">
      <div className="grid grid-cols-2 flex-wrap gap-3 sm:grid-cols-3 2xl:grid-cols-4">
        {rules.map(({ kanji, reading }) => (
          <div className="relative" key={kanji}>
            <button className="group grid w-40 cursor-pointer grid-cols-5 grid-rows-2 rounded-md bg-slate-950/5 px-4 py-2 shadow sm:w-50 lg:w-55 dark:bg-white/5 dark:shadow-slate-800">
              <div className="col-span-4 row-start-1 max-w-full justify-self-start overflow-hidden text-ellipsis whitespace-nowrap text-lg text-slate-800 dark:text-white">
                {kanji}
              </div>
              <div className="col-span-5 row-start-2 max-w-full justify-self-start overflow-hidden text-ellipsis whitespace-nowrap">
                {reading.join(", ")}
              </div>
              <i className="i-tabler-edit col-start-5 row-start-1 size-5 scale-0 self-center justify-self-center text-slate-800 opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100 dark:text-white" />
            </button>
            <button className="-translate-y-1/2 absolute top-0 right-0 translate-x-1/2 cursor-pointer rounded-full bg-white transition hover:text-slate-800 dark:bg-slate-900 dark:hover:text-white">
              <div className="grid size-5 place-content-center rounded-full bg-slate-950/5 dark:bg-white/5">
                <i className="i-tabler-x size-4" />
                <span className="sr-only">{t("btnDelete")}</span>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
