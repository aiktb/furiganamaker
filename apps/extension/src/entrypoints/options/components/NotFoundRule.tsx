import { useTranslation } from "react-i18next";

export function NotFoundRule() {
  const { t } = useTranslation();

  return (
    <div className="playwright-not-found-mark flex flex-col items-center px-6 pt-16 pb-24 text-center">
      <i className="i-tabler-mist-off size-20" />
      <h1 className="space-x-[2px] pt-3 font-bold text-sky-500 text-xl leading-5">
        {t("titleNotFound")}
      </h1>
      <div className="mx-auto mt-6 mb-[18px] h-[1px] w-16 bg-sky-500" />
      <p className="mx-auto my-0 max-w-[256px] font-[500] text-base">{t("msgNotFound")}</p>
    </div>
  );
}
