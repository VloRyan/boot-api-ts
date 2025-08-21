import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFloppyDisk,
  faPen,
  faPlus,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";
import { ButtonProps } from "react-bootstrap/Button";

import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { PropsWithChildren, Ref } from "react";
import { deleteResource } from "@vloryan/ts-jsonapi-form/jsonapi/";
import { joinPath } from "../functions";
import { Config } from "../Config.ts";
import { useAlert } from "../hooks";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKey } from "@tanstack/query-core";

interface IconButtonProps extends ButtonProps {
  icon: IconProp;
  ref?: Ref<HTMLButtonElement>;
}

export function IconButton(props: PropsWithChildren<IconButtonProps>) {
  return (
    <Button {...props}>
      <FontAwesomeIcon icon={props.icon} title={props.title}></FontAwesomeIcon>
      {props.children}
    </Button>
  );
}

export function DeleteButton(props: ButtonProps) {
  return (
    <IconButton
      icon={faTrashAlt}
      title="Delete"
      variant="outline-danger"
      {...props}
    />
  );
}

export interface DeleteResourceButtonProps
  extends Omit<ButtonProps, "onClick"> {
  url: string;
  queryKey: QueryKey;
}

export function DeleteResourceButton(props: DeleteResourceButtonProps) {
  const { addApiErrorAlerts } = useAlert();
  const queryClient = useQueryClient();
  const { url, queryKey, ...buttonProps } = props;
  return (
    <DeleteButton
      onClick={() => {
        deleteResource(joinPath(Config.ApiPath, url)).then(
          () => {
            queryClient.invalidateQueries({ queryKey }).then();
          },
          (error) => addApiErrorAlerts(error),
        );
      }}
      {...buttonProps}
    />
  );
}

export function CreateButton(props: ButtonProps) {
  return (
    <IconButton
      name="create"
      icon={faPlus}
      title="Create"
      type="button"
      variant="outline-primary"
      {...props}
    />
  );
}

export function SaveButton(props: ButtonProps) {
  return (
    <IconButton
      name="save"
      icon={faFloppyDisk}
      title="Save"
      variant="outline-primary"
      type={props.form ? "submit" : "button"}
      {...props}
    />
  );
}

export const EditButton = (props: ButtonProps) => {
  return (
    <IconButton
      name="edit"
      icon={faPen}
      title="Edit"
      type="button"
      variant="outline-primary"
      {...props}
    />
  );
};
