import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFloppyDisk,
  faPen,
  faPlus,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { ButtonProps } from "react-bootstrap/Button";

import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { PropsWithChildren } from "react";
import { deleteResource } from "@vloryan/ts-jsonapi-form/jsonapi/";
import { joinPath } from "../functions";
import { Config } from "../Config.ts";
import { useAlert } from "../hooks";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKey } from "@tanstack/query-core";
import { Link } from "wouter";

export interface IconButtonProps extends PropsWithChildren<ButtonProps> {
  icon: IconProp;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  download?: any;
}

export function IconButton({
  icon,
  title,
  children,
  href,
  download,
  ...btnProps
}: IconButtonProps) {
  if (btnProps.disabled && title) {
    return (
      <OverlayTrigger overlay={<Tooltip>{title}</Tooltip>}>
        <span className="d-inline-block">
          <Button {...btnProps}>
            <FontAwesomeIcon icon={icon}></FontAwesomeIcon>
            {children}
          </Button>
        </span>
      </OverlayTrigger>
    );
  }
  if (href && !btnProps.disabled) {
    return download ? (
      <a
        href={href}
        download={download}
        title={title}
        className={
          "align-content-center btn" +
          (btnProps.variant ? " btn-" + btnProps.variant : " btn-primary") +
          (btnProps.size ? " btn-" + btnProps.size : "") +
          (btnProps.className ? " " + btnProps.className : "")
        }
        role="button"
      >
        <FontAwesomeIcon icon={icon}></FontAwesomeIcon>
        {children}
      </a>
    ) : (
      <Link
        to={href}
        title={title}
        className={
          "align-content-center btn" +
          (btnProps.variant ? " btn-" + btnProps.variant : " btn-primary") +
          (btnProps.size ? " btn-" + btnProps.size : "") +
          (btnProps.className ? " " + btnProps.className : "")
        }
        role="button"
      >
        <FontAwesomeIcon icon={icon}></FontAwesomeIcon>
        {children}
      </Link>
    );
  }
  return (
    <Button title={title} {...btnProps}>
      <FontAwesomeIcon icon={icon}></FontAwesomeIcon>
      {children}
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
  const { addApiErrorAlerts, addSuccessAlert } = useAlert();
  const queryClient = useQueryClient();
  const { url, queryKey, ...buttonProps } = props;
  return (
    <DeleteButton
      onClick={() => {
        deleteResource(joinPath(Config.ApiPath, url)).then(
          () => {
            queryClient.invalidateQueries({ queryKey }).then();
            addSuccessAlert("Deleted");
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
