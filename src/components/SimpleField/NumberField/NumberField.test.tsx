import React from "react";
import { render } from "@testing-library/react";

import NumberField from "./NumberField";

describe("NumberField", () => {
  test("renders the NumberField component", () => {
    render(
      <NumberField
        field_key="port"
        name="port"
        description="port of source"
        long_description="enter port of source"
        default={0}
        options={{}}
        events={{}}
      />
    );
  });
});
