import React from "react";
import { render } from "@testing-library/react";

import TextField from "./TextField";

describe("TextField", () => {
  test("renders the TextField component", () => {
    render(
      <TextField
        fieldType="String"
        jsonKey="verify_ssl"
        name="verify ssl"
        default=""
        options={{}}
        events={{}}
        value={""}
        onChange={(v: any) => v}
        onBlur={(v: any) => v}
      />
    );
  });
});
