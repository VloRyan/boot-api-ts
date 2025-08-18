import { ItemList, Toolbar } from "../components/";
import { PropsWithChildren, ReactElement } from "react";
import { useLocation } from "wouter";
import { ObjectForm } from "@vloryan/ts-jsonapi-form/form/";
import {
  Included,
  ResourceObject,
} from "@vloryan/ts-jsonapi-form/jsonapi/model/";
import { FetchOpts } from "@vloryan/ts-jsonapi-form/jsonapi/";
import { joinPath } from "../functions";
import { QueryKey } from "@tanstack/query-core";
import { Config } from "../Config";

export interface ItemListPageProps {
  itemCellsFunc?: (
    obj: ResourceObject,
    includes: Included,
    queryKey: QueryKey,
  ) => ReactElement;
  opts?: FetchOpts;
  searchProperty?: string;
  searchBarContent?: (form: ObjectForm) => ReactElement;
}

export const ItemListPage = ({
  opts,
  itemCellsFunc,
  searchProperty,
  searchBarContent,
}: PropsWithChildren<ItemListPageProps>) => {
  const [location] = useLocation();
  const resourcesUrl = joinPath(Config.ApiPath, location);
  return (
    <>
      <Toolbar
        createButton={{ name: "create" }}
        searchProperty={searchProperty}
        searchBarContent={searchBarContent}
      ></Toolbar>
      <ItemList
        resourcesUrl={resourcesUrl}
        locationUrl={location}
        itemCellsFunc={itemCellsFunc}
        opts={opts}
      />
    </>
  );
};
