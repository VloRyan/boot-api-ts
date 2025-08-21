import { DeleteResourceButton } from "./";

import { ResourceObject } from "@vloryan/ts-jsonapi-form/jsonapi/model";

import { TypeIcon } from "./icons/";

import { Col } from "react-bootstrap";
import { Children, PropsWithChildren } from "react";
import { joinPath } from "../functions";
import { QueryKey } from "@tanstack/query-core";
import { Link, useLocation } from "wouter";

export interface ListItemCardProps {
  object: ResourceObject;
  queryKey: QueryKey;
}

export function ItemRow({ object, queryKey }: ListItemCardProps) {
  if (!object) {
    return null;
  }
  const [location] = useLocation();
  return (
    <>
      <Col>
        <Link to={joinPath(location, object.id)}>
          <TypeIcon type={object.type as string} className="me-1"></TypeIcon>
          {object.attributes && object.attributes.name
            ? (object.attributes.name as string)
            : object.id}
        </Link>
      </Col>
      <ItemActionCol
        objectUrl={joinPath(location, object.id)}
        queryKey={queryKey}
      />
    </>
  );
}
interface ItemActionColProps {
  objectUrl: string;
  queryKey: QueryKey;
}
export const ItemActionCol = ({
  objectUrl,
  queryKey,
  children,
}: PropsWithChildren<ItemActionColProps>) => {
  return (
    <Col className="pe-0 d-flex justify-content-end">
      {Children.map(children, (child) => (
        <div className="me-1">{child}</div>
      ))}
      <DeleteResourceButton url={objectUrl} queryKey={queryKey} size="sm" />
    </Col>
  );
};
