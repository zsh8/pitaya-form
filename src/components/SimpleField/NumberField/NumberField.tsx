import React from "react";
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
  let defaultValue = 0;
  if (options.min && options.min > 0) defaultValue = options.min;
  if (defaultValue == 0 && options.max && options.max < 0)
    defaultValue = options.max;

  return (
    <input
      type="number"
      defaultValue={props.default || defaultValue}
      {...options}
      {...props.elementAttrs}
    />
  );
};

export default NumberField;
