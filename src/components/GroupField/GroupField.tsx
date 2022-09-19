import React from "react";
import { useState } from "react";
import { v4 } from "uuid";
import "./GroupField.css";
import { RawGroupProps } from "../Form";
import SimpleField from "../SimpleField";

export interface GroupProps extends RawGroupProps {
  field_key: string;
  children_map: any;
}

const GroupField = (props: GroupProps) => {
  let elementAttrs: any = {
    "aria-label": props.name?.toString() || props.field_key,
  };

  let { array, default: rawDefault, value: initialValue } = props;

  let groupDefault: object[] = Array.isArray(rawDefault) ? rawDefault : [];

  if (initialValue === undefined) {
    initialValue = groupDefault;
  }

  const [value, setValue] = useState(initialValue);

  function makeChildren(initialValue: any) {
    let children = [];
    for (const [key, fieldProps] of props.children_map) {
      let childProps = { ...fieldProps };
      let childIsSimple = key.startsWith("simple_");

      if (!childIsSimple && childProps.target_group === null)
        childProps.value = { ...initialValue };
      else {
        let dataModelKey = childProps.target_group || childProps.field_key;
        if (dataModelKey in initialValue) {
          childProps.value = initialValue[dataModelKey];
        }
      }

      if (childIsSimple) {
        children.push(
          <SimpleField key={childProps.field_key} {...childProps} />
        );
      } else {
        children.push(
          <GroupField key={childProps.field_key} {...childProps}></GroupField>
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
  if (!array && !props.name && !props.description) {
    elementAttrs.className = "without_border";
  }
  return (
    <div className="group_field">
      {array ? (
        <div className="array_field">
          {value.map((singleValue: any, index: number) => (
            <div key={v4()} className="removable">
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
                {makeChildren(singleValue)}
              </fieldset>
              <span
                className="remove_icon"
                onClick={() => handleRemove(index)}
                title={`remove this item of ${
                  props.name || props.field_key
                }`}></span>
            </div>
          ))}
          <span className="clone_icon" onClick={handleClone}></span>
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
          {makeChildren(value)}
        </fieldset>
      )}
    </div>
  );
};

export default GroupField;
