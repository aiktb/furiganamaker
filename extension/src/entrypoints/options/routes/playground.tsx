import { createFileRoute } from "@tanstack/react-router";
import { Playground } from "../pages/Playground";

export const Route = createFileRoute("/playground")({
  component: Playground,
});
