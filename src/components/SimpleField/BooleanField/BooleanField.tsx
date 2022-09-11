import React, { useState } from "react";
import { FieldProps } from "..";
import "./BooleanField.css";

const BooleanField = (props: FieldProps) => {
  const [checked, setChecked] = useState(props.value || false);
  function handleChange() {
    setChecked(!checked);
  }

  return (
    <input
      type="checkbox"
      value={props.field_key}
      checked={checked}
      {...props.elementAttrs}
      onChange={handleChange}
    />
  );
};

export default BooleanField;
