import React from "react";
import { render } from "@testing-library/react";

import SubmitField from "./SubmitField";

describe("SubmitField", () => {
  test("renders the SubmitField component", () => {
    render(
      <SubmitField
        jsonKey="options"
        name="add options"
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
