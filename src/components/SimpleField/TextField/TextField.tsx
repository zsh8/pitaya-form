import React, { Fragment } from "react";
import { FieldProps } from "..";
import "./TextField.css";

const TextField = (props: FieldProps) => {
  return (
    <input
      type="text"
      defaultValue={props.default || ""}
      aria-label={props.name || props.field_key}
    />
  );
};

export default TextField;
