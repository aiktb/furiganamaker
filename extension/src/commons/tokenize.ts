import _initAsync, {
  type Tokenizer as _Tokenizer,
  TokenizerBuilder as _TokenizerBuilder,
  type InitInput,
} from "lindera-wasm-ipadic";

export type LinderaToken = {
  byteStart: number;
  byteEnd: number;
  surface: string;
  wordId: number;
  isSystem?: boolean;
} & IpadicDetailsObject;

export const IPADIC_DETAILS_KEYS = [
  "partOfSpeech",
  "partOfSpeechSubcategory1",
  "partOfSpeechSubcategory2",
  "partOfSpeechSubcategory3",
  "conjugationForm",
  "conjugationType",
  "baseForm",
  "reading",
  "pronunciation",
] as const;

export type IpadicDetailsKeys = (typeof IPADIC_DETAILS_KEYS)[number];

export type IpadicDetailsObject = {
  [K in (typeof IPADIC_DETAILS_KEYS)[number]]: string;
};

export type FormattedToken = {
  byteEnd: number;
  byteStart: number;
  text: string;
  wordId: {
    id: number;
    isSystem: boolean;
  };
  reading: string;
};

export class Tokenizer {
  #superTokenizer: _Tokenizer;
  #tokensFormatter(tokens: LinderaToken[]): FormattedToken[] {
    return tokens.map((token) => {
      return {
        byteEnd: token.byteEnd,
        byteStart: token.byteStart,
        text: token.surface,
        wordId: {
          id: token.wordId,
          isSystem: token.isSystem ?? false,
        },
        reading: token.reading,
      };
    });
  }
  constructor(tokenizer: _Tokenizer) {
    this.#superTokenizer = tokenizer;
  }
  tokenize(inputText: string): FormattedToken[] {
    const originalTokens = this.#superTokenizer.tokenize(inputText);
    return this.#tokensFormatter(originalTokens);
  }
}
export class TokenizerBuilder {
  #superTokenizerBuilder: _TokenizerBuilder;
  constructor() {
    this.#superTokenizerBuilder = new _TokenizerBuilder();
  }
  build(): Tokenizer {
    this.#superTokenizerBuilder.setDictionary("embedded://ipadic");
    this.#superTokenizerBuilder.setMode("normal");
    this.#superTokenizerBuilder.appendCharacterFilter("unicode_normalize", { kind: "nfkc" });
    this.#superTokenizerBuilder.appendTokenFilter("lowercase", {});
    this.#superTokenizerBuilder.appendTokenFilter("japanese_compound_word", {
      kind: "ipadic",
      tags: ["名詞,数"],
      new_tag: "名詞,数",
    });
    const superTokenizer = this.#superTokenizerBuilder.build();
    return new Tokenizer(superTokenizer);
  }
}

export async function initAsync(options?: { moduleOrPath: InitInput }): Promise<void> {
  await _initAsync(options);
}
