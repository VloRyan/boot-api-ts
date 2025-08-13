import { DeleteButton } from "./";

import { ResourceObject } from "ts-jsonapi-form/jsonapi/model";
import { deleteResource } from "ts-jsonapi-form/jsonapi/";

import { TypeIcon } from "./icons/";
import { useAlert } from "../hooks/";

import { Col } from "react-bootstrap";
import { Children, PropsWithChildren } from "react";
import { Config } from "../Config.ts";
import { joinPath } from "../functions";
import { QueryKey } from "@tanstack/query-core";
import { useQueryClient } from "@tanstack/react-query";
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
      <ItemActionCol object={object} queryKey={queryKey} />
    </>
  );
}
interface ItemActionColProps {
  object: ResourceObject;
  queryKey: QueryKey;
}
export const ItemActionCol = ({
  object,
  queryKey,
  children,
}: PropsWithChildren<ItemActionColProps>) => {
  const { addApiErrorAlerts } = useAlert();
  const queryClient = useQueryClient();
  return (
    <Col className="pe-0 d-flex justify-content-end">
      {Children.map(children, (child) => (
        <div className="me-1">{child}</div>
      ))}
      <DeleteButton
        size="sm"
        onClick={() => {
          deleteResource(
            joinPath(Config.ApiPath, object.links!.self as string),
          ).then(
            () => {
              queryClient.invalidateQueries({ queryKey }).then();
            },
            (error) => addApiErrorAlerts(error),
          );
        }}
      ></DeleteButton>
    </Col>
  );
};
