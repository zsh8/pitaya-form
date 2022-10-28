import React from "react";
import { Button, Col, Form, Row } from "antd";
import GroupField from "../GroupField";
import SimpleField from "../SimpleField";
import "./Form.css";

export interface PitayaFormProps {
  version: string;
  form: { [key: string]: any };
  styles?: object;
  groups?: { [key: string]: RawGroupProps };
  actions?: { [key: string]: ActionProps[] };
  input?: { [key: string]: any };
}

export interface RawGroupProps {
  name?: string;
  description?: string;
  target_group?: string | null;
  default?: object[];
  gid?: string;
  array?: boolean;
  order?: number;
  events?: object;
}
type ActionKey = "remove" | "update" | "rpc" | "modal" | "submit";
type ActionProps = {
  [key in ActionKey]: object;
};

const App: React.FC<PitayaFormProps> = (props: PitayaFormProps) => {
  const [form] = Form.useForm();
  const setFormFieldValue = (fieldName: any, value: any) =>
    form.setFieldValue(fieldName, value);
  const getFormFieldValue = (fieldName: any) => form.getFieldValue(fieldName);
  const handleSubmit = (values: any) => {
    // Preventing the page from reloading
    console.log(values);
  };

  const rootGroup = "_root";
  const dataModelRoot = props.groups?.[rootGroup]?.target_group;
  const formPath = dataModelRoot ? [dataModelRoot] : [];
  const initialDataModel = props.input || {};

  let fieldsMap = new Map<string, any>();
  for (const fieldKey in props.form) {
    const { gid = rootGroup, ...fieldProps } = props.form[fieldKey];
    fieldProps.fieldKey = fieldKey;
    fieldProps.parentPath = formPath;
    fieldProps.setFormFieldValue = setFormFieldValue;
    fieldProps.getFormFieldValue = getFormFieldValue;

    let currentGid: string = gid;
    let groupStack = [];
    while (currentGid !== rootGroup) {
      groupStack.push(currentGid);
      currentGid = props.groups?.[currentGid]?.gid || rootGroup;
    }
    let parentChildren: Map<string, any> = fieldsMap;
    while (groupStack.length > 0) {
      currentGid = groupStack.pop() || "";
      if (!parentChildren.has(`group_${currentGid}`)) {
        const { gid: groupGid = rootGroup, ...otherProps } =
          props.groups?.[currentGid] || {};
        const groupFieldProps: any = { ...otherProps };
        groupFieldProps.fieldKey = currentGid;
        if (groupGid === rootGroup) groupFieldProps.parentPath = formPath;

        groupFieldProps.setFormFieldValue = setFormFieldValue;
        groupFieldProps.getFormFieldValue = getFormFieldValue;

        groupFieldProps.childrenMap = new Map<string, any>();
        parentChildren.set(`group_${currentGid}`, groupFieldProps);

        parentChildren = groupFieldProps.childrenMap;
      } else {
        parentChildren = parentChildren.get(`group_${currentGid}`).childrenMap;
      }
    }
    parentChildren.set(`simple_${fieldKey}`, fieldProps);
  }

  let formFields = [];
  for (const [key, fieldProps] of fieldsMap) {
    if (key.startsWith("simple_")) {
      formFields.push(
        <SimpleField key={fieldProps.fieldKey} {...fieldProps} />
      );
    } else {
      formFields.push(
        <GroupField key={fieldProps.fieldKey} {...fieldProps}></GroupField>
      );
    }
  }

  return (
    <>
      <Form
        form={form}
        initialValues={initialDataModel}
        layout={"vertical"}
        colon={false}
        onFinish={handleSubmit}>
        <Row>
          {formFields.map((formField, index) => (
            <Col
              key={index}
              order={Number(formField.props.order) || 0}
              span={24}>
              {formField}
            </Col>
          ))}
        </Row>
        <Button type="primary" htmlType="submit">
          save
        </Button>
      </Form>
    </>
  );
};

export default App;
