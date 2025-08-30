import { describe, expect, test } from "./fixtures";

describe("Extension background script", () => {
  test.beforeEach(async ({ page, extensionId }) => {
    await page.goto(`chrome-extension://${extensionId}/background.js`);
  });

  test("Icons have been generated", async ({ page }) => {
    const manifest: Browser.runtime.Manifest = await page.evaluate("chrome.runtime.getManifest()");
    const expectedIcons = {
      16: "icons/16.png",
      32: "icons/32.png",
      48: "icons/48.png",
      128: "icons/128.png",
    };
    expect(manifest.icons).toEqual(expectedIcons);
    for (const path of Object.values(expectedIcons)) {
      await page.evaluate(`fetch(chrome.runtime.getURL("${path}"))`);
    }
  });

  test("Shortcuts have been registered", async ({ page }) => {
    const shortcuts: Browser.commands.Command[] = await page.evaluate("chrome.commands.getAll()");
    const shortcutNames = shortcuts.map((shortcut) => shortcut.name);
    const expectedShortcuts = [
      "_execute_action",
      "addFurigana",
      "toggleAutoMode",
      "toggleKanjiFilter",
      "openOptionsPage",
      "openPlaygroundPage",
    ];
    for (const shortcut of expectedShortcuts) {
      expect(shortcutNames).toContain(shortcut);
    }
  });
});
