import { ItemList, ItemListProps, Toolbar } from "../components/";
import { ReactElement } from "react";
import { useLocation } from "wouter";
import { ObjectForm } from "@vloryan/ts-jsonapi-form/form/";
import { joinPath } from "../functions";
import { Config } from "../Config";

export interface ItemListPageProps
  extends Omit<ItemListProps, "locationUrl" | "resourcesUrl"> {
  searchProperty?: string;
  searchBarContent?: (form: ObjectForm) => ReactElement;
}

export const ItemListPage = (props: ItemListPageProps) => {
  const [location] = useLocation();
  const { searchProperty, searchBarContent, ...itemListProps } = props;
  return (
    <>
      <Toolbar
        createButton={{ name: "create" }}
        searchProperty={searchProperty}
        searchBarContent={searchBarContent}
      ></Toolbar>
      <ItemList
        locationUrl={location}
        resourcesUrl={joinPath(Config.ApiPath, location)}
        {...itemListProps}
      />
    </>
  );
};
