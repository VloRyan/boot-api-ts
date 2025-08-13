import { Form } from "react-bootstrap";

import { JSX } from "react";
import { LabeledGroup, LabeledGroupPropsWithOnChange } from "./";

export interface CheckboxProps extends LabeledGroupPropsWithOnChange {
  defaultChecked?: boolean;
}
export function CheckboxField(props: CheckboxProps): JSX.Element {
  const { name, defaultChecked, onChange, ...groupProps } = props;
  return (
    <LabeledGroup {...groupProps}>
      <Form.Check
        type="switch"
        name={name}
        defaultChecked={defaultChecked}
        onChange={onChange}
      ></Form.Check>
    </LabeledGroup>
  );
}
