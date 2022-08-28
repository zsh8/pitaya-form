import React from "react";
import { FieldProps } from "..";
import "./BooleanField.css";

const BooleanField = (props: FieldProps) => {
  return (
    <input
      type="checkbox"
      value={props.field_key}
      defaultChecked={props.default || false}
      aria-label={props.name || props.field_key}
    />
  );
};

export default BooleanField;
