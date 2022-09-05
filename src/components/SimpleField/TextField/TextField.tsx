import React, { Fragment } from "react";
import { FieldProps } from "..";
import "./TextField.css";

const TextField = (props: FieldProps) => {
  return (
    <input
      type="text"
      defaultValue={props.default || ""}
      {...props.elementAttrs}
    />
  );
};

export default TextField;
