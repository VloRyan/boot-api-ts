import { DeleteResourceButton } from "./";

import { ResourceObject } from "@vloryan/ts-jsonapi-form/jsonapi/model";

import { TypeIcon } from "./icons/";

import { Col } from "react-bootstrap";
import { joinPath } from "../functions";
import { QueryKey } from "@tanstack/query-core";
import { Link, useLocation } from "wouter";

export interface ItemCellsProps {
  object: ResourceObject;
  queryKey: QueryKey;
}

export function ItemCells({ object, queryKey }: ItemCellsProps) {
  if (!object) {
    return null;
  }
  const [location] = useLocation();
  const objectUrl = joinPath(location, object.id);
  return (
    <>
      <Col sm="10">
        <Link to={objectUrl}>
          <TypeIcon type={object.type as string} className="me-1"></TypeIcon>
          {object.attributes && object.attributes.name
            ? (object.attributes.name as string)
            : object.id}
        </Link>
      </Col>
      <Col sm="2" className="text-end pe-0">
        <DeleteResourceButton url={objectUrl} queryKey={queryKey} size="sm" />
      </Col>
    </>
  );
}
