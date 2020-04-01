import { TjpDocumentPath } from "./document_path";
import { TjpMissingIndexError } from "./error";
import { TjpParser } from "./parser";

export type UnparsedArray = { [index: number]: unknown };

export class TjpArrayParser {
  constructor(
    private readonly array: UnparsedArray,
    private readonly arrayPath: TjpDocumentPath
  ) {}

  get(index: number): TjpParser {
    const value = this.array[index];
    const valuePath = [...this.arrayPath, index];
    if (value === undefined) {
      throw new TjpMissingIndexError(valuePath);
    }
    return new TjpParser(value, valuePath);
  }

  *[Symbol.iterator]() {
    for (let i = 0; this.array[i] !== undefined; ++i) {
      const value = this.array[i];
      const valuePath = [...this.arrayPath, i];
      yield new TjpParser(value, valuePath);
    }
  }
}
