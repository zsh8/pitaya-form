import React from "react";
import { render } from "@testing-library/react";

import ChoicesField from "./ChoicesField";

describe("ChoicesField", () => {
  test("renders the ChoicesField component", () => {
    render(
      <ChoicesField
        jsonKey="protocol"
        name="protocol"
        default={null}
        options={{}}
        events={{}}
        value={""}
        onChange={(v: any) => v}
        onBlur={(v: any) => v}
      />
    );
  });
});
