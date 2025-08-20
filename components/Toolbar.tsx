import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Navbar,
  Row,
} from "react-bootstrap";
import { CreateButton, SaveButton, SearchBar } from "./";
import { ButtonProps } from "react-bootstrap/Button";
import { JSX, ReactElement, useRef, useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import {
  extractFilter,
  toParamFamily,
} from "@vloryan/ts-jsonapi-form/jsonapi/";
import { ObjectForm } from "@vloryan/ts-jsonapi-form/form/";
import { ObjectLike } from "@vloryan/ts-jsonapi-form/jsonapi/model/";
import { trimSuffix } from "../functions";

export interface ToolbarProps {
  createButton?: ButtonProps;
  saveButton?: ButtonProps;
  customElements?: ReactElement[];
  searchProperty?: string;
  searchBarContent?: (form: ObjectForm) => ReactElement;
}

export function Toolbar(props: ToolbarProps) {
  const searchString = useSearch();
  let filter = extractFilter(searchString);
  const [location, setLocation] = useLocation();
  const searchFieldRef = useRef<HTMLInputElement>(null);
  const [showSearchBar, setShowSearchBar] = useState(false);

  let createButton: JSX.Element | null = null;
  if (props.createButton != undefined) {
    createButton = (
      <Link to={location + "/new"}>
        <CreateButton {...props.createButton} />
      </Link>
    );
  }
  let saveButton: JSX.Element | null = null;
  if (props.saveButton != undefined) {
    saveButton = <SaveButton {...props.saveButton} />;
  }
  return (
    <Navbar
      expand="lg"
      className="border-bottom border-light-subtle rounded-bottom mb-2"
    >
      <Container fluid className="px-0">
        <Row className="w-100 mx-0">
          <Col xs="5" className="d-flex justify-content-start" />
          <Col xs="2" className="d-flex justify-content-center">
            {createButton}
            {saveButton}
            {props.customElements}
          </Col>
          <Col xs="5" className="d-flex justify-content-end">
            {props.searchProperty !== undefined ? (
              <InputGroup>
                <Form.Control
                  ref={searchFieldRef}
                  placeholder="Search..."
                  aria-label="Search"
                  aria-describedby="button-search"
                  defaultValue={
                    filter
                      ? (filter[props.searchProperty] as string)
                      : undefined
                  }
                  onKeyDown={(e) => {
                    if (e.code !== "Enter") {
                      return;
                    }
                    if (!filter) {
                      filter = {};
                    }
                    if (e.currentTarget.value) {
                      filter[props.searchProperty!] = e.currentTarget.value;
                    } else {
                      delete filter[props.searchProperty!];
                    }
                    setLocation(
                      location + updateSearchString(searchString, filter),
                    );
                  }}
                />
                <Button
                  variant={filter ? "primary" : "outline-primary"}
                  id="button-search"
                  onClick={() => {
                    if (!filter) {
                      filter = {};
                    }
                    if (searchFieldRef.current?.value) {
                      filter[props.searchProperty!] =
                        searchFieldRef.current?.value ?? "";
                    } else {
                      delete filter[props.searchProperty!];
                    }
                    setLocation(
                      location + updateSearchString(searchString, filter),
                    );
                  }}
                >
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </Button>
              </InputGroup>
            ) : props.searchBarContent ? (
              <Button
                variant={filter ? "primary" : "outline-primary"}
                id="button-search"
                onClick={() => setShowSearchBar(true)}
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </Button>
            ) : null}
          </Col>
        </Row>
      </Container>
      {props.searchBarContent ? (
        <SearchBar
          show={showSearchBar}
          setShow={setShowSearchBar}
          content={props.searchBarContent}
        />
      ) : null}
    </Navbar>
  );
}

function updateSearchString(currentSearch: string, filter: ObjectLike) {
  const search = trimSuffix(currentSearch, "&")
    .split("&")
    .filter((value) => !value.startsWith("filter["))
    .join("&");
  if (Object.keys(filter).length === 0) {
    return (search ? "?" : "") + search;
  }
  return (search ? "?" + search + "&" : "?") + toParamFamily("filter", filter);
}
