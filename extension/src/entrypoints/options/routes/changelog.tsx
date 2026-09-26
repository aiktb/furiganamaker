import { createFileRoute } from "@tanstack/react-router";
import { Changelog } from "../pages/Changelog";

export const Route = createFileRoute("/changelog")({
  component: Changelog,
});
