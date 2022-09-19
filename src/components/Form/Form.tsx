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
  input?: { [key: string]: any };
}
interface FormProps {
  [key: string]: MetaFieldProps;
}

export interface RawGroupProps extends MetaFieldProps {
  name?: string;
  description?: string;
  target_group?: string | null;
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
  const rootGroup = "_root";
  const dataModelRoot = props.groups?.[rootGroup]?.target_group;
  let initialValue =
    (dataModelRoot ? props.input?.[dataModelRoot] : props.input) ||
    ({} as { [key: string]: any });
  let fieldsMap = new Map<string, any>();
  for (const field_key in props.form) {
    const { gid = rootGroup, order, ...fieldProps } = props.form[field_key];
    fieldProps.field_key = field_key;
    if (
      (gid === rootGroup || props.groups?.[gid]?.target_group === null) &&
      field_key in initialValue
    ) {
      fieldProps.value = initialValue[field_key];
    }
    let currentGid: string = gid;
    let groupStack = [];
    while (currentGid !== rootGroup) {
      groupStack.push(currentGid);
      currentGid = props.groups?.[currentGid]?.gid || rootGroup;
    }
    let parentChildren: Map<string, any> = fieldsMap;
    let parentInitialValue = initialValue;
    while (groupStack.length > 0) {
      currentGid = groupStack.pop() || "";
      if (!parentChildren.has(`group_${currentGid}`)) {
        const {
          gid: groupGid,
          order: groupOrder,
          ...groupFieldProps
        } = props.groups?.[currentGid] || {};
        groupFieldProps.field_key = currentGid;

        if (groupFieldProps.target_group === null)
          groupFieldProps.value = { ...parentInitialValue };
        else {
          const dataModelKey = groupFieldProps.target_group || currentGid;
          if (dataModelKey in parentInitialValue) {
            groupFieldProps.value = parentInitialValue[dataModelKey];
          }
        }
        groupFieldProps.children_map = new Map<string, any>();
        parentChildren.set(`group_${currentGid}`, groupFieldProps);

        parentChildren = groupFieldProps.children_map;
        parentInitialValue = groupFieldProps.value || {};
      } else {
        parentChildren = parentChildren.get(`group_${currentGid}`).children_map;
      }
    }
    parentChildren.set(`simple_${field_key}`, fieldProps);
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
