import { Form } from "react-bootstrap";

import { LabeledGroup, LabeledGroupPropsWithOnChange } from "./";

export interface SelectFieldProps extends LabeledGroupPropsWithOnChange {
  options: Map<string, string | null>;
}

export function SelectField(props: SelectFieldProps) {
  const { name, defaultValue, onChange, options, disabled, ...groupProps } =
    props;
  const optionElements = [];

  for (const [value, caption] of options) {
    optionElements.push(
      <option key={value} value={value} selected={value === defaultValue}>
        {caption}
      </option>,
    );
  }
  return (
    <LabeledGroup {...groupProps}>
      <Form.Select
        name={name}
        onChange={onChange}
        defaultValue={defaultValue}
        disabled={disabled}
      >
        {optionElements}
      </Form.Select>
    </LabeledGroup>
  );
}
