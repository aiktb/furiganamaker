import changelog from "@@/CHANGELOG.md?raw";

import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";

import { Page } from "../../components/Page";

export function Changelog() {
  const { t } = useTranslation();

  return (
    <Page title={t("navChangelog")} icon="i-tabler-history">
      <Markdown className="prose prose-slate dark:prose-invert">{changelog}</Markdown>
    </Page>
  );
}
