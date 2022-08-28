import React from "react";
import { render } from "@testing-library/react";

import SimpleField from "./SimpleField";

describe("SimpleField", () => {
  test("renders the SimpleField component", () => {
    render(
      <SimpleField field_key="verify_ssl" name="verify ssl" type="Boolean" />
    );
  });
});