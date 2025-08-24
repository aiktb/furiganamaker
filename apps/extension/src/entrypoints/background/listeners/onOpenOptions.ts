import { ExtEvent } from "@/commons/constants";

export const registerOnOpenOptionsMessage = () => {
  browser.runtime.onMessage.addListener((message) => {
    if (message === ExtEvent.OpenOptionsPage) {
      browser.runtime.openOptionsPage();
    }
  });
};
