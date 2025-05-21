import { useTranslation } from "react-i18next";
import { Link, isRouteErrorResponse, useRouteError } from "react-router";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);
  let message: string;
  if (isRouteErrorResponse(error)) {
    message = error.statusText;
  } else if (error instanceof Error) {
    message = error.message;
  } else {
    message = "Unknown error";
  }
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
