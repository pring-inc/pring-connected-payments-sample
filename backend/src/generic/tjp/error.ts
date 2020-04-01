import { TjpDocumentPath } from "./document_path";

export class TjpParseError {
  constructor(public readonly path: TjpDocumentPath) {}
}

export class TjpWrongTypeError extends TjpParseError {
  constructor(
    public readonly path: TjpDocumentPath,
    public readonly expected: string
  ) {
    super(path);
  }
}

export class TjpMissingKeyError extends TjpParseError {
  constructor(public readonly path: TjpDocumentPath) {
    super(path);
  }
}

export class TjpMissingIndexError extends TjpParseError {
  constructor(public readonly path: TjpDocumentPath) {
    super(path);
  }
}
