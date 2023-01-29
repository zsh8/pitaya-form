import React from "react";
import { render } from "@testing-library/react";

import FileField from "./FileField";

describe("FileField", () => {
  test("renders the FileField component", () => {
    render(
      <FileField
        fieldType="File"
        jsonKey="file_field"
        name="attach"
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
