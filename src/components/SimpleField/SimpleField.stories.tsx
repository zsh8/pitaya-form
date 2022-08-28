import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import SimpleField from "./SimpleField";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "PitayaForm/SimpleField",
  component: SimpleField,
} as ComponentMeta<typeof SimpleField>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SimpleField> = (args) => (
  <SimpleField {...args} />
);

// Default type
export const Primary = Template.bind({});
Primary.args = {
  field_key: "default_field",
};

// Boolean
export const PrimaryBooleanField = Template.bind({});
PrimaryBooleanField.args = {
  field_key: "boolean_field",
  type: "Boolean",
};

export const BooleanFieldWithOptions = Template.bind({});
BooleanFieldWithOptions.args = {
  field_key: "verify_ssl",
  name: "verify ssl",
  description: "check for verify ssl",
  long_description: "if checked verifies ssl",
  type: "Boolean",
  default: true,
  options: {},
  events: {},
};

// Number
export const PrimaryNmberField = Template.bind({});
PrimaryNmberField.args = {
  field_key: "number_field",
  type: "Number",
};

export const NumberFieldWithOptions = Template.bind({});
NumberFieldWithOptions.args = {
  field_key: "port",
  name: "port",
  description: "port of server",
  long_description: "if server has port",
  type: "Number",
  default: 8080,
  options: {},
  events: {},
};

// String
export const PrimaryStringField = Template.bind({});
PrimaryStringField.args = {
  field_key: "string_field",
  type: "String",
};

export const StringFieldWithOptions = Template.bind({});
StringFieldWithOptions.args = {
  field_key: "host",
  name: "host",
  description: "host name of server",
  long_description: "this is the host name of the server",
  type: "String",
  default: "server 1",
  options: { validators: [{ regex: ".+" }] },
  events: {},
};
/*
// Choices
export const ChoicesField = Template.bind({});
ChoicesField.args = {
    field_key: "choices_field",
    type: "Choices",
         
};

export const ChoicesFieldWithOptions = Template.bind({});
ChoicesField.args = {
    field_key: "country",
        name: "Countries",
    description: "list of countries",
    long_description: "this is the list of countries",    
    type: "Choices",
    default: ["iran", "iraq"],
    options: {
        choices: { iran: { "name": "Iran" }, afghanistan: { "name": "Afghanistan" }, iraq: {"name": "Iraq"} },
        multiple: true
    },
    events: {}
};

// DateTime
export const DateTimeField = Template.bind({});
DateTimeField.args = {
    field_key: "dateTime_field",
    type: "DateTime",
         
};

export const DateTimeFieldWithOptions = Template.bind({});
DateTimeField.args = {
    field_key: "register_time",
        name: "register time",
    description: "time of register",
    long_description: "time that register occurred",    
    type: "DateTime",
    default: 0,
    options: {},
    events: {}
};
*/
