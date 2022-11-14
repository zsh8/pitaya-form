import React from "react";
import { render } from "@testing-library/react";

import PasswordField from "./PasswordField";

describe("PasswordField", () => {
  test("renders the PasswordField component", () => {
    render(
      <PasswordField
        fieldKey="password"
        name="password"
        default={null}
        options={{}}
        events={{}}
      />
    );
  });
});
