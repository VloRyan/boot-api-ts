import { ObjectForm } from "@vloryan/ts-jsonapi-form/form/";
import React, { ChangeEvent, JSX, useEffect, useState } from "react";
import {
  CheckboxField,
  CheckboxProps,
  DateField,
  DateTimeField,
  FilterType,
  LabeledGroup,
  LabeledGroupProps,
  LabeledGroupPropsWithOnChange,
  NumberField,
  ResourceObjectLookupField,
  SelectField,
  TextAreaField,
  TextAreaProps,
  TextField,
} from "./";
import {
  ResourceIdentifierObject,
  ResourceObject,
  SingleResourceDoc,
} from "@vloryan/ts-jsonapi-form/jsonapi/model/";
import { fetchResource } from "@vloryan/ts-jsonapi-form/jsonapi/";
import { LoadingSpinner } from "../";
import { ObjectLike } from "@vloryan/ts-jsonapi-form/jsonapi/model/Types";
import { ColProps } from "react-bootstrap/Col";
import { isResourceObject } from "@vloryan/ts-jsonapi-form/jsonapi/model";

export type FormControlElement =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;

export interface FieldColProps extends ColProps {
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  required?: boolean;
}
export interface SelectFieldColProps extends FieldColProps {
  options: Map<string, string | null>;
  onChange?: (e: ChangeEvent<FormControlElement>) => void;
}
export interface LookupFieldColProps extends FieldColProps {
  url: string;
  filter?: FilterType;
  onSelectionChange?: (e: ResourceObject | null) => void;
}
export interface NumberFieldColProps extends FieldColProps {
  step?: number | string | undefined;
}
export interface FieldFactory {
  Text(props: FieldColProps): JSX.Element;
  TextArea(props: FieldColProps): JSX.Element;
  Number(props: NumberFieldColProps): JSX.Element;
  Date(props: LabeledGroupPropsWithOnChange): JSX.Element;
  DateTime(props: FieldColProps): JSX.Element;
  Select(props: SelectFieldColProps): JSX.Element;
  CheckBox(props: FieldColProps): JSX.Element;
  Lookup(props: LookupFieldColProps): JSX.Element;
  Label(props: LabeledGroupProps): JSX.Element;
}

export class BootstrapFieldFactory implements FieldFactory {
  private form: ObjectForm;
  constructor(form: ObjectForm) {
    this.form = form;
  }
  Text = (props: FieldColProps): JSX.Element => {
    return <TextField {...props} {...this.setupField(props.name)} />;
  };

  TextArea = (props: TextAreaProps): JSX.Element => {
    return <TextAreaField {...props} {...this.setupField(props.name)} />;
  };

  CheckBox = (props: FieldColProps): JSX.Element => {
    let value = this.form.getValue(props.name);
    const typesToCheck = ["string", "number", "boolean"];
    if (!typesToCheck.includes(typeof value)) {
      value = "";
    }
    const setting = {
      name: props.name,
      onChange: this.form.handleChange,
      defaultChecked: value as boolean,
    } satisfies CheckboxProps;
    return <CheckboxField {...props} {...setting} />;
  };

  Date = (props: LabeledGroupPropsWithOnChange): JSX.Element => {
    return <DateField {...props} {...this.setupField(props.name)} />;
  };

  DateTime = (props: FieldColProps): JSX.Element => {
    return <DateTimeField {...props} {...this.setupField(props.name)} />;
  };

  Number = (props: NumberFieldColProps): JSX.Element => {
    return <NumberField {...props} {...this.setupField(props.name)} />;
  };

  Select = (props: SelectFieldColProps): JSX.Element => {
    const fieldProps = this.setupField(props.name);
    if (props.onChange) {
      const origOnChange = props.onChange;
      props = {
        ...props,
        name: fieldProps.name,
        onChange: (e) => {
          fieldProps.onChange(e);
          origOnChange(e);
        },
      } satisfies SelectFieldColProps;
    } else {
      props = {
        ...props,
        ...fieldProps,
      } satisfies SelectFieldColProps;
    }
    return <SelectField {...props} defaultValue={fieldProps.defaultValue} />;
  };

  Lookup = (props: LookupFieldColProps) => {
    const value = this.form.getValue(props.name);
    const id: string | undefined =
      value && (typeof value == "string" || typeof value == "number")
        ? value
        : value && isResourceObject(value)
          ? value.id
          : undefined;
    const [obj, setObj] = useState<ResourceObject | null>(null);
    useEffect(() => {
      if (!id) {
        return;
      }
      fetchObject().then((fetched) => setObj(fetched ?? null));
    }, [id]);
    const fetchObject = async () => {
      try {
        if (!id) {
          return undefined;
        }
        const doc = (await fetchResource(
          props.url + "/" + id,
        )) as SingleResourceDoc;
        return doc.data;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const { name, url, filter, onSelectionChange, ...groupProps } = props;
    return (
      <LabeledGroup {...groupProps}>
        {id && !obj ? (
          <LoadingSpinner />
        ) : (
          <ResourceObjectLookupField
            name={name}
            url={url}
            filter={filter}
            defaultValue={obj}
            onSelectionChange={(selected) => {
              setObj(() => {
                const newValue: ResourceIdentifierObject | null = selected
                  ? ({
                      id: selected.id,
                      type: selected.type,
                    } satisfies ResourceIdentifierObject)
                  : null;

                this.form.setValue(
                  props.name,
                  newValue as unknown as ObjectLike,
                );
                if (onSelectionChange) {
                  onSelectionChange(selected);
                }
                return selected;
              });
            }}
          />
        )}
      </LabeledGroup>
    );
  };
  Label = (props: LabeledGroupProps) => {
    return <LabeledGroup {...props} />;
  };

  setupField(name: string): {
    name: string;
    onChange: React.ChangeEventHandler<FormControlElement>;
    defaultValue: string | number | readonly string[] | undefined;
  } {
    let value = this.form.getValue(name);
    const typesToCheck = ["string", "number", "boolean"];
    if (!typesToCheck.includes(typeof value)) {
      value = "";
    }
    return {
      name: name,
      onChange: this.form.handleChange,
      defaultValue: value,
    };
  }
}
