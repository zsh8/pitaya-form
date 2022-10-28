import React from "react";
import { InputNumber } from "antd";
import { FieldProps } from "..";
import "./NumberField.css";

const NumberField = (props: FieldProps) => {
  const options: {
    step?: number;
    min?: number;
    max?: number;
    title?: string;
  } = {};

  if (props.options.float) {
    options.step = 0.001;
  }
  if (!props.options.signed) {
    options.min = 0;
  }

  let value = props.value;
  if (value == 0) {
    if (options.min && options.min > 0) value = options.min;
    if (value == 0 && options.max && options.max < 0) value = options.max;
  }

  return <InputNumber value={value} onChange={props.onChange} {...options} />;
};

export default NumberField;
