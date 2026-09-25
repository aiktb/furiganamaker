import { type ErrorComponentProps, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export function ErrorPage({ error }: ErrorComponentProps) {
  // biome-ignore lint/suspicious/noConsole: Log route errors for debugging
  console.error(error);
  return <ErrorMessage message={error instanceof Error ? error.message : "Unknown error"} />;
}

export function NotFoundPage() {
  return <ErrorMessage message="Not Found" />;
}

function ErrorMessage({ message }: { message: string }) {
  const { t } = useTranslation();
  return (
    <div className="prose prose-slate dark:prose-invert mx-auto flex min-h-screen flex-col items-center justify-center">
      <p>
        <i className="i-tabler-alert-triangle size-20 text-sky-500" />
      </p>
      <h1>{t("errorPageTitle")}</h1>
      <Link to="/">{t("errorPageGoBack")}</Link>
      <p>{t("errorPageTip")}</p>
      <p>
        <i>{message}</i>
      </p>
    </div>
  );
}
