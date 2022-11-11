import React from "react";
import { render } from "@testing-library/react";

import DateTimeField from "./DateTimeField";

describe("DateTimeField", () => {
  test("renders the DateTimeField component", () => {
    render(
      <DateTimeField
        fieldKey="birthday"
        name="birthday"
        default={false}
        options={{}}
        events={{}}
      />
    );
  });
});
