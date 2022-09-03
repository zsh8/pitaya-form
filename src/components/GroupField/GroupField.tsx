import React from "react";
import "./GroupField.css";
import { RawGroupProps } from "../Form/Form";
export interface GroupProps extends RawGroupProps {
  field_key: string;
  children_map: any;
}

const GroupField = (props: GroupProps) => {
  let classNames = "group_field";
  if (!props.name) {
    classNames = classNames + " without_legend";
  }
  let children = [];
  for (const [key, child] of props.children_map) {
    if (key.startsWith("simple_")) {
      children.push(child);
    } else {
      children.push(<GroupField {...child}></GroupField>);
    }
  }
  return (
    <div className={classNames}>
      <fieldset
        aria-label={props.name || props.field_key}
        className={classNames}>
        {props.name && <legend>{props.name}</legend>}
        {children}
      </fieldset>
    </div>
  );
};

export default GroupField;
