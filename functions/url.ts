import { trimPrefix, trimSuffix } from "./";
import { ObjectLike } from "@vloryan/ts-jsonapi-form/jsonapi/model/Types";

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

export function toParamFamily(name: string, o: ObjectLike): string {
  let params = "";
  for (const k in o) {
    if (params.length > 0) {
      params += "&";
    }
    params += `${name}[` + k + "]=" + o[k];
  }
  return params;
}
