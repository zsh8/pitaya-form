import React from "react";
import { render } from "@testing-library/react";

import DurationField from "./DurationField";

describe("DurationField", () => {
  test("renders the DurationField component", () => {
    render(
      <DurationField
        fieldKey="duration"
        name="duration"
        default={0}
        options={{}}
        events={{}}
      />
    );
  });
});
