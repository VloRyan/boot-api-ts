import { useSearch } from "wouter";
import { extractFilter } from "ts-jsonapi-form/jsonapi/";

export const useFilter = () => {
  return extractFilter(useSearch());
};
