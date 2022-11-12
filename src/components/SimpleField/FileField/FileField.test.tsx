import React from "react";
import { render } from "@testing-library/react";

import FileField from "./FileField";

describe("FileField", () => {
  test("renders the FileField component", () => {
    render(
      <FileField
        fieldKey="file_field"
        name="attach"
        default={null}
        options={{}}
        events={{}}
      />
    );
  });
});
