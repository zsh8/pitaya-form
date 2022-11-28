import React from "react";
import { Form, Button, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { convertValidatorsToRules, Validator } from "../../utils/validation";
import * as fields from "./FieldComponents";
import "./SimpleField.css";

// keys are the PitayaForm fields type and each value is a triple
// containing the custom component type, value type for validation
// purposes and default value for each type
const FieldTypesMap = {
  Boolean: [fields.BooleanField, "boolean", false],
  Number: [fields.NumberField, "number", 0],
  String: [fields.TextField, "string", ""],
  Choices: [fields.ChoicesField, "string", null],
  DateTime: [fields.DateTimeField, "number", 0],
  File: [fields.FileField, "object", null],
  Label: [fields.LabelField, "string", null],
  Password: [fields.PasswordField, "string", null],
  Binary: [fields.TextField, "string", null],
  Duration: [fields.DurationField, "integer", 0],
  Hostname: [fields.TextField, "string", null],
  Port: [fields.NumberField, "number", null],
  PortRange: [fields.TextField, "string", null],
  PrivateKey: [fields.FileField, "object", null],
  RandomToken: [fields.TextField, "string", null],
  Subnet: [fields.TextField, "string", null],
  Location: [fields.TextField, "string", null],
  TimePeriod: [fields.TextField, "string", null],
  RavinUIUser: [fields.TextField, "string", null],
} as const;

export interface RawFieldProps {
  type?: keyof typeof FieldTypesMap;
  jsonKey: string;
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
  jsonKey: string;
  name: string;
  default: any;
  value: any;
  onChange: any;
  onBlur: any;
  options: OptionsProps;
  events: object;
}

interface OptionsProps {
  [key: string]: any;
  validators?: Validator[];
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
    options = {},
    parentPath,
    ...otherProps
  } = props;

  let fieldProps: any = { ...otherProps };

  let FieldComponent: any, valueType: string, typeDefaultValue: any;

  [FieldComponent, valueType, typeDefaultValue] =
    FieldTypesMap[fieldType ? fieldType : "String"] || FieldTypesMap["String"]; // default field type is String

  if ((fieldType === "Choices" || fieldType === "File") && options.multiple) {
    valueType = "array";
    typeDefaultValue = [];
  }

  if (fieldType === "Label")
    // Label field could not be an array
    array = false;

  // fields with null name should hava no label in the form
  const showLabel = fieldProps.name !== null;
  fieldProps.name = fieldProps.name?.toString() || fieldProps.jsonKey;
  let label = showLabel ? { label: fieldProps.name } : null;

  // set default value for events
  if (!("events" in fieldProps)) fieldProps.events = {};
  const { validators = [], ...restOptions } = options;
  fieldProps.options = restOptions;

  if (fieldType === "Binary") {
    validators.push({ binary: true });
  }

  const validateLabel = fieldProps.name;
  const validateUnit = fieldType === "Duration" ? "seconds" : "";
  const rules = {
    rules: convertValidatorsToRules(
      validators,
      valueType,
      validateLabel,
      validateUnit
    ),
  };

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
  let fieldPath = [...parentPath, fieldProps.jsonKey];

  return array ? (
    <Form.Item {...label} {...tooltip} {...help}>
      <Form.List name={fieldPath} initialValue={fieldProps.default}>
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              <Space
                key={field.key}
                style={{ display: "flex", marginBottom: 2 }}
                align="baseline">
                <Form.Item {...field} {...rules} validateTrigger="onBlur">
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
      {...help}
      {...rules}
      validateTrigger="onBlur">
      <FieldComponent {...fieldProps} />
    </Form.Item>
  );
};

export default SimpleField;
