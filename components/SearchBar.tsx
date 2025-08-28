import { Button, Col, Container, Offcanvas, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useSearch } from "wouter";
import { PropsWithChildren, ReactElement } from "react";
import { SingleObjectForm } from "@vloryan/ts-jsonapi-form/form/";
import { extractFilter } from "@vloryan/ts-jsonapi-form/jsonapi/";
import {
  ObjectLike,
  isResourceObject,
} from "@vloryan/ts-jsonapi-form/jsonapi/model";
import { ResourceIdentifierObject } from "@vloryan/ts-jsonapi-form/jsonapi/model/";
export type SearchBarProps = PropsWithChildren<{
  show: boolean;
  setShow: (show: boolean) => void;
  content: (form: SingleObjectForm<ObjectLike>) => ReactElement;
  filter?: ObjectLike;
  onBeforeSearch?: (form: SingleObjectForm<ObjectLike>) => void;
}>;

export const SearchBar = ({
  show,
  setShow,
  content,
  filter,
  onBeforeSearch,
}: SearchBarProps) => {
  const [location, setLocation] = useLocation();
  const searchString = useSearch();
  if (!filter) {
    filter = extractFilter(searchString);
  }
  const searchForm = new SingleObjectForm({
    name: "FilterForm",
    object: filter ?? {},
    id: "FilterForm",
  });
  return (
    <Offcanvas show={show} onHide={() => setShow(false)} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Search</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Container fluid className="px-1">
          <Row>
            <Col className="d-flex justify-content-center">
              <Container fluid className="px-0">
                {content(searchForm)}
              </Container>
            </Col>
          </Row>
          <Row className="pt-2">
            <Col className="d-flex justify-content-center">
              <Button
                variant="outline-primary"
                id="perform-search"
                onClick={() => {
                  if (onBeforeSearch) {
                    onBeforeSearch(searchForm);
                  }
                  setLocation(
                    location + toQueryString(searchForm.object as ObjectLike),
                  );
                  setShow(false);
                }}
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </Button>
            </Col>
          </Row>
        </Container>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

function toQueryString(f: ObjectLike): string {
  const params = toFilterParams(f, "");
  return params.length > 0 ? "?" + params.join("&") : "";
}

function toFilterParams(f: ObjectLike, prefix: string): string[] {
  let params: string[] = [];
  for (const k in f) {
    let value = f[k];
    const paramName = prefix ? prefix + "." + k : k;
    if (value === undefined || value === null) {
      continue;
    }
    if (!isPrimitive(value)) {
      if (isResourceObject(value as ObjectLike)) {
        value = (f[k] as unknown as ResourceIdentifierObject).id;
      } else {
        if (Array.isArray(value)) {
          const encValues = value.map((v) => encodeURIComponent(v as string));
          params.push(asFilterParam(paramName, encValues.join(",")));
        } else {
          params.push(...toFilterParams(value as ObjectLike, k));
        }
        continue;
      }
    }
    params.push(asFilterParam(paramName, encodeURIComponent(value as string)));
  }
  return params;
}

function asFilterParam(k: string, v: string) {
  return `filter[${k}]=${v}`;
}

function isPrimitive(v: any) {
  const t = typeof v;
  return t === "string" || t === "number" || t === "boolean";
}

export const testables = {
  toQueryString,
};
