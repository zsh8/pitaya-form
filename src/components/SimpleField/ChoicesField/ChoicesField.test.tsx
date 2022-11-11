import React from "react";
import { render } from "@testing-library/react";

import ChoicesField from "./ChoicesField";

describe("ChoicesField", () => {
  test("renders the ChoicesField component", () => {
    render(
      <ChoicesField
        fieldKey="protocol"
        name="protocol"
        default={null}
        options={{}}
        events={{}}
      />
    );
  });
});
