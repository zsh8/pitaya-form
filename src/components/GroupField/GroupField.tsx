import React, { useReducer } from "react";
import { useState } from "react";
import { v4 } from "uuid";
import "./GroupField.css";
import { RawGroupProps } from "../Form";
import SimpleField from "../SimpleField";

export interface GroupProps extends RawGroupProps {
  field_key: string;
  children_map: any;
  value?: any;
}

const GroupField = (props: GroupProps) => {
  let elementAttrs: any = {
    "aria-label": props.name?.toString() || props.field_key,
  };

  let { array, default: rawDefault, value: initialValue, order } = props;

  let groupDefault: object[] = Array.isArray(rawDefault) ? rawDefault : [];

  if (initialValue === undefined) {
    initialValue = groupDefault;
  }
  interface ChangeAction {
    type: "clone" | "remove" | "update";
    index?: number;
    updates?: any;
  }
  let [value, setValue] = useReducer((value: any, action: ChangeAction) => {
    let newValue;
    switch (action.type) {
      case "clone":
        newValue = [...value, {}];
        break;
      case "remove":
        newValue = [...value];
        newValue.splice(action.index, 1);
        break;
      case "update":
        if (action.index !== undefined) {
          newValue = [...value];
          newValue.splice(action.index, 1, {
            ...value[action.index],
            ...action.updates,
          });
        } else
          newValue =
            props.target_group === null
              ? { ...action.updates }
              : { ...value, ...action.updates };
        break;
      default:
        newValue = value;
    }
    let dataModel = {};
    if (props.target_group === null) dataModel = { ...newValue };
    else dataModel = { [props.target_group || props.field_key]: newValue };
    props.handleDataModelChange(dataModel);
    return newValue;
  }, initialValue);

  function makeChildren(initialValue: any, index?: number) {
    let children = [];
    for (const [key, fieldProps] of props.children_map) {
      let childProps = { ...fieldProps };

      childProps.handleDataModelChange = (updates: any) =>
        setValue({
          ...(index === undefined ? {} : { index }),
          type: "update",
          updates: updates,
        });
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

  if (!array && !props.name && !props.description) {
    elementAttrs.className = "without_border";
  }
  return (
    <div className="group_field" style={order === undefined ? {} : { order }}>
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
                {makeChildren(singleValue, index)}
              </fieldset>
              <span
                className="remove_icon"
                onClick={() => setValue({ type: "remove", index })}
                title={`remove this item of ${
                  props.name || props.field_key
                }`}></span>
            </div>
          ))}
          <span
            className="clone_icon"
            onClick={() => setValue({ type: "clone" })}></span>
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
