import React from "react";
import './Form.css';

export interface PitayaFormProps {
    version: string;
    form: FormProps;
    styles?: object;
    groups?: groupsProps;
    actions?: actionsProps;
    input?: object;
}
interface FormProps {
    [key: string]: FieldProps;
    
}
interface FieldProps {
    name?: string;
    description?: string;
    long_descriptoin?: string;
    type?: FieldType;    
    default?: any;
    array?: boolean;
    gid?: string;
    order?: number;
    options?: optionsProps;
    events?: object;
}
type FieldType = "Boolean" | "Number" | "String" | "Choices" | "DateTime" | "File" | "Label" | "Password" | "Binary" | "Duration" | "Hostname" | "Port" | "PortRange" | "PrivateKey" | "RandomToken" | "Subnet" | "Location" | "TimePeriod" | "RavinUIUser";
interface optionsProps{
    [key: string]: any;
    validators?: object[];
}
interface groupsProps{
    [key: string]: groupProps;
}
interface groupProps{
    name?: string;
    descriptoin?: string;
    target_group?: string;
    order?: number;
    array?: boolean;
    default?: object[];
    gid?: string;
    events?: object;
}
interface actionsProps{
    [key: string]: actionProps[];
}
type ActionKey = "remove" | "update" | "rpc" | "modal" | "submit";
type actionProps ={
    [key in ActionKey]: object;
}

const Form = (props: PitayaFormProps) => {    
  return <form></form>;
};

export default Form;
export { FieldType, ActionKey };
