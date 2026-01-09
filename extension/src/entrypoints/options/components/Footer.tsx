import { Trans, useTranslation } from "react-i18next";

const generateYear = () => {
  const year = new Date().getFullYear();
  return year === 2023 ? year : `2023-${year}`;
};

interface FooterLinkProps {
  href: string;
  content: string;
}

function FooterLink({ href, content }: FooterLinkProps) {
  return (
    <a
      className="font-semibold text-black underline decoration-solid transition hover:text-sky-500 dark:text-white"
      href={href}
      target="_blank"
      rel="noreferrer noopener"
    >
      {content}
    </a>
  );
}

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-gray-200 border-t dark:border-slate-800">
      <div className="mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <p className="flex flex-col flex-wrap gap-1.5 py-8 text-center text-sm sm:flex-row">
          <span className="block whitespace-nowrap sm:inline">
            <Trans
              i18nKey="footerCopyright"
              values={{ yearsRange: generateYear() }}
              components={{
                author: <FooterLink content="aiktb" href="https://github.com/aiktb" />,
              }}
            />
          </span>
          <span className="block sm:inline">
            <Trans
              i18nKey="footerLicense"
              components={{
                license: (
                  <FooterLink
                    content="MIT"
                    href="https://github.com/aiktb/furiganamaker/blob/main/LICENSE"
                  />
                ),
              }}
            />
          </span>
          <span className="block sm:inline">
            <Trans
              i18nKey="footerBuiltWith"
              components={{
                tool: <FooterLink content="WXT" href="https://wxt.dev" />,
              }}
            />
          </span>
        </p>
        <a
          className="flex size-9 items-center justify-center rounded-md text-black hover:bg-gray-100 dark:text-white dark:hover:bg-slate-800 dark:hover:text-white"
          href="https://github.com/aiktb/furiganamaker"
        >
          <span className="sr-only">{t("srGithub")}</span>
          <i className="i-fa6-brands-github size-5" />
        </a>
      </div>
    </footer>
  );
}
