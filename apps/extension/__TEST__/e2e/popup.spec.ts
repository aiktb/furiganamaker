import type { Page } from "@playwright/test";
import { ExtStorage, type GeneralSettings } from "@/commons/constants";
import { describe, expect, test } from "./fixtures";

describe("Extension popup page", () => {
  test.beforeEach(async ({ page, extensionId }) => {
    await page.goto(`chrome-extension://${extensionId}/popup.html`);
  });

  const getGeneralSettings = async (page: Page) => {
    const storage: { generalSettings: GeneralSettings } = await page.evaluate(
      "chrome.storage.local.get('generalSettings')",
    );
    return storage.generalSettings;
  };

  test("Default settings are displayed", async ({ page }) => {
    expect(await getGeneralSettings(page)).toBe(undefined);
    const autoModeToggle = page.getByRole("switch", { name: "On-Off Auto Mode" });
    expect(await autoModeToggle.isChecked()).toBe(true);
    const kanjiFilterToggle = page.getByRole("switch", { name: "On-Off Kanji Filter" });
    expect(await kanjiFilterToggle.isChecked()).toBe(false);
    const displayModeSelect = page.getByRole("button", { name: "Always Show" });
    expect(displayModeSelect).toBeVisible();
    const furiganaTypeSelect = page.getByRole("button", { name: "Hiragana" });
    expect(furiganaTypeSelect).toBeVisible();
    const selectModeSelect = page.getByRole("button", { name: "Default" });
    expect(selectModeSelect).toBeVisible();
    const slider = page.getByRole("slider");
    expect(await slider.getAttribute("aria-valuenow")).toBe("75");
    const fontColorIndicator = page.locator("div[style='background-color: currentcolor;']");
    expect(fontColorIndicator).toBeHidden();
  });

  test("Setting switches, and correctly saves the settings to storage", async ({ page }) => {
    const autoModeToggle = page.getByRole("switch", { name: "On-Off Auto Mode" });
    await autoModeToggle.click();
    expect(await autoModeToggle.isChecked()).toBe(false);
    expect((await getGeneralSettings(page))[ExtStorage.AutoMode]).toBeFalsy();
    await autoModeToggle.click();
    expect(await autoModeToggle.isChecked()).toBe(true);
    expect((await getGeneralSettings(page))[ExtStorage.AutoMode]).toBeTruthy();
  });

  test("Setting listboxes, and correctly saves the settings to storage", async ({ page }) => {
    await page.getByRole("button", { name: "Always Show" }).click();
    const listBox = page.getByRole("listbox");
    expect(listBox).toBeVisible();
    await listBox.getByText("Hover Gap").click();
    expect(page.getByRole("button", { name: "Hover Gap" })).toBeVisible();
    expect((await getGeneralSettings(page))[ExtStorage.DisplayMode]).toBe("hover gap");
  });

  test("Click the slider to setting font size", async ({ page }) => {
    const sliderTrack = page.getByRole("slider");
    const sliderOffsetWidth = await sliderTrack.evaluate((el) => {
      return el.getBoundingClientRect().width;
    });

    const TOLERANCE = 10;
    await sliderTrack.click({ force: true, position: { x: TOLERANCE, y: 0 } });
    expect(await sliderTrack.getAttribute("aria-valuenow")).toBe("50");
    expect((await getGeneralSettings(page))[ExtStorage.FontSize]).toBe(50);

    await sliderTrack.click({ force: true, position: { x: sliderOffsetWidth - TOLERANCE, y: 0 } });
    expect(await sliderTrack.getAttribute("aria-valuenow")).toBe("100");
    expect((await getGeneralSettings(page))[ExtStorage.FontSize]).toBe(100);
  });

  test("Open color picker, and setting font color", async ({ page }) => {
    await page.getByRole("button", { name: "Select Color" }).click();
    await page.getByRole("button", { name: "aqua", exact: true }).click();
    expect((await getGeneralSettings(page))[ExtStorage.FontColor]).toBe("aqua");
    await page.getByRole("button", { name: "Reset" }).click();
    expect((await getGeneralSettings(page))[ExtStorage.FontColor]).toBe("currentColor");
    const input = page.getByLabel("HEX");
    await input.fill("00ffff");
    await input.press("Enter");
    expect((await getGeneralSettings(page))[ExtStorage.FontColor]).toBe("#00ffff");
    const closeBtn = page.locator(".playwright-color-picker-close-btn");
    expect(closeBtn).toBeTruthy();
  });
});
