import { Col, Form } from "react-bootstrap";

import { ChangeEvent, JSX, PropsWithChildren } from "react";
import { FormControlElement } from "./";
import { ColProps } from "react-bootstrap/Col";

export interface LabeledGroupProps extends PropsWithChildren<ColProps> {
  label?: string;
  column?: true | "sm" | "lg";
}

export function LabeledGroup(props: LabeledGroupProps): JSX.Element {
  const { label, children, column, ...groupProps } = props;
  return (
    <Form.Group as={Col} {...groupProps}>
      {label ? <Form.Label column={column}>{label}</Form.Label> : null}
      {children}
    </Form.Group>
  );
}

export interface LabeledGroupPropsWithOnChange extends LabeledGroupProps {
  onChange?: (e: ChangeEvent<FormControlElement>) => void;
}
