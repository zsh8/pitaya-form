import React from "react";
import { render } from "@testing-library/react";

import TextField from "./TextField";

describe("TextField", () => {
  test("renders the TextField component", () => {
    render(
      <TextField
        fieldKey="verify_ssl"
        name="verify ssl"
        default=""
        options={{}}
        events={{}}
      />
    );
  });
});
