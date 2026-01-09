import { Trans } from "react-i18next";

export const DomainFieldDesc = () => {
  return (
    <ul className="list-disc marker:text-black dark:marker:text-white">
      <li className="my-2 whitespace-pre-wrap text-slate-500 text-sm dark:text-slate-400">
        <Trans
          i18nKey="fieldDomainDesc1"
          components={{
            boldWwwDot: <b className="font-semibold text-slate-900 dark:text-slate-200">www.</b>,
          }}
        />
      </li>
      <li className="my-2 whitespace-pre-wrap text-slate-500 text-sm dark:text-slate-400">
        <Trans
          i18nKey="fieldDomainDesc3"
          components={{
            boldExampleGlobExpr: (
              <b className="font-semibold text-slate-900 dark:text-slate-200">*.example.com</b>
            ),
          }}
        />
      </li>
      <li className="my-2 whitespace-pre-wrap text-slate-500 text-sm dark:text-slate-400">
        <Trans
          i18nKey="fieldDomainDesc2"
          components={{
            boldHttpsPrefix: (
              <b className="font-semibold text-slate-900 dark:text-slate-200">https://</b>
            ),
          }}
        />
      </li>
    </ul>
  );
};
