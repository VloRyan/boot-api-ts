import { Form, InputGroup } from "react-bootstrap";

import React, { ReactNode } from "react";
import { LabeledGroup, LabeledGroupPropsWithOnChange } from "./";

export interface TextFieldProps extends LabeledGroupPropsWithOnChange {
  children?: ReactNode;
  placeholder?: string;
  error?: string;
}

export function TextField(props: TextFieldProps) {
  const {
    name,
    defaultValue,
    onChange,
    children,
    disabled,
    placeholder,
    error,
    ...groupProps
  } = props;
  return (
    <LabeledGroup {...groupProps}>
      <InputGroup>
        <Form.Control
          type="text"
          name={name}
          defaultValue={defaultValue}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          isInvalid={error != undefined}
        ></Form.Control>
        {children}
        {error ? (
          <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
        ) : null}
      </InputGroup>
    </LabeledGroup>
  );
}

export interface TextAreaProps extends LabeledGroupPropsWithOnChange {
  rows?: number;
  mapValue?: (value: string) => string;
  placeholder?: string;
}

export const TextAreaField = React.forwardRef<
  HTMLTextAreaElement,
  TextAreaProps
>((props, ref) => {
  const { name, rows, defaultValue, onChange, placeholder, ...groupProps } =
    props;
  let v = typeof defaultValue === "string" ? defaultValue : "";
  if (props.mapValue) {
    v = props.mapValue(v);
  }
  return (
    <LabeledGroup {...groupProps}>
      <Form.Control
        as="textarea"
        rows={rows}
        name={name}
        defaultValue={v}
        ref={ref}
        onChange={onChange}
        placeholder={placeholder}
        onKeyDown={(event) =>
          event.key == "Enter" ? event.stopPropagation() : null
        }
      ></Form.Control>
    </LabeledGroup>
  );
});
