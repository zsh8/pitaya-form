import { Button } from "antd";
import React from "react";
import type { FieldProps } from "../..";
import "./SubmitField.css";

const SubmitField = (props: FieldProps) => {
  let name = props.name;

  return (
    <Button type="primary" {...props.events}>
      {name}
    </Button>
  );
};

export default SubmitField;
