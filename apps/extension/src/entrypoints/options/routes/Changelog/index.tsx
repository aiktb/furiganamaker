import changelog from "@@/CHANGELOG.md?raw";

import Markdown from "react-markdown";

export function Changelog() {
  return <Markdown className="prose prose-slate dark:prose-invert">{changelog}</Markdown>;
}
