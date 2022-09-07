import React from "react";
import GroupField from "../GroupField";
import SimpleField from "../SimpleField";
import "./Form.css";

export interface PitayaFormProps {
  version: string;
  form: FormProps;
  styles?: object;
  groups?: { [key: string]: RawGroupProps };
  actions?: { [key: string]: ActionProps[] };
  input?: object;
}
interface FormProps {
  [key: string]: MetaFieldProps;
}

export interface RawGroupProps extends MetaFieldProps {
  name?: string;
  description?: string;
  target_group?: string;
  default?: object[];
  array?: boolean;
  events?: object;
}
type ActionKey = "remove" | "update" | "rpc" | "modal" | "submit";
type ActionProps = {
  [key in ActionKey]: object;
};

interface MetaFieldProps {
  gid?: string;
  order?: number;
  [key: string]: any;
}

const Form = (props: PitayaFormProps) => {
  let fieldsMap = new Map<string, any>();
  for (const key in props.form) {
    const { gid, order, ...fieldProps } = props.form[key];
    fieldProps.field_key = key;
    let currentGid = gid;
    let groupStack = [];
    while (currentGid) {
      groupStack.push(currentGid);
      currentGid = (props.groups?.[currentGid] || {}).gid || "";
    }
    let parentChildren: Map<string, any> = fieldsMap;
    while (groupStack.length > 0) {
      currentGid = groupStack.pop() || "";
      if (!parentChildren.has(`group_${currentGid}`)) {
        const {
          gid: groupGid,
          order: groupOrder,
          ...groupFieldProps
        } = props.groups?.[currentGid] || {};
        groupFieldProps.field_key = currentGid;
        groupFieldProps.children_map = new Map<string, any>();
        parentChildren.set(`group_${currentGid}`, groupFieldProps);

        parentChildren = groupFieldProps.children_map;
      } else {
        parentChildren = parentChildren.get(`group_${currentGid}`).children_map;
      }
    }
    parentChildren.set(`simple_${key}`, fieldProps);
  }

  let formFields = [];
  for (const [key, fieldProps] of fieldsMap) {
    if (key.startsWith("simple_")) {
      formFields.push(
        <SimpleField key={fieldProps.field_key} {...fieldProps} />
      );
    } else {
      formFields.push(
        <GroupField key={fieldProps.field_key} {...fieldProps}></GroupField>
      );
    }
  }
  return <form>{formFields}</form>;
};

export default Form;
