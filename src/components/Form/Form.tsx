import React from "react";
import GroupField from "../GroupField";
import SimpleField from "../SimpleField";
import "./Form.css";

export interface PitayaFormProps {
  version: string;
  form: FormProps;
  styles?: object;
  groups?: { [key: string]: GroupProps };
  actions?: { [key: string]: ActionProps[] };
  input?: object;
}
interface FormProps {
  [key: string]: MetaFieldProps;
}

export interface GroupProps extends MetaFieldProps {
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

    if (gid === undefined) {
      fieldsMap.set(`simple_${key}`, simpleField);
    } else {
      if (!fieldsMap.has(`group_${gid}`)) {
        const {
          array: g_array,
          gid: g_gid,
          order: g_order,
          ...groupProps
        } = props.groups?.[gid] || {};
        groupProps.field_key = gid;
        groupProps.children = [];
        fieldsMap.set(`group_${gid}`, groupProps);
      }
      fieldsMap.get(`group_${gid}`).children.push(simpleField);
    }
  }

  let formFields = [];
  for (const [key, value] of fieldsMap) {
    if (key.startsWith("simple_")) {
      formFields.push(value);
    } else {
      const { children, ...groupProps } = value;
      formFields.push(
        <GroupField field_key={key.replace(/^group_/i, "")} {...groupProps}>
          {children}
        </GroupField>
      );
    }
  }
  return <form>{formFields}</form>;
};

export default Form;
