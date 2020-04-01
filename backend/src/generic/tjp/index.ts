/**
 * tjp.ts - Typed Json Parser
 */
import { TjpParser } from "./parser";
export {
  TjpParseError,
  TjpWrongTypeError,
  TjpMissingKeyError,
  TjpMissingIndexError
} from "./error";

export function tjp(document: unknown): TjpParser {
  return new TjpParser(document, []);
}
