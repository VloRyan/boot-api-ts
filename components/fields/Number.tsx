import { Form } from "react-bootstrap";
import { LabeledGroup, LabeledGroupPropsWithOnChange } from "./";

interface NumberFieldProps extends LabeledGroupPropsWithOnChange {
  step?: number | string | undefined;
  placeholder?: string;
}

export function NumberField(props: NumberFieldProps) {
  const { name, defaultValue, onChange, step, placeholder, ...groupProps } =
    props;
  return (
    <LabeledGroup {...groupProps}>
      <Form.Control
        type="number"
        name={name}
        defaultValue={defaultValue}
        onChange={onChange}
        onKeyDown={numberInputKeyDown}
        step={step}
        placeholder={placeholder}
      ></Form.Control>
    </LabeledGroup>
  );
}

const numberInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
  const eventCode = event.code.toLowerCase();
  const target = event.currentTarget as HTMLInputElement;
  if (
    !(
      event.code !== null &&
      (eventCode.includes("digit") ||
        eventCode.includes("arrow") ||
        eventCode.includes("home") ||
        eventCode.includes("end") ||
        eventCode.includes("backspace") ||
        (eventCode.includes("numpadsubtract") && !target.value.includes("-")) ||
        (eventCode.includes("period") && !target.value.includes(".")) ||
        (eventCode.includes("numpad") && eventCode.length === 7))
    )
  ) {
    event.preventDefault();
  }
};
