import { createFileRoute } from "@tanstack/react-router";
import { KanjiFilter } from "../pages/KanjiFilter";

export const Route = createFileRoute("/kanji-filter")({
  component: KanjiFilter,
});
