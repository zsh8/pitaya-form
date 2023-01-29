import React from "react";
import { render } from "@testing-library/react";

import PasswordField from "./PasswordField";

describe("PasswordField", () => {
  test("renders the PasswordField component", () => {
    render(
      <PasswordField
        fieldType="Password"
        jsonKey="password"
        name="password"
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
