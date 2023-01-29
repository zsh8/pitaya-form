import React from "react";
import { render } from "@testing-library/react";

import DurationField from "./DurationField";

describe("DurationField", () => {
  test("renders the DurationField component", () => {
    render(
      <DurationField
        fieldType="Duration"
        jsonKey="duration"
        name="duration"
        default={0}
        options={{}}
        events={{}}
        value={0}
        onChange={(v: any) => v}
        onBlur={(v: any) => v}
      />
    );
  });
});
