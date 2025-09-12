# Lindera with IPADIC

## Introduction

This package provides a wrapper around `lindera-wasm-ipadic`, a WebAssembly version of Lindera that uses the IPADIC dictionary for Japanese morphological analysis. It simplifies the initialization and configuration process, making it easier to use Lindera in my project.

> [!IMPORTANT]This package will not be made public because I don't have the energy to maintain it.

### Key Points

- Convert the Token structure to an `Object`, eliminating `Map` and `Array`.
- Add type annotations, eliminating `any`.

## How to Use

This library cannot be bundled. You must put the WASM file into the `public` folder to ensure that the path is accessible in the browser.

> This file is usually located at `./node_modules/@lindera/ipadic/node_modules/lindera-wasm-ipadic/lindera_wasm_bg.wasm`.

Then you need to call `initAsync`:

```ts
import { initAsync, type Tokenizer, TokenizerBuilder } from "@lindera/ipadic";

await initAsync({ moduleOrPath: "lindera_wasm_bg.wasm" });
const builder = new TokenizerBuilder();
const tokenizer = builder.build();
const tokens = tokenizer.tokenize("すもももももももものうち");
```
