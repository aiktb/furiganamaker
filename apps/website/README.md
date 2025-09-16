# [furiganamaker.app](https://furiganamaker.app)

This website is the official website of Furigana Maker. It is mainly responsible for guiding users when installing the extension. For details, see the route "/welcome".

## Development

Preview in development environment(Assuming you are in the project root):

```bash
pnpm install
cd apps/website
pnpm run dev
```

This website is deployed using [Cloudflare Pages](https://pages.cloudflare.com/). To confirm that the website displays normally in the Cloudflare Workers runtime, use:

```bash
pnpm run start
```
