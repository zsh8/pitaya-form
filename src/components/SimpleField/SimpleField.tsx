import React from "react";
import { lazy, Suspense } from "react";
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
  const {
    type: field_type,
    description,
    long_description,
    ...otherProps
  } = props;

  let fieldProps: any = { ...otherProps };

  const componentName = FieldTypesMap[field_type ? field_type : "String"];

  const FieldComponent = lazy(() => import(`./${componentName}`));
  const withoutLabel = fieldProps.name === null;
  fieldProps.name = fieldProps.name?.toString() || fieldProps.field_key;
  if (!("default" in fieldProps)) fieldProps.default = null;
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
  const simpleField = <FieldComponent {...fieldProps} />;

  return (
    <div className="simple_field">
      <Suspense fallback={<div>Loading...</div>}>
        {withoutLabel ? (
          simpleField
        ) : (
          <label>
            {fieldProps.name.slice(0, 30)}
            {long_description && (
              <span className="question_icon" title={long_description}></span>
            )}
            {simpleField}
          </label>
        )}
      </Suspense>
    </div>
  );
};

export default SimpleField;
