import React from "react";
import { render } from "@testing-library/react";

import Form from "./Form";

describe("Form", () => {
  test("renders the Form component", () => {
    render(
      <Form
        version="1"
        form={{
          device_name: {
            name: "Device Name",
            type: "String",
            order: 0,
          },
          temperature: {
            name: "Temperature",
            type: "Number",
            options: {
              float: true,
              signed: true,
            },
            order: 1,
          },
        }}
      />
    );
  });
});
