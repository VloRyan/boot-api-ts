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
  const value = defaultValue ? new Date(defaultValue as string) : undefined;
  return (
    <LabeledGroup {...groupProps}>
      <Form.Control
        name={name}
        required={required}
        type="date"
        isInvalid={invalid}
        defaultValue={value ? value.toISOString().substring(0, 10) : undefined}
        onChange={(event) => {
          const target = event.currentTarget as HTMLInputElement;
          if (required) {
            setInvalid(!target.value);
          }
          const newEvent = {
            ...event,
            currentTarget: {
              ...target,
              name: target.name,
              type: target.type,
              value: formatDate(target.value, valueFormat),
            },
          };
          if (onChange) {
            onChange(newEvent);
          }
        }}
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

export function DateTimeField(
  props: LabeledGroupPropsWithOnChange,
): JSX.Element {
  const { name, defaultValue, onChange, required, ...groupProps } = props;
  const value = defaultValue ? new Date(defaultValue as string) : undefined;
  const dateTimeLocalValue = value
    ? new Date(value!.getTime() - value!.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, -1)
        .substring(0, 16)
    : "";
  return (
    <LabeledGroup {...groupProps}>
      <Form.Control
        name={name}
        type="datetime-local"
        required={required}
        defaultValue={dateTimeLocalValue}
        onChange={(event) => {
          const target = event.currentTarget as HTMLInputElement;
          const newEvent = {
            ...event,
            currentTarget: {
              ...target,
              name: target.name,
              type: target.type,
              value: new Date(target.value).toISOString(),
            },
          };
          if (onChange) {
            onChange(newEvent);
          }
        }}
      ></Form.Control>
    </LabeledGroup>
  );
}
export const exportedForTesting = {
  formatDate,
};
