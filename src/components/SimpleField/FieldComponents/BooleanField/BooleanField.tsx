import { Checkbox } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import React from "react";
import type { FieldProps } from "../..";
import "./BooleanField.css";

const BooleanField = (props: FieldProps) => {
  let value = props.value;
  const handleChange = (e: CheckboxChangeEvent) => {
    props.onChange(e.target.checked);
    props.onBlur(e.target.checked);
  };

  const {
    onChange: onChangeEvent,
    ...events
  }: { [key: string]: (...args: any[]) => void } = {
    ...props.events,
  };

  events["onChange"] = (e: CheckboxChangeEvent) => {
    handleChange(e);
    onChangeEvent?.();
  };

  return <Checkbox checked={value} {...events} />;
};

export default BooleanField;
