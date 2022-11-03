import React from "react";
import { InputNumber } from "antd";
import { FieldProps } from "..";
import "./NumberField.css";

const NumberField = (props: FieldProps) => {
  const options: {
    step?: number;
    min?: number;
  } = {};

  if (props.options.float) {
    options.step = 0.001;
  }
  if (!props.options.signed) {
    options.min = 0;
  }

  let value = props.value;

  return (
    <InputNumber
      value={value}
      onChange={props.onChange}
      onBlur={props.onBlur}
      {...options}
    />
  );
};

export default NumberField;
