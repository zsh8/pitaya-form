import { Checkbox } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import React from "react";
import { FieldProps } from "..";
import "./BooleanField.css";

const BooleanField = (props: FieldProps) => {
  let value = props.value;
  const handleChange = (e: CheckboxChangeEvent) => {
    props.onChange(e.target.checked);
  };

  return <Checkbox checked={value} onChange={handleChange} />;
};

export default BooleanField;
