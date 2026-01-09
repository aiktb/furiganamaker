import { NotFoundRule } from "../../components/NotFoundRule";
import { SelectorDashboard } from "./components/SelectorDashboard";

import { SelectorRuleItem } from "./components/SelectorRuleItem";
import { useSelectorsStore } from "./store";

export function Selector() {
  const selectors = useSelectorsStore((state) => state.selectors);

  return (
    <div className="flex grow flex-col items-center justify-start lg:px-8">
      <SelectorDashboard />
      <div className="flex items-center justify-between">
        {selectors.length === 0 ? (
          <NotFoundRule />
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-slate-800">
            {selectors.map((rule, index) => {
              return <SelectorRuleItem index={index} rule={rule} key={rule.domain} />;
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
