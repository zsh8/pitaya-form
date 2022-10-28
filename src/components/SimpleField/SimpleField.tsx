import React, { lazy, Suspense } from "react";
import { Form, Button, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import "./SimpleField.css";

//type FieldType = "Boolean" | "Number" | "String" | "Choices" | "DateTime" | "File" | "Label" | "Password" | "Binary" | "Duration" | "Hostname" | "Port" | "PortRange" | "PrivateKey" | "RandomToken" | "Subnet" | "Location" | "TimePeriod" | "RavinUIUser";
const FieldTypesMap = {
  Boolean: ["BooleanField", "boolean", false],
  Number: ["NumberField", "number", 0],
  String: ["TextField", "string", ""],
  Choices: ["ChoicesField", "object", {}],
  DateTime: ["DateTimeField", "object", {}],
  File: ["FileField", "object", {}],
  Label: ["TextField", "string", ""],
  Password: ["PasswordField", "string", ""],
  Binary: ["TextField", "string", ""],
  Duration: ["time", "number", 0],
  Hostname: ["TextField", "string", ""],
  Port: ["NumberField", "number", 0],
  PortRange: ["TextField", "string", ""],
  PrivateKey: ["FileField", "object", {}],
  RandomToken: ["fragment", "string", ""],
  Subnet: ["TextField", "string", ""],
  Location: ["TextField", "string", ""],
  TimePeriod: ["TextField", "string", ""],
  RavinUIUser: ["TextField", "string", ""],
};

export interface RawFieldProps {
  type?: keyof typeof FieldTypesMap;
  fieldKey: string;
  name?: string;
  description?: string;
  long_description?: string;
  default?: any;
  getFormFieldValue: any;
  setFormFieldValue: any;
  parentPath: string[];
  parentName?: string[];
  array?: boolean;
  order?: number;
  options?: OptionsProps;
  events?: object;
}

export interface FieldProps {
  fieldKey: string;
  name: string;
  default: any;
  value?: any;
  onChange?: any;
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
    getFormFieldValue,
    setFormFieldValue,
    order,
    description,
    long_description,
    parentPath,
    parentName = parentPath,
    ...otherProps
  } = props;

  let fieldProps: any = { ...otherProps };

  const [componentName, valueType, typeDefaultValue] =
    FieldTypesMap[fieldType ? fieldType : "String"];

  const FieldComponent = lazy(() => import(`./${componentName}`));
  const showLabel = fieldProps.name !== null;
  fieldProps.name = fieldProps.name?.toString() || fieldProps.fieldKey;
  if (fieldProps.default === undefined) fieldProps.default = null;

  if (!("options" in fieldProps)) fieldProps.options = {};
  if (!("events" in fieldProps)) fieldProps.events = {};

  let help = {};
  if (description) {
    // TODO: check trim tooltip in form items
    let title = description.toString().slice(0, 120);
    if (description.toString().length > 120) {
      title = title + " ...";
    }
    // TODO: check adding simple title to form items
    // help = { help: title };
  }
  let tooltip = {};
  if (long_description) {
    tooltip = { tooltip: long_description };
  }

  let dataModelPath = [...parentPath, fieldProps.fieldKey];

  if (getFormFieldValue(dataModelPath) === undefined) {
    let defaultValue = fieldProps.default;
    if (
      (array && !Array.isArray(defaultValue)) ||
      (!array && typeof defaultValue !== valueType)
    )
      defaultValue = array ? [] : typeDefaultValue;
    setFormFieldValue(dataModelPath, defaultValue);
  }

  let formItemName = [...parentName, fieldProps.fieldKey];

  let label = showLabel ? { label: fieldProps.name } : null;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {array ? (
        <Form.Item {...label} {...tooltip} {...help}>
          <Form.List name={formItemName}>
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Space
                    key={field.key}
                    style={{ display: "flex", marginBottom: 2 }}
                    align="baseline">
                    <Form.Item {...field}>
                      <FieldComponent {...fieldProps} />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add(typeDefaultValue)}
                    icon={<PlusOutlined />}>
                    {`Add ${fieldProps.name}`}
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form.Item>
      ) : (
        <Form.Item {...label} {...tooltip} {...help} name={formItemName}>
          <FieldComponent {...fieldProps} />
        </Form.Item>
      )}
    </Suspense>
  );
};

export default SimpleField;
