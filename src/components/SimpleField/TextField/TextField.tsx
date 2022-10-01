import React from "react";
import { FieldProps } from "..";
import "./TextField.css";

const TextField = (props: FieldProps) => {
  const initialValue = props.value || "";

  return (
    <input type="text" defaultValue={initialValue} {...props.elementAttrs} />
  );
};

export default TextField;
