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
  default?: [object];
  events?: object;
}
type ActionKey = "remove" | "update" | "rpc" | "modal" | "submit";
type ActionProps = {
  [key in ActionKey]: object;
};

interface MetaFieldProps {
  array?: boolean;
  gid?: string;
  order?: number;
  [key: string]: any;
}

const Form = (props: PitayaFormProps) => {
  let fieldsMap = new Map<string, any>();
  for (const key in props.form) {
    const { array, gid, order, ...fieldProps } = props.form[key];

    const simpleField = <SimpleField field_key={key} {...fieldProps} />;

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
          array: groupArray,
          gid: groupGid,
          order: groupOrder,
          ...groupProps
        } = props.groups?.[currentGid] || {};
        groupProps["field_key"] = currentGid;
        groupProps.children_map = new Map<string, any>();
        parentChildren.set(`group_${currentGid}`, groupProps);

        parentChildren = groupProps.children_map;
      } else {
        parentChildren = parentChildren.get(`group_${currentGid}`).children_map;
      }
    }
    parentChildren.set(`simple_${key}`, simpleField);
  }

  let formFields = [];
  for (const [key, value] of fieldsMap) {
    if (key.startsWith("simple_")) {
      formFields.push(value);
    } else {
      formFields.push(<GroupField {...value}></GroupField>);
    }
  }
  return <form>{formFields}</form>;
};

export default Form;
