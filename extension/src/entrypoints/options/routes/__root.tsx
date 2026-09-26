import { createRootRoute } from "@tanstack/react-router";
import { ErrorPage, NotFoundPage } from "../components/ErrorPage";
import { Root } from "../root";

export const Route = createRootRoute({
  component: Root,
  errorComponent: ErrorPage,
  notFoundComponent: NotFoundPage,
});
