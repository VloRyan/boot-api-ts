import { trimPrefix, trimSuffix } from "./";

const protocolRegEx = /\w+:\/\//g;
export function joinPath(base: string, ...elements: string[]) {
  let prefix = "";
  const matches = base.match(protocolRegEx);
  if (matches) {
    prefix = matches[0];
    base = base.slice(prefix.length);
  }
  let path = trimSuffix(base, "/");
  for (const element of elements) {
    path += "/" + trimSuffix(trimPrefix(element, "/"), "/");
  }
  return prefix + path;
}
