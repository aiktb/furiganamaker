import { describe, expect, test } from "./fixtures";

describe("Extension options page", () => {
  test.beforeEach(async ({ page, extensionId }) => {
    await page.goto(`chrome-extension://${extensionId}/options.html`);
  });

  test("Hash routes are able to navigate correctly", async ({ page, extensionId }) => {
    const rulesEditorLink = page.getByRole("link", { name: "Settings" });
    expect(rulesEditorLink).toBeVisible();
    expect(rulesEditorLink).toHaveAttribute("href", "#/");
    expect(rulesEditorLink).toHaveAttribute("aria-current", "page");
    const changelogLink = page.getByRole("link", { name: "Changelog" });
    expect(changelogLink).toHaveAttribute("href", "#/changelog");
    await changelogLink.click();
    expect(page.url()).toBe(`chrome-extension://${extensionId}/options.html#/changelog`);
  });

  test("Toggle theme to Dark/Light ", async ({ page }) => {
    const getThemeLocalStorage = async () => {
      return await page.evaluate("localStorage.getItem('theme')");
    };

    expect(await getThemeLocalStorage()).toBeNull();
    expect((await page.getAttribute("html", "class"))?.includes("dark")).toBeFalsy();
    const toggle = page.getByRole("button", { name: "Toggle Theme Mode" });

    await toggle.click();
    expect((await page.getAttribute("html", "class"))?.includes("dark")).toBeTruthy();
    expect(await getThemeLocalStorage()).toBe("dark");

    await toggle.click();
    expect((await page.getAttribute("html", "class"))?.includes("dark")).toBeFalsy();
    expect(await getThemeLocalStorage()).toBe("light");
  });
});
