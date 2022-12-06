import { Input } from "antd";
import React from "react";
import type { FieldProps } from "../..";
import "./PasswordField.css";

const PasswordField = (props: FieldProps) => {
  let value = props.value;

  return (
    <Input.Password
      value={value}
      onChange={props.onChange}
      onBlur={props.onBlur}
    />
  );
};

export default PasswordField;
