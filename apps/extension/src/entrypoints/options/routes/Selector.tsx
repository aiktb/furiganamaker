import { Suspense } from "react";
import { useTranslation } from "react-i18next";

import { customSelectors } from "@/commons/utils";
import Page from "../components/Page";
import SelectorPage from "../components/SelectorPage";

export default function RuleEditor() {
  const { t } = useTranslation();

  return (
    <Page title={t("navSelector")} icon="i-tabler-click">
      <Suspense>
        <SelectorPage rulesPromise={customSelectors.getValue()} />
      </Suspense>
    </Page>
  );
}
