import React, { useState, ChangeEvent } from "react";
import { FieldProps } from "..";
import "./TextField.css";

const TextField = (props: FieldProps) => {
  const [value, setValue] = useState(props.value || "");
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  return (
    <input
      type="text"
      value={value}
      {...props.elementAttrs}
      onChange={handleChange}
    />
  );
};

export default TextField;
