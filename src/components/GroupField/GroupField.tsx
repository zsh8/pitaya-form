import React from "react";
import { useState } from "react";
import { v4 } from "uuid";
import "./GroupField.css";
import { RawGroupProps } from "../Form/Form";
import SimpleField from "../SimpleField";

export interface GroupProps extends RawGroupProps {
  field_key: string;
  children_map: any;
}

const GroupField = (props: GroupProps) => {
  let classNames = "group_field";
  if (!props.name && !props.description) {
    classNames = classNames + " without_border";
  }

  let elementAttrs: any = {
    "aria-label": props.name?.toString() || props.field_key,
  };

  let { array, default: rawDefault } = props;

  let groupDefault: object[] = Array.isArray(rawDefault) ? rawDefault : [];

  const [value, setValue] = useState(groupDefault);

  function makeChildren(defaultValue: any) {
    let children = [];
    for (const [key, fieldProps] of props.children_map) {
      if (fieldProps.field_key in defaultValue) {
        fieldProps.default = defaultValue[fieldProps.field_key];
      }
      if (key.startsWith("simple_")) {
        children.push(
          <SimpleField key={fieldProps.field_key} {...fieldProps} />
        );
      } else {
        children.push(
          <GroupField key={fieldProps.field_key} {...fieldProps}></GroupField>
        );
      }
    }
    return children;
  }
  function handleClone() {
    const newValue = [...value, {}];
    setValue(newValue);
  }

  function handleRemove(index: number) {
    let newValue = [...value];
    newValue.splice(index, 1);
    setValue(newValue);
  }

  return (
    <div className={classNames}>
      {array ? (
        <div className="array_simple_field">
          {value.map((defaultValue: any, index: number) => (
            <div key={v4()}>
              <fieldset {...elementAttrs}>
                {(props.name || props.description) && (
                  <legend>
                    {props.name}
                    {props.description && (
                      <span
                        className="question_icon"
                        title={props.description}></span>
                    )}
                  </legend>
                )}
                {makeChildren(defaultValue)}
              </fieldset>
              <span
                className="remove_icon"
                onClick={() => handleRemove(index)}
                title={`remove this item of ${
                  props.name || props.field_key
                }`}></span>
            </div>
          ))}
        </div>
      ) : (
        <fieldset {...elementAttrs}>
          {(props.name || props.description) && (
            <legend>
              {props.name}
              {props.description && (
                <span
                  className="question_icon"
                  title={props.description}></span>
              )}
            </legend>
          )}
          {makeChildren({})}
        </fieldset>
      )}
      {array && <span className="clone_icon" onClick={handleClone}></span>}
    </div>
  );
};

export default GroupField;
