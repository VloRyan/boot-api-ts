import { Page } from "@vloryan/ts-jsonapi-form/jsonapi/JsonApi";
import { extractPage } from "@vloryan/ts-jsonapi-form/jsonapi/Request";
import { useSearch } from "wouter";

export const usePage = (defaults?: Page) => {
  if (!defaults) {
    defaults = { limit: 25, offset: 0 } satisfies Page;
  }
  const p = extractPage(useSearch());
  return {
    limit: p?.limit ?? defaults.limit,
    offset: p?.offset ?? defaults.offset,
  } satisfies Page;
};
