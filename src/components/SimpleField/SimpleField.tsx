import React, { lazy, Suspense } from "react";
import { Form, Button, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import "./SimpleField.css";

// keys are the PitayaForm fields type and each value is a triple
// containing the custom component name, value type in data model
// and default value for each type
const FieldTypesMap = {
  Boolean: ["BooleanField", "boolean", false],
  Number: ["NumberField", "number", 0],
  String: ["TextField", "string", ""],
  Choices: ["ChoicesField", "object", null],
  DateTime: ["DateTimeField", "object", null],
  File: ["FileField", "object", null],
  Label: ["TextField", "string", null],
  Password: ["PasswordField", "string", null],
  Binary: ["TextField", "string", null],
  Duration: ["time", "number", null],
  Hostname: ["TextField", "string", null],
  Port: ["NumberField", "number", null],
  PortRange: ["TextField", "string", null],
  PrivateKey: ["FileField", "object", null],
  RandomToken: ["fragment", "string", null],
  Subnet: ["TextField", "string", null],
  Location: ["TextField", "string", null],
  TimePeriod: ["TextField", "string", null],
  RavinUIUser: ["TextField", "string", null],
};

export interface RawFieldProps {
  type?: keyof typeof FieldTypesMap;
  fieldKey: string;
  name?: string;
  description?: string;
  long_description?: string;
  default?: any;
  parentPath: string[];
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

/**
 * Renders a form field of any type with the given properties
 * @param  props raw attributes needed to build a form field
 * @returns a From.Item component
 */
const SimpleField: React.FC<RawFieldProps> = (props: RawFieldProps) => {
  let {
    type: fieldType,
    array,
    order,
    description,
    long_description,
    parentPath,
    ...otherProps
  } = props;

  let fieldProps: any = { ...otherProps };

  const [componentName, valueType, typeDefaultValue] =
    FieldTypesMap[fieldType ? fieldType : "String"]; // default field type is String

  const FieldComponent = lazy(() => import(`./${componentName}`));
  // fields with null name should hava no label in the form
  const showLabel = fieldProps.name !== null;
  fieldProps.name = fieldProps.name?.toString() || fieldProps.fieldKey;
  let label = showLabel ? { label: fieldProps.name } : null;

  // set default values for options and events
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
  let tooltip;
  if (long_description) {
    tooltip = { tooltip: long_description };
  }

  // set default value for the field based on the type
  // when default is not defined in properties
  if (fieldProps.default === undefined)
    fieldProps.default = array ? [] : typeDefaultValue;

  // used as name property of Form.Item or Form.List components for initializing
  // value from form initialValue and setting value after calling onChange
  let fieldPath = [...parentPath, fieldProps.fieldKey];

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {array ? (
        <Form.Item {...label} {...tooltip} {...help}>
          <Form.List name={fieldPath} initialValue={fieldProps.default}>
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
        <Form.Item
          name={fieldPath}
          initialValue={fieldProps.default}
          {...label}
          {...tooltip}
          {...help}>
          <FieldComponent {...fieldProps} />
        </Form.Item>
      )}
    </Suspense>
  );
};

export default SimpleField;
