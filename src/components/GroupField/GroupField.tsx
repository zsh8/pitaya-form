import React from "react";
import "./GroupField.css";
import { GroupProps } from "../Form/Form";

const GroupField = (props: GroupProps) => {
  let classNames = "group_field";
  if (!props.name) {
    classNames = classNames + " without_legend";
  }
  return (
    <div className={classNames}>
      <fieldset
        aria-label={props.name || props.field_key}
        className={classNames}>
        {props.name && <legend>{props.name}</legend>}
        {props.children}
      </fieldset>
    </div>
  );
};

export default GroupField;
