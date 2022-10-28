import React from "react";
import { render } from "@testing-library/react";

import BooleanField from "./BooleanField";

describe("BooleanField", () => {
  test("renders the BooleanField component", () => {
    render(
      <BooleanField
        fieldKey="verify_ssl"
        name="verify ssl"
        description="verifies ssl"
        long_description="check to verify ssl"
        default={false}
        options={{}}
        events={{}}
      />
    );
  });
});
