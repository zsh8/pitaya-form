import React from "react";
import { render } from "@testing-library/react";

import NumberField from "./NumberField";

describe("NumberField", () => {
  test("renders the NumberField component", () => {
    render(
      <NumberField
        jsonKey="port"
        name="port"
        default={0}
        options={{}}
        events={{}}
        value={""}
        onChange={(v: any) => v}
        onBlur={(v: any) => v}
      />
    );
  });
});
