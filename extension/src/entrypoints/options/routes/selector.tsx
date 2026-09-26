import { createFileRoute } from "@tanstack/react-router";
import { Selector } from "../pages/Selector";

export const Route = createFileRoute("/selector")({
  component: Selector,
});
