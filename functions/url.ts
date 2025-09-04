import { trimPrefix, trimSuffix } from "./";
import {
  ObjectLike,
  isResourceObject,
  ResourceIdentifierObject,
} from "@vloryan/ts-jsonapi-form/jsonapi/model";

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

export function toQueryString(
  f: ObjectLike,
  paramFamilyName: string = "filter",
): string {
  const params = toFilterParams(f, paramFamilyName);
  return params.length > 0 ? "?" + params.join("&") : "";
}

function toFilterParams(
  f: ObjectLike,
  paramFamilyName: string,
  prefix: string = "",
): string[] {
  const params: string[] = [];
  for (const k in f) {
    const value = f[k];
    const paramName = prefix ? prefix + "." + k : k;
    if (value == undefined) {
      continue;
    }
    if (isPrimitive(value)) {
      params.push(
        asParamFamily(
          paramFamilyName,
          paramName,
          encodeURIComponent(value as string),
        ),
      );
      continue;
    }
    if (isResourceObject(value as ObjectLike)) {
      params.push(
        asParamFamily(
          paramFamilyName,
          paramName,
          (f[k] as unknown as ResourceIdentifierObject).id,
        ),
      );
      continue;
    }
    if (Array.isArray(value)) {
      const encValues = value.map((v) => encodeURIComponent(v as string));
      params.push(
        asParamFamily(paramFamilyName, paramName, encValues.join(",")),
      );
      continue;
    }
    // must be an object
    params.push(...toFilterParams(value as ObjectLike, paramFamilyName, k));
  }
  return params;
}

function asParamFamily(name: string, k: string, v: string) {
  return `${name}[${k}]=${v}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isPrimitive(v: any) {
  const t = typeof v;
  return t === "string" || t === "number" || t === "boolean";
}
