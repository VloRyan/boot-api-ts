import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DateField, DateTimeField } from "./Date";
import { cleanup, render } from "@testing-library/react";

describe("DateField", () => {
  afterEach(cleanup);

  it("should render value from defaultValue", () => {
    const { getByTestId } = render(<DateField defaultValue="2025-08-11" />);

    const dateField = getByTestId("date-field") as HTMLInputElement;
    expect(dateField.value).toBe("2025-08-11");
  });

  it("should render empty value from invalid defaultValue", () => {
    const { getByTestId } = render(<DateField defaultValue="Hans Wurst" />);

    const dateField = getByTestId("date-field") as HTMLInputElement;
    expect(dateField.value).toBe("");
  });
});

describe("DateTimeField", () => {
  beforeEach(() => {
    vi.stubEnv("TZ", "Europe/Berlin"); // UTC+02:00
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllEnvs();
  });

  it("should render value as-is from defaultValue without timezone", () => {
    const { getByTestId } = render(
      <DateTimeField defaultValue="2025-08-11T02:00" />,
    );

    const dateField = getByTestId("datetime-field") as HTMLInputElement;
    expect(dateField.value).toBe("2025-08-11T02:00");
  });

  it("should render value as local time from defaultValue with timezone", () => {
    const { getByTestId } = render(
      <DateTimeField defaultValue="2025-08-11T02:00:00+03:00" />, // UTC = 2025-08-10T23:00
    );

    const dateField = getByTestId("datetime-field") as HTMLInputElement;
    expect(dateField.value).toBe("2025-08-11T01:00"); // UTC+02:00
  });

  it("should render empty value from invalid defaultValue", () => {
    const { getByTestId } = render(<DateTimeField defaultValue="Hans Wurst" />);

    const dateField = getByTestId("datetime-field") as HTMLInputElement;
    expect(dateField.value).toBe("");
  });
});
