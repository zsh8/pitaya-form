import React from "react";
import { render } from "@testing-library/react";

import BooleanField from "./BooleanField";

describe("BooleanField", () => {
  test("renders the BooleanField component", () => {
    render(
      <BooleanField
        fieldKey="verify_ssl"
        name="verify ssl"
        default={false}
        options={{}}
        events={{}}
      />
    );
  });
});
