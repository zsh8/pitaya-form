import React from "react";
import { InputNumber } from "antd";
import type { FieldProps } from "../..";
import "./NumberField.css";

const NumberField = (props: FieldProps) => {
  const options: {
    step?: number;
    min?: number;
    max?: number;
  } = {};

  if (props.fieldType === "Port") {
    options.min = 0;
    options.max = 65535;
    options.step = 1;
  } else {
    if (props.options.float) {
      options.step = 0.001;
    }
    if (!props.options.signed) {
      options.min = 0;
    }
  }

  let value = props.value;

  const {
    onChange: onChangeEvent,
    onBlur: onBlurEvent,
    ...events
  }: { [key: string]: (...args: any[]) => void } = {
    ...props.events,
  };

  events["onChange"] = (value: any) => {
    props.onChange(value);
    onChangeEvent?.();
  };

  events["onBlur"] = (value: any) => {
    props.onBlur(value);
    onBlurEvent?.();
  };

  return <InputNumber value={value} {...events} {...options} />;
};

export default NumberField;
