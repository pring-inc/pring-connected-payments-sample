import { TjpArrayParser, UnparsedArray } from "./array_parser";
import { TjpDocumentPath } from "./document_path";
import { TjpObjectParser, UnparsedObject } from "./object_parser";
import { TjpWrongTypeError } from "./error";

export class TjpParser {
  constructor(
    private readonly document: unknown,
    private readonly path: TjpDocumentPath
  ) {}

  get null(): null {
    if (this.document === null) {
      return null;
    }
    throw new TjpWrongTypeError(this.path, "null");
  }

  get boolean(): boolean {
    if (typeof this.document === "boolean") {
      return this.document as boolean;
    }
    throw new TjpWrongTypeError(this.path, "boolean");
  }

  get number(): number {
    if (typeof this.document === "number") {
      return this.document as number;
    }
    throw new TjpWrongTypeError(this.path, "number");
  }

  get string(): string {
    if (typeof this.document === "string") {
      return this.document as string;
    }
    throw new TjpWrongTypeError(this.path, "string");
  }

  object<T>(parseFunction: (parser: TjpObjectParser) => T): T {
    if (
      typeof this.document === "object" &&
      !Array.isArray(this.document) &&
      this.document !== null
    ) {
      const parser = new TjpObjectParser(
        this.document as UnparsedObject,
        this.path
      );
      return parseFunction(parser);
    }
    throw new TjpWrongTypeError(this.path, "object");
  }

  array<T>(parseFunction: (parser: TjpArrayParser) => T): T {
    if (Array.isArray(this.document)) {
      const parser = new TjpArrayParser(
        this.document as UnparsedArray,
        this.path
      );
      return parseFunction(parser);
    }
    throw new TjpWrongTypeError(this.path, "array");
  }
}
