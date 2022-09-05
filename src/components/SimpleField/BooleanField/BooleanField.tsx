import React from "react";
import { FieldProps } from "..";
import "./BooleanField.css";

const BooleanField = (props: FieldProps) => {
  return (
    <input
      type="checkbox"
      value={props.field_key}
      defaultChecked={props.default || false}
      {...props.elementAttrs}
    />
  );
};

export default BooleanField;
