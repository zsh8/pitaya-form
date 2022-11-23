import React from "react";
import { render } from "@testing-library/react";

import BooleanField from "./BooleanField";

describe("BooleanField", () => {
  test("renders the BooleanField component", () => {
    render(
      <BooleanField
        jsonKey="verify_ssl"
        name="verify ssl"
        default={false}
        options={{}}
        events={{}}
        value={""}
        onChange={(v: any) => v}
        onBlur={(v: any) => v}
      />
    );
  });
});
