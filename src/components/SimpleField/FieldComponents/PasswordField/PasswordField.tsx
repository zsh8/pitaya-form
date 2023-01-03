import { Input } from "antd";
import React from "react";
import type { FieldProps } from "../..";
import "./PasswordField.css";

const PasswordField = (props: FieldProps) => {
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

  return <Input.Password value={value} {...events} />;
};

export default PasswordField;
