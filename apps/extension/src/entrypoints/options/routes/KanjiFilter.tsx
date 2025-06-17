import { Transition } from "@headlessui/react";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import Page from "../components/Page";

export default function KanjiFilter() {
  const { t } = useTranslation();

  return (
    <Page title={t("navKanjiFilter")} icon="i-tabler-filter">
      <Suspense>
        <Transition
          as="div"
          appear
          show={true}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          HELLO
        </Transition>
      </Suspense>
    </Page>
  );
}
