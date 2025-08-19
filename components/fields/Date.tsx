import { Form } from "react-bootstrap";

import { JSX, useState } from "react";

import { LabeledGroup, LabeledGroupPropsWithOnChange } from "./";

type DateFormat = "DateOnly" | "ISO 8601";
export interface DateFieldProps extends LabeledGroupPropsWithOnChange {
  valueFormat?: DateFormat;
}
export function DateField(props: DateFieldProps): JSX.Element {
  const { name, defaultValue, onChange, required, valueFormat, ...groupProps } =
    props;
  const [invalid, setInvalid] = useState(false);
  const dateValue = defaultValue ? new Date(defaultValue as string) : undefined;
  const value =
    dateValue && !Number.isNaN(dateValue.getTime())
      ? dateValue.toISOString().substring(0, 10)
      : undefined;
  return (
    <LabeledGroup {...groupProps}>
      <Form.Control
        name={name}
        required={required}
        type="date"
        isInvalid={invalid}
        defaultValue={value}
        onChange={(e) => {
          const target = e.currentTarget as HTMLInputElement;
          if (required) {
            setInvalid(!target.valueAsDate);
          }
          if (onChange) {
            onChange(e);
          }
        }}
        data-testid="date-field"
      ></Form.Control>
    </LabeledGroup>
  );
}

function formatDate(value?: string, format?: DateFormat): string {
  if (!value) {
    return "";
  }
  switch (format ? format : "DateOnly") {
    case "ISO 8601": // remove millis
      return new Date(value).toISOString().replace(/\.\d+/, "");
    case "DateOnly":
      return value;
  }
}
function formatLocalDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  return `${year}-${month}-${day}T${hour}:${minute}`;
}

export function DateTimeField(
  props: LabeledGroupPropsWithOnChange,
): JSX.Element {
  const { name, defaultValue, onChange, required, ...groupProps } = props;
  const [invalid, setInvalid] = useState(false);
  const dateValue = defaultValue ? new Date(defaultValue as string) : undefined;
  const value =
    dateValue && !Number.isNaN(dateValue.getTime())
      ? formatLocalDate(dateValue)
      : undefined;
  return (
    <LabeledGroup {...groupProps}>
      <Form.Control
        name={name}
        type="datetime-local"
        required={required}
        defaultValue={value}
        isInvalid={invalid}
        onChange={(e) => {
          const target = e.currentTarget as HTMLInputElement;
          if (required) {
            setInvalid(!target.valueAsDate);
          }
          if (onChange) {
            onChange(e);
          }
        }}
        data-testid="datetime-field"
      ></Form.Control>
    </LabeledGroup>
  );
}
export const exportedForTesting = {
  formatDate,
};
