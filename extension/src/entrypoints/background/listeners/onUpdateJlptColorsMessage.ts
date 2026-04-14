import { ExtEvent } from "@/commons/constants";

export const registerOnUpdateJlptColorsMessage = () => {
  browser.runtime.onMessage.addListener((event) => {
    if (event === ExtEvent.UpdateJlptColors) {
      // The jlptLevel styles will be reapplied on the content script
      // when it receives this message, so we just need to acknowledge it here
      return;
    }
  });
};
