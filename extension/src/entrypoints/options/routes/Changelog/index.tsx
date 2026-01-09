import changelog from "@@/CHANGELOG.md?raw";

import Markdown from "react-markdown";

export function Changelog() {
  return (
    <div className="prose prose-slate dark:prose-invert">
      <Markdown>{changelog}</Markdown>
    </div>
  );
}
