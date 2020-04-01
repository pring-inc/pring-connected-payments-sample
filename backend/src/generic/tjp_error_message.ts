import { TjpParseError, TjpWrongTypeError } from "./tjp";
import { TjpDocumentPath } from "./tjp/document_path";

function jsonPathFrom(path: TjpDocumentPath): string {
  let jsonPath = "$";
  path.forEach(segment => {
    if (typeof segment === "string") {
      jsonPath += `.${segment}`;
    } else {
      jsonPath += `[${segment}]`;
    }
  });
  return jsonPath;
}

export function tjpErrorMessage(error: TjpParseError): string {
  const jsonPath = jsonPathFrom(error.path);
  if (error instanceof TjpWrongTypeError) {
    return `"${jsonPath}"が${error.expected}型でありません`;
  } else {
    return `${jsonPath}要素が見つかりません`;
  }
}
