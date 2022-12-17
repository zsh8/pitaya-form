import React from "react";
import { Button, Col, Form, Row } from "antd";
import GroupField from "../GroupField";
import SimpleField from "../SimpleField";
import "antd/dist/antd.css";
import "./Form.css";
import { defaultValidateMessages } from "../../utils/validation";

export interface PitayaFormProps {
  /**
   * Version of PitayaForm specification
   */
  version: string;
  /**
   * An object which defines the fields of the PitayaForm
   * each key of this object corresponds to one field
   */
  form: { [key: string]: any };
  /**
   * Optional object in which keys are references to
   * fields and groups and values are objects that
   * add styles to the reference
   */
  styles?: object;
  /**
   * An object that each key defines a logical group
   * for changing the appearance of fields that share
   * a group key in thier gid attribute
   */
  groups?: { [key: string]: RawGroupProps };
  /**
   * An object containing actions that cab be used
   * as fields or groups events
   */
  actions?: { [key: string]: ActionProps[] };
  /**
   * Target data model according to the current
   * entered values by the user
   */
  input?: { [key: string]: any };
  /**
   * A function that will be balled by form submission
   */
  submit?: (values: any) => any;
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

/**
 * Renders a PitayaForm with specification defined by properties
 * @param props specification of form
 * @returns an antd Form component
 */
const PitayaForm: React.FC<PitayaFormProps> = (props: PitayaFormProps) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    // Preventing the page from reloading
    console.log(values);
  };

  const rootGroup = "_root";
  const dataModelRoot = props.groups?.[rootGroup]?.target_group;
  const formPath = dataModelRoot ? [dataModelRoot] : [];
  const initialDataModel = props.input || {};

  let formChildrenMap = new Map<string, any>();
  for (const jsonKey in props.form) {
    const { gid = rootGroup, ...fieldProps } = props.form[jsonKey];
    fieldProps.jsonKey = jsonKey;
    fieldProps.parentPath = formPath;

    let currentGid: string = gid;
    let groupStack = [];
    // add all parent groups of the field to the groupStack
    while (currentGid !== rootGroup) {
      groupStack.push(currentGid);
      currentGid = props.groups?.[currentGid]?.gid || rootGroup;
    }
    // set the form children as the default parent children of the current field
    let parentChildren: Map<string, any> = formChildrenMap;
    while (groupStack.length > 0) {
      currentGid = groupStack.pop() || "";
      if (!parentChildren.has(`group_${currentGid}`)) {
        // create the new group properties by groups specification
        const { gid: groupGid = rootGroup, ...otherProps } =
          props.groups && currentGid in props.groups
            ? props.groups[currentGid] || {}
            : // non-existent group means no change in data model
              { target_group: null };
        const groupProps: any = { ...otherProps };
        groupProps.jsonKey = currentGid;
        if (groupGid === rootGroup) groupProps.parentPath = formPath;

        groupProps.childrenMap = new Map<string, any>();
        // add the new group properties to the parent children
        parentChildren.set(`group_${currentGid}`, groupProps);
        // set the new group children as the parent children of the current field
        parentChildren = groupProps.childrenMap;
      } else {
        // set the existent group children as the parent children of the current field
        parentChildren = parentChildren.get(`group_${currentGid}`).childrenMap;
      }
    }
    // add the current field properties as a child to the parent children
    parentChildren.set(`simple_${jsonKey}`, fieldProps);
  }

  let formChildren = [];
  // make the form fields or groups from the form children map based
  // on the distinctive keys of the children map
  for (const [key, fieldProps] of formChildrenMap) {
    if (key.startsWith("simple_")) {
      formChildren.push(
        <SimpleField key={fieldProps.jsonKey} {...fieldProps} />
      );
    } else {
      formChildren.push(
        <GroupField key={fieldProps.jsonKey} {...fieldProps}></GroupField>
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
        validateMessages={defaultValidateMessages}
        onFinish={props.submit || handleSubmit}>
        <Row>
          {formChildren.map((formChild, index) => (
            <Col
              key={index}
              order={Number(formChild.props.order) || 0}
              span={24}>
              {formChild}
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

export default PitayaForm;
