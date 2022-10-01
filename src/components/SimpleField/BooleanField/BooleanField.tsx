import React from "react";
import { FieldProps } from "..";
import "./BooleanField.css";

const BooleanField = (props: FieldProps) => {
  const initialChecked = props.value || false;

  return (
    <input
      type="checkbox"
      value={props.field_key}
      defaultChecked={initialChecked}
      {...props.elementAttrs}
    />
  );
};

export default BooleanField;
