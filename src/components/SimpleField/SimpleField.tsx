import React, { lazy, Suspense, useReducer, ChangeEvent } from "react";
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
  handleDataModelChange: any;
  default?: any;
  value?: any;
  array?: boolean;
  options?: OptionsProps;
  events?: object;
}

export interface FieldProps {
  field_key: string;
  name: string;
  elementAttrs: object;
  default: any;
  value: any;
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
    value: initialValue,
    description,
    long_description,
    handleDataModelChange,
    ...otherProps
  } = props;

  let fieldProps: any = { ...otherProps };

  const componentName = FieldTypesMap[fieldType ? fieldType : "String"];

  const FieldComponent = lazy(() => import(`./${componentName}`));
  const showLabel = fieldProps.name !== null;
  fieldProps.name = fieldProps.name?.toString() || fieldProps.field_key;
  if (fieldProps.default === undefined) fieldProps.default = null;

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
  if (initialValue === undefined) {
    initialValue = fieldProps.default;
    if (array && !Array.isArray(initialValue)) {
      initialValue = [];
    }
  }
  const [value, setValue] = useReducer((value: any, newValue: any) => {
    handleDataModelChange({ [fieldProps.field_key]: newValue });
    return newValue;
  }, initialValue);

  function handleClone() {
    const newValue = [...value, null];
    setValue(newValue);
  }

  function handleRemove(index: number) {
    let newValue = [...value];
    newValue.splice(index, 1);
    setValue(newValue);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>, index?: number) {
    let fieldValue =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.type === "number"
        ? event.target.valueAsNumber
        : event.target.value;
    let newValue: any = fieldValue;
    if (array) {
      newValue = [...value];
      newValue.splice(index, 1, fieldValue);
    }
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
          <div className="array_field">
            {value.map((singleValue: any, index: number) => (
              <div key={v4()} className="removable">
                <FieldComponent
                  value={singleValue}
                  {...fieldProps}
                  elementAttrs={{
                    ...fieldProps.elementAttrs,
                    onChange: (event: any) => handleChange(event, index),
                  }}
                />
                <span
                  className="remove_icon"
                  onClick={() => handleRemove(index)}
                  title={`remove this item of
                   ${props.name || props.field_key}`}></span>
              </div>
            ))}
            {<span className="clone_icon" onClick={handleClone}></span>}
          </div>
        ) : (
          <FieldComponent
            value={value}
            {...fieldProps}
            elementAttrs={{
              ...fieldProps.elementAttrs,
              onChange: handleChange,
            }}
          />
        )}
      </div>
    </Suspense>
  );
};

export default SimpleField;
