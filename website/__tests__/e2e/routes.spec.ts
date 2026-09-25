import { expect, test } from "@playwright/test";

test("SSR serves both routes and returns 404 for unknown paths", async ({ request }) => {
  const home = await request.get("/");
  expect(home.status()).toBe(200);
  const html = await home.text();
  expect(html).toContain("Furigana Maker - Add furigana to Japanese text on any page");
  expect(html).toContain("Star on GitHub");
  expect(html).not.toContain("Stars on GitHub");
  expect(html).not.toContain("api.github.com");

  const welcome = await request.get("/welcome");
  expect(welcome.status()).toBe(200);
  expect(await welcome.text()).toContain("Welcome to Furigana Maker");
  const missing = await request.get("/missing-route");
  expect(missing.status()).toBe(404);
  expect(await missing.text()).toContain("Page not found");
});

test("navigation, hash links, reload and browser history work after hydration", async ({
  page,
}) => {
  const errors: string[] = [];
  const githubRequests: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    if (new URL(request.url()).hostname === "api.github.com") {
      githubRequests.push(request.url());
    }
  });
  await page.goto("/");
  await expect(page).toHaveTitle("Furigana Maker - Add furigana to Japanese text on any page");
  // A client navigation should preserve the current document.
  await page.evaluate(() => {
    document.documentElement.dataset.navigationTest = "mounted";
  });
  await page.getByRole("link", { name: "Welcome", exact: true }).click();
  await expect(page).toHaveURL("/welcome");
  await expect(page).toHaveTitle("Welcome to Furigana Maker");
  await expect(page.locator("html")).toHaveAttribute("data-navigation-test", "mounted");
  await page.reload();
  await expect(page).toHaveTitle("Welcome to Furigana Maker");

  await page.getByRole("link", { name: "Features", exact: true }).click();
  await expect(page).toHaveURL("/#features");
  await expect(page.locator("#features")).toBeInViewport();
  await page.getByRole("link", { name: "Demo", exact: true }).click();
  await expect(page).toHaveURL("/#demo");
  await expect(page.locator("#demo")).toBeInViewport();
  await page.goBack();
  await expect(page).toHaveURL("/#features");
  await page.goForward();
  await expect(page).toHaveURL("/#demo");
  expect(errors).toEqual([]);
  expect(githubRequests).toEqual([]);
});

test("unknown routes offer a working home link", async ({ page }) => {
  await page.goto("/missing-route");
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
  await page.getByRole("link", { name: "Go home" }).click();
  await expect(page).toHaveURL("/");
  await expect(page).toHaveTitle("Furigana Maker - Add furigana to Japanese text on any page");
});
