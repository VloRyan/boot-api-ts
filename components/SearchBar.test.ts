import { describe, expect, it } from "vitest";
import { testables } from "./SearchBar.tsx";
import { ObjectLike } from "@vloryan/ts-jsonapi-form/jsonapi/model/Types";
import { ResourceObject } from "@vloryan/ts-jsonapi-form/jsonapi/model/";

describe("toQueryString", () => {
  it("plan object", () => {
    const obj = {
      name: "John Doe",
      age: 20,
      living: false,
    } satisfies ObjectLike;

    expect(testables.toQueryString(obj as unknown as ObjectLike)).toBe(
      "?filter[name]=John%20Doe&filter[age]=20&filter[living]=false",
    );
  });

  it("with ResourceObject", () => {
    const obj = {
      obj: { id: "1", type: "object" } satisfies ResourceObject,
    } satisfies ObjectLike;

    expect(testables.toQueryString(obj as unknown as ObjectLike)).toBe(
      "?filter[obj]=1",
    );
  });

  it("with nested obj", () => {
    const obj = {
      nested: { name: "Peter" },
    } satisfies ObjectLike;

    expect(testables.toQueryString(obj as unknown as ObjectLike)).toBe(
      "?filter[nested.name]=Peter",
    );
  });

  it("with array", () => {
    const obj = {
      arr: ["one", "two", "three"],
    } satisfies ObjectLike;

    expect(testables.toQueryString(obj as unknown as ObjectLike)).toBe(
      "?filter[arr]=one,two,three",
    );
  });
});
