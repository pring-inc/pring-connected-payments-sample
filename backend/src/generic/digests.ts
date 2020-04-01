import forge from "node-forge";

export function sha256Digest(message: string): string {
  const md = forge.md.sha256.create();
  md.update(message, "utf8");
  return md.digest().toHex();
}
