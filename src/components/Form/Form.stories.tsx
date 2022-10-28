import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Form from "./Form";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "PitayaForm/Form",
  component: Form,
} as ComponentMeta<typeof Form>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Form> = (args) => <Form {...args} />;

export const HelloWorld = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
HelloWorld.args = {
  version: "1",
  form: {
    device_name: {
      name: "Device Name direct child of form",
      type: "Boolean",
      order: 0,
    },
    text_field: {
      name: "text direct child of form",
      default: "default value of text field",
      order: 0,
    },

    port: {
      name: "port child of headers",
      description: "port of server",
      long_description: "if server has port",
      type: "Number",
      default: 8080,
      gid: "header",
      options: {},
      events: {},
    },
    host: {
      name: "array host",
      description: "host name of server",
      long_description: "this is the host name of the server",
      type: "String",
      default: ["server 1"],
      order: 3,
      array: true,
      options: { validators: [{ regex: ".+" }] },
      events: {},
      gid: "null_group",
    },
    verify_ssl: {
      name: "verify ssl child of header and array",
      description: "check for verify ssl",
      long_description: "if checked verifies ssl",
      type: "Boolean",
      default: [true, false],
      array: true,
      gid: "header",
      order: 1,
      options: {},
      events: {},
    },
    number_test: {
      name: "number test child of form and array",
      description: "number description",
      long_description: "enter the test number value",
      type: "Number",
      array: true,
      default: [1, 5],
      options: { signed: true, float: true },
      events: {},
    },
    single_number: {
      name: "single number child of array_group and single",
      description: "number description",
      long_description: "enter the single number value",
      type: "Number",
      default: 12,
      options: { signed: true, float: true },
      events: {},
      gid: "array_group",
    },

    first_name: {
      name: "first name is more than 30 characters in length child of parent group",
      description: "your first name is more than 120 ",
      long_description:
        "a very long description that should be shown anyway without trimming and it is the first name of the parent group that should be beside the headers group list. it has a farsi default value, but if input value is shown it has input value too",
      default: "\u06cc\u06a9 \u0631\u0634\u062a\u0647",
      array: false,
      gid: "parent_group",
      options: {},
      events: {},
    },
    single_field: {
      default: "default value child of test group and single",
      gid: "null_group",
    },
  },
  styles: {},
  groups: {
    header: {
      name: "array header child of parent group",
      gid: "parent_group",
      description: "headers of this form",
      array: true,
      default: [{ port: 587, verify_ssl: [false, false, true, false] }, {}],
    },
    parent_group: {
      description: "parent with description without name",
      gid: "last parent",
      array: true,
    },
    null_group: { name: "group with null target", target_group: null },
    array_group: {
      name: "array group",
      array: true,
      default: [{ single_number: 66 }],
    },
    _root: { target_group: "main" },
  },
  input: {
    main: {
      host: ["input host value"],
      "last parent": { parent_group: [{ first_name: "input name value" }] },
      null_group: { single_field: "input value inside group" },
      array_group: [{ single_number: 9999 }, { single_number: 2222 }],
      number_test: [46, 77],
      single_field: "input value with null target group",
    },
  },
};
