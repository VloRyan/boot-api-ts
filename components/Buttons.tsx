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
    ></IconButton>
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
    ></IconButton>
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
    ></IconButton>
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
    ></IconButton>
  );
};
