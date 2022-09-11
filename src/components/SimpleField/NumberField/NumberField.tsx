import React, { useState, ChangeEvent } from "react";
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

  let initialValue = props.value;
  if (typeof initialValue != "number") {
    initialValue = 0;
    if (options.min && options.min > 0) initialValue = options.min;
    if (initialValue == 0 && options.max && options.max < 0)
      initialValue = options.max;
  }
  const [value, setValue] = useState(initialValue);
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  return (
    <input
      type="number"
      value={value}
      {...options}
      {...props.elementAttrs}
      onChange={handleChange}
    />
  );
};

export default NumberField;
