import { TjpDocumentPath } from "./document_path";
import { TjpMissingKeyError } from "./error";
import { TjpParser } from "./parser";

export type UnparsedObject = { [key: string]: unknown };

export class TjpObjectParser {
  constructor(
    private readonly object: UnparsedObject,
    private readonly objectPath: TjpDocumentPath
  ) {}

  get(key: string): TjpParser {
    const value = this.object[key];
    const valuePath = [...this.objectPath, key];
    if (value === undefined) {
      throw new TjpMissingKeyError(valuePath);
    }
    return new TjpParser(value, valuePath);
  }
}
