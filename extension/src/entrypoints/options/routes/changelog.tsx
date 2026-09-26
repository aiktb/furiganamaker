import changelog from "@@/CHANGELOG.md?raw";
import { createFileRoute } from "@tanstack/react-router";

import Markdown from "react-markdown";

export const Route = createFileRoute("/changelog")({
  component: Changelog,
});

function Changelog() {
  return (
    <div className="prose prose-slate dark:prose-invert">
      <Markdown>{changelog}</Markdown>
    </div>
  );
}
