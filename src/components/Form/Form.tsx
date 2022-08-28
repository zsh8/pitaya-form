import React from "react";
import SimpleField from "../SimpleField";
import "./Form.css";

export interface PitayaFormProps {
  version: string;
  form: FormProps;
  styles?: object;
  groups?: GroupsProps;
  actions?: ActionsProps;
  input?: object;
}
interface FormProps {
  [key: string]: MetaFieldProps;
}

interface GroupsProps {
  [key: string]: object;
}
interface ActionsProps {
  [key: string]: ActionProps[];
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
  let formFields = [];
  for (const key in props.form) {
    const { array, gid, order, ...fieldProps } = props.form[key];
    formFields.push(
      <div className="form_field">
        <SimpleField field_key={key} {...fieldProps} />
      </div>
    );
  }

  return <form>{formFields}</form>;
};

export default Form;
