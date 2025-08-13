import { useSearch } from "wouter";
import { extractFilter } from "@vloryan/ts-jsonapi-form/jsonapi/";

export const useFilter = () => {
  return extractFilter(useSearch());
};
