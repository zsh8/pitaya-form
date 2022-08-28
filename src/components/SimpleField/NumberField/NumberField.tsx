import React from "react";
import { FieldProps } from "..";
import "./NumberField.css";

const NumberField = (props: FieldProps) => {
  interface Options {
    step?: number;
    min?: number;
    max?: number;
  }
  const options: Options = {};

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
      aria-label={props.name || props.field_key}
      {...options}
    />
  );
};

export default NumberField;
