import { ExtEvent } from "@/commons/constants";

export const registerOnInstalled = () => {
  browser.runtime.onInstalled.addListener((details) => {
    // If the context menu is not re-registered upon update, the menu may become missing or out of date.
    // Remove the contextMenu before creating it to avoid creating multiple contextMenus.
    browser.contextMenus.removeAll();
    const contextMenuItem: Browser.contextMenus.CreateProperties = {
      id: ExtEvent.AddFurigana,
      title: browser.i18n.getMessage("shortcutAddFurigana"),
      contexts: ["page"],
      documentUrlPatterns: ["http://*/*", "https://*/*"],
    };
    browser.contextMenus.create(contextMenuItem);

    switch (details.reason) {
      case browser.runtime.OnInstalledReason.INSTALL: {
        browser.tabs.create({ url: "https://furiganamaker.app/welcome" });
        break;
      }
      case browser.runtime.OnInstalledReason.UPDATE: {
        // V1.2.3 -> major.minor.patch
        // Only open the Changelog page to prompt the user when a new feature is available.
        const [majorPrevVersion, minorPrevVersion] = details.previousVersion!.split(".");
        const [majorCurrVersion, minorCurrVersion] = browser.runtime
          .getManifest()
          .version.split(".");

        if (majorPrevVersion !== majorCurrVersion || minorPrevVersion !== minorCurrVersion) {
          browser.tabs.create({ url: browser.runtime.getURL("/options.html#/changelog") });
        }
        break;
      }
    }
  });
};
