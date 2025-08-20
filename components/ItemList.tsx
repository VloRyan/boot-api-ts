import { useAlert, useResources } from "../hooks/";
import { ItemRow, LoadingSpinner, Pagination } from "./";
import { Fragment, ReactElement, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import {
  Included,
  ResourceObject,
} from "@vloryan/ts-jsonapi-form/jsonapi/model/";
import { useSearch } from "wouter";

import { extractFetchOpts, FetchOpts } from "@vloryan/ts-jsonapi-form/jsonapi/";
import { QueryKey } from "@tanstack/query-core";
import { extractPaginationMetaData } from "../functions";

export interface ItemGroup {
  id: string;
  headerFunc?: (group: ItemGroup) => ReactElement;
  data: ResourceObject[] | null;
}

export interface ItemListProps {
  resourcesUrl: string;
  locationUrl: string;
  itemCellsFunc?: (
    obj: ResourceObject,
    includes: Included,
    queryKey: QueryKey,
  ) => ReactElement;
  opts?: FetchOpts;
  groupFunc?: (objs: ResourceObject[]) => ItemGroup[];
}

export const ItemList = ({
  resourcesUrl,
  locationUrl,
  opts,
  itemCellsFunc,
  groupFunc,
}: ItemListProps) => {
  const searchString = useSearch();
  const queryOpts = extractFetchOpts(searchString, opts);
  const { doc, isLoading, error, queryKey } = useResources(
    resourcesUrl,
    queryOpts,
  );
  const { addApiErrorAlerts } = useAlert();
  useEffect(() => {
    if (error) {
      addApiErrorAlerts(error);
    }
  }, [error]);
  if (error && !isLoading) {
    return null;
  }
  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (!itemCellsFunc) {
    itemCellsFunc = (obj, queryKey) => {
      return <ItemRow object={obj} queryKey={queryKey} />;
    };
  }
  const pageMetaData = extractPaginationMetaData(doc);
  //const itemCount = doc?.meta ? (doc.meta["page[totalCount]"] as number) : 0;
  const itemGroups: ItemGroup[] = groupFunc
    ? groupFunc(doc?.data ? doc?.data : [])
    : [{ id: "0", data: doc?.data ? doc.data : null }];

  return (
    <Container fluid>
      {itemGroups.map((group) => {
        return (
          <Fragment key={group.id}>
            <GroupHeader group={group} />
            <GroupDataRows
              group={group}
              itemCellsFunc={itemCellsFunc}
              queryKey={queryKey}
              included={doc?.included}
            />
          </Fragment>
        );
      })}
      {pageMetaData && (
        <Row className="mt-2">
          <Col className="text-center">
            <Pagination
              location={locationUrl}
              searchString={searchString}
              offset={pageMetaData.offset}
              totalPages={Math.ceil(pageMetaData.total / pageMetaData.limit)}
            />
          </Col>
        </Row>
      )}
    </Container>
  );
};
const GroupDataRows = ({
  group,
  itemCellsFunc,
  queryKey,
  included,
}: {
  group: ItemGroup;
  itemCellsFunc: (
    obj: ResourceObject,
    includes: Included,
    queryKey: QueryKey,
  ) => ReactElement;
  queryKey: QueryKey;
  included?: Included;
}) => {
  return group.data?.map((item, index) => (
    <Row
      key={index}
      className={
        "align-items-center" +
        (index + 1 != group.data?.length ? "" : " border-bottom border-2") +
        (index % 2 === 0 ? "" : " bg-body-secondary")
      }
    >
      {itemCellsFunc(item, included || [], queryKey)}
    </Row>
  ));
};

const GroupHeader = ({ group }: { group: ItemGroup }) => {
  return group.headerFunc ? (
    <Row className="align-items-center">{group.headerFunc(group)}</Row>
  ) : null;
};
