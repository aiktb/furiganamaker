import { onMessage } from "@/commons/message";
import { customSelectors } from "@/commons/utils";

export const registerOnGetSelector = () => {
  onMessage("getSelector", async ({ data }) => {
    const allRules = await customSelectors.getValue();

    const selector =
      allRules
        ?.filter((rule) => rule.domain === data.domain && rule.active)
        .map((rule) => rule.selector)
        .join(", ") || "";

    return { selector };
  });
};
