import React from "react";
import { render } from "@testing-library/react";

import DateTimeField from "./DateTimeField";

describe("DateTimeField", () => {
  test("renders the DateTimeField component", () => {
    render(
      <DateTimeField
        fieldType="DateTime"
        jsonKey="birthday"
        name="birthday"
        default={false}
        options={{}}
        events={{}}
        value={""}
        onChange={(v: any) => v}
        onBlur={(v: any) => v}
      />
    );
  });
});
