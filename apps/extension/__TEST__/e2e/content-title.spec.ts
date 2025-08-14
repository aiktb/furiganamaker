import { describe, expect, test } from "./fixtures";

describe("Content script should not modify <head><title>", () => {
  test("ruby is added only in body, not in head title", async ({ page }) => {
    const url = "https://example.org/test-ja";
    const html = `<!doctype html>
      <html lang="ja">
        <head>
          <meta charset="utf-8" />
          <title>日本語タイトル</title>
        </head>
        <body>
          <main>
            <p>漢字テスト</p>
          </main>
        </body>
      </html>`;

    await page.route(url, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "text/html; charset=utf-8",
        body: html,
      });
    });

    await page.goto(url);
    // Wait for the body to be loaded & ruby auto added
    await page.waitForSelector("body ruby");

    const headRubyCount = await page.$$eval("head ruby", (els) => els.length);
    expect(headRubyCount).toBe(0);

    const title = await page.title();
    expect(title).toBe("日本語タイトル");

    const bodyRubyCount = await page.$$eval("body ruby", (els) => els.length);
    expect(bodyRubyCount).toBeGreaterThan(0);
  });
});
