import React from "react";
import { lazy, Suspense } from "react";
import { useState } from "react";
import { v4 } from "uuid";
import "./SimpleField.css";

//type FieldType = "Boolean" | "Number" | "String" | "Choices" | "DateTime" | "File" | "Label" | "Password" | "Binary" | "Duration" | "Hostname" | "Port" | "PortRange" | "PrivateKey" | "RandomToken" | "Subnet" | "Location" | "TimePeriod" | "RavinUIUser";
const FieldTypesMap = {
  Boolean: "BooleanField",
  Number: "NumberField",
  String: "TextField",
  Choices: "ChoicesField",
  DateTime: "DateTimeField",
  File: "FileField",
  Label: "TextField",
  Password: "PasswordField",
  Binary: "text",
  Duration: "time",
  Hostname: "text",
  Port: "number",
  PortRange: "text",
  PrivateKey: "file",
  RandomToken: "fragment",
  Subnet: "text",
  Location: "text",
  TimePeriod: "text",
  RavinUIUser: "text",
};

export interface RawFieldProps {
  type?: keyof typeof FieldTypesMap;
  field_key: string;
  name?: string;
  description?: string;
  long_description?: string;
  default?: any;
  array?: boolean;
  options?: OptionsProps;
  events?: object;
}

export interface FieldProps {
  field_key: string;
  name: string;
  elementAttrs: object;
  default: any;
  options: OptionsProps;
  events: object;
}

interface OptionsProps {
  [key: string]: any;
  validators?: object[];
}

const SimpleField = (props: RawFieldProps) => {
  let {
    type: fieldType,
    array,
    default: fieldDefault,
    description,
    long_description,
    ...otherProps
  } = props;

  let fieldProps: any = { ...otherProps };

  const componentName = FieldTypesMap[fieldType ? fieldType : "String"];

  const FieldComponent = lazy(() => import(`./${componentName}`));
  const showLabel = fieldProps.name !== null;
  fieldProps.name = fieldProps.name?.toString() || fieldProps.field_key;
  if (fieldDefault === undefined) fieldDefault = array ? [] : null;
  if (array && !Array.isArray(fieldDefault)) {
    fieldDefault = [fieldDefault];
  }
  if (!("options" in fieldProps)) fieldProps.options = {};
  if (!("events" in fieldProps)) fieldProps.events = {};

  fieldProps.elementAttrs = {
    "aria-label": fieldProps.name,
  };

  if (description) {
    let title = description.toString().slice(0, 120);
    if (description.toString().length > 120) {
      title = title + " ...";
    }
    fieldProps.elementAttrs.title = title;
  }
  const [value, setValue] = useState(fieldDefault);
  function handleClone() {
    const newValue = [...value, null];
    setValue(newValue);
  }

  function handleRemove(index: number) {
    let newValue = [...value];
    newValue.splice(index, 1);
    setValue(newValue);
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="simple_field" id={fieldProps.field_key}>
        {showLabel && (
          <label htmlFor={fieldProps.field_key}>
            {fieldProps.name.slice(0, 30)}
          </label>
        )}
        {long_description && (
          <span className="question_icon" title={long_description}></span>
        )}

        {array ? (
          <div className="array_simple_field">
            {value.map((defaultValue: any, index: number) => (
              <div key={v4()}>
                <FieldComponent default={defaultValue} {...fieldProps} />
                <span
                  className="remove_icon"
                  onClick={() => handleRemove(index)}
                  title={`remove this item of
                   ${props.name || props.field_key}`}></span>
              </div>
            ))}
          </div>
        ) : (
          <FieldComponent default={value} {...fieldProps} />
        )}
        {array && <span className="clone_icon" onClick={handleClone}></span>}
      </div>
    </Suspense>
  );
};

export default SimpleField;
