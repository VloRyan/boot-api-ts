import { useAlert, useResources } from "../hooks/";
import { ItemCells, LoadingSpinner, Pagination } from "./";
import { Fragment, ReactElement, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import {
  CollectionResourceDoc,
  Included,
  ResourceObject,
} from "@vloryan/ts-jsonapi-form/jsonapi/model/";

import { FetchOpts } from "@vloryan/ts-jsonapi-form/jsonapi/";
import { QueryKey } from "@tanstack/query-core";
import { extractPaginationMetaData } from "../functions";
import { buildQueryString } from "@vloryan/ts-jsonapi-form/jsonapi/JsonApi.ts";
import { MetaObject } from "@vloryan/ts-jsonapi-form/jsonapi/model/Types";

export interface ItemGroup {
  data: ResourceObject[];
  sortKey?: string;
  meta?: MetaObject;
}
export interface ItemCellsFuncProps {
  obj: ResourceObject;
  includes: Included;
  queryKey: QueryKey;
  group: ItemGroup;
}

export type ItemCellsFunc = (props: ItemCellsFuncProps) => ReactElement;

export interface GroupHeaderProps {
  group: ItemGroup;
  includes: Included;
}

export interface ItemListProps {
  resourcesUrl: string;
  locationUrl: string;
  opts?: FetchOpts;
  groupFunc?: (doc: CollectionResourceDoc) => ItemGroup[];
  Cells?: ItemCellsFunc;
  GroupHeader?: (props: GroupHeaderProps) => ReactElement;
}

export const ItemList = ({
  resourcesUrl,
  locationUrl,
  opts,
  Cells,
  groupFunc,
  GroupHeader,
}: ItemListProps) => {
  const { doc, isLoading, error, queryKey } = useResources(resourcesUrl, opts);
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
  const pageMetaData = extractPaginationMetaData(doc);

  const itemGroups: ItemGroup[] =
    groupFunc && doc
      ? groupFunc(doc).sort((a, b) =>
          (a.sortKey || "").localeCompare(b.sortKey || ""),
        )
      : [
          {
            data: doc?.data || ([] as ResourceObject[]),
          } satisfies ItemGroup,
        ];
  return (
    <Container fluid>
      {itemGroups.map((group, index) => {
        return (
          <Fragment key={index}>
            {GroupHeader ? (
              <GroupHeader group={group} includes={doc?.included || []} />
            ) : null}
            {group.data
              ? group.data.map((item, index) => (
                  <Row
                    key={index}
                    className={
                      "align-items-center" +
                      (index + 1 != group.data?.length
                        ? ""
                        : " border-bottom border-2") +
                      (index % 2 === 0 ? "" : " bg-body-secondary")
                    }
                  >
                    {Cells ? (
                      <Cells
                        obj={item}
                        includes={doc?.included || []}
                        queryKey={queryKey}
                        group={group}
                      />
                    ) : (
                      <ItemCells object={item} queryKey={queryKey} />
                    )}
                  </Row>
                ))
              : null}
          </Fragment>
        );
      })}
      {pageMetaData && (
        <Row className="mt-2">
          <Col className="text-center">
            <Pagination
              location={locationUrl}
              searchString={buildQueryString(opts)}
              offset={pageMetaData.offset}
              totalPages={Math.ceil(pageMetaData.total / pageMetaData.limit)}
            />
          </Col>
        </Row>
      )}
    </Container>
  );
};
