import React, {
  ChangeEvent,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Form } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import {
  CollectionResourceDoc,
  ResourceObject,
} from "@vloryan/ts-jsonapi-form/jsonapi/model/";
import { MEDIA_TYPE } from "@vloryan/ts-jsonapi-form/jsonapi/";
import { LoadingSpinner } from "../";
import { LabeledGroup } from "./Label";
import { toQueryString } from "../../functions";
export type FilterType = { [key: string]: string | number | boolean };
interface ResourceObjectLookupFieldProps {
  name: string;
  url: string;
  filter?: FilterType;
  defaultValue?: ResourceObject | null;
  onSelectionChange?: (e: ResourceObject | null) => void;
}
export interface ResourceObjectLookupFieldType {
  selected: ResourceObject | null;
  reset: () => void;
}
export const ResourceObjectLookupField = React.forwardRef<
  ResourceObjectLookupFieldType,
  ResourceObjectLookupFieldProps
>((props, ref) => {
  const { name, url, filter, defaultValue, onSelectionChange, ...groupProps } =
    props;
  const [results, setResults] = useState<ResourceObject[]>([]);
  const [selected, setSelected] = useState<ResourceObject | null>(null);
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const fieldRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    selected: selected,
    reset: () => {
      if (fieldRef.current) {
        fieldRef.current.value = "";
        setSelected(null);
      }
    },
  }));

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nameValue = e.target.value;
    setResults([]);
    if (nameValue.length > 1) {
      setShowDropDown(true);
      setIsLoading(true);
      const f = filter || {};
      f.name = e.target.value;
      fetchResults(url, f)
        .then((doc) => {
          if (doc && doc.data) {
            setResults(doc.data);
            setError(null);
          } else {
            if (doc.errors) {
              setError({
                name: "ApiError",
                message: doc.errors
                  .map((e) => e.title + (e.detail ? ": " + e.detail : ""))
                  .join(", "),
              } satisfies Error);
            } else {
              setError({ name: "Unknown", message: "Error occurred" });
            }
          }
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          setError(err);
        });
    }
  };
  const onSelected = (selected: ResourceObject | null) => {
    setSelected(selected);
    fieldRef.current!.value = selected?.attributes?.name
      ? (selected?.attributes?.name as string)
      : "";
    setShowDropDown(false);
    setIsLoading(false);
    setResults([]);
    if (onSelectionChange) {
      onSelectionChange(selected);
    }
  };
  return (
    <LabeledGroup {...groupProps}>
      <Form.Control
        name={name}
        ref={fieldRef}
        type="text"
        isInvalid={error !== null}
        autoComplete="off"
        onChange={handleInputChange}
        defaultValue={
          defaultValue ? (defaultValue.attributes?.name as string) : ""
        }
        onKeyDown={(event) => {
          if (event.code === "ArrowDown") {
            if (menuRef.current) {
              const firstItem = menuRef.current
                .children[0] as HTMLAnchorElement;
              firstItem.focus();
            }
          }
        }}
      />
      {error && (
        <Form.Control.Feedback type="invalid">
          {error.message}
        </Form.Control.Feedback>
      )}
      <Dropdown
        show={!error && showDropDown}
        onToggle={(nextShow, meta) => {
          if (!nextShow && meta.source !== "select") {
            setShowDropDown(false);
            onSelected(null);
          }
        }}
      >
        <Dropdown.Menu ref={menuRef}>
          {isLoading ? (
            <Dropdown.Item>
              <LoadingSpinner />
            </Dropdown.Item>
          ) : (
            results &&
            results.length > 0 &&
            results.map((result: ResourceObject) => (
              <Dropdown.Item
                className="dropdown-item"
                key={result.id}
                onClick={() => {
                  onSelected(result);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    onSelected(result);
                  }
                }}
              >
                {result.attributes?.name as string}
              </Dropdown.Item>
            ))
          )}
        </Dropdown.Menu>
      </Dropdown>
    </LabeledGroup>
  );
});

async function fetchResults(
  url: string,
  filter: FilterType,
  limit: string = "10",
): Promise<CollectionResourceDoc> {
  const filterQuery = toQueryString(filter);
  return fetch(
    url + `?${filterQuery ? filterQuery + "&" : ""}page[limit]=${limit}`,
    {
      headers: {
        "Content-Type": MEDIA_TYPE,
      },
    },
  )
    .then((res) => res.json())
    .then((json) => {
      return json as CollectionResourceDoc;
    });
}
