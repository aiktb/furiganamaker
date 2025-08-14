import picomatch from "picomatch/posix";
import { onMessage } from "@/commons/message";
import { customSelectors } from "@/commons/utils";

export const registerOnGetSelector = () => {
  onMessage("getSelector", async ({ data }) => {
    const allRules = await customSelectors.getValue();

    const selector =
      allRules
        .filter((rule) => {
          const isMatch = picomatch(rule.domain, { nocase: true });
          return rule.active && isMatch(data.domain);
        })
        .map((rule) => rule.selector)
        .join(", ") || "";

    return { selector };
  });
};
