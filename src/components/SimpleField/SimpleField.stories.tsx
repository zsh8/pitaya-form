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

const commonArgs = {
  parentPath: ["main"],
};

// Default type
export const Primary = Template.bind({});
Primary.args = {
  jsonKey: "default_field",
  ...commonArgs,
};

// Boolean
export const PrimaryBooleanField = Template.bind({});
PrimaryBooleanField.args = {
  jsonKey: "boolean_field",
  type: "Boolean",
  ...commonArgs,
};

export const BooleanFieldWithOptions = Template.bind({});
BooleanFieldWithOptions.args = {
  jsonKey: "verify_ssl",
  name: "verify ssl",
  description: "check for verify ssl",
  long_description: "if checked verifies ssl",
  type: "Boolean",
  default: true,
  options: {},
  events: {},
  ...commonArgs,
};

// Number
export const PrimaryNmberField = Template.bind({});
PrimaryNmberField.args = {
  jsonKey: "number_field",
  type: "Number",
  ...commonArgs,
};

export const NumberFieldWithOptions = Template.bind({});
NumberFieldWithOptions.args = {
  jsonKey: "port",
  name: "port",
  description: "port of server",
  long_description: "if server has port",
  type: "Number",
  default: 8080,
  options: {},
  events: {},
  ...commonArgs,
};

// String
export const PrimaryStringField = Template.bind({});
PrimaryStringField.args = {
  jsonKey: "string_field",
  type: "String",
  ...commonArgs,
};

export const StringFieldWithOptions = Template.bind({});
StringFieldWithOptions.args = {
  jsonKey: "host",
  name: "host",
  description: "host name of server",
  long_description: "this is the host name of the server",
  type: "String",
  default: "server 1",
  options: { validators: [{ regex: ".+" }] },
  events: {},
  ...commonArgs,
};
/*
// Choices
export const ChoicesField = Template.bind({});
ChoicesField.args = {
    jsonKey: "choices_field",
    type: "Choices",
    ...commonArgs
};

export const ChoicesFieldWithOptions = Template.bind({});
ChoicesField.args = {
    ...commonArgs,
    jsonKey: "country",
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
    jsonKey: "dateTime_field",
    type: "DateTime",
    ...commonArgs
};

export const DateTimeFieldWithOptions = Template.bind({});
DateTimeField.args = {
    jsonKey: "register_time",
        name: "register time",
    description: "time of register",
    long_description: "time that register occurred",    
    type: "DateTime",
    default: 0,
    options: {},
    events: {},
    ...commonArgs
};
*/
