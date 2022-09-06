import React from "react";
import "./GroupField.css";
import { RawGroupProps } from "../Form/Form";

export interface GroupProps extends RawGroupProps {
  field_key: string;
  children_map: any;
}

const GroupField = (props: GroupProps) => {
  let classNames = "group_field";
  if (!props.name && !props.description) {
    classNames = classNames + " without_border";
  }
  let children = [];
  for (const [key, child] of props.children_map) {
    if (key.startsWith("simple_")) {
      children.push(child);
    } else {
      children.push(<GroupField key={child.field_key} {...child}></GroupField>);
    }
  }

  let elementAttrs: any = {
    "aria-label": props.name?.toString() || props.field_key,
  };

  return (
    <div className={classNames}>
      <fieldset className={classNames} {...elementAttrs}>
        {(props.name || props.description) && (
          <legend>
            {props.name}
            {props.description && (
              <span className="question_icon" title={props.description}></span>
            )}
          </legend>
        )}
        {children}
      </fieldset>
    </div>
  );
};

export default GroupField;
