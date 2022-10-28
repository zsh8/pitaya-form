import { Input } from "antd";
import React from "react";
import { FieldProps } from "..";
import "./TextField.css";

const TextField = (props: FieldProps) => {
  let value = props.value;

  return <Input type="text" value={value} onChange={props.onChange} />;
};

export default TextField;
