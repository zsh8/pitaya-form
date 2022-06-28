import React from "react";
import { render } from "@testing-library/react";

import Form from "./Form";

describe("Form", () => {
    test("renders the Form component", () => {
        render(<Form version="1" form={{}} />);
    });
});