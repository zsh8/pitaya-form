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
      name: "Device Name",
      type: "Boolean",
      order: 0,
    },

    port: {
      name: "port",
      description: "port of server",
      long_description: "if server has port",
      type: "Number",
      default: 8080,
      gid: "header",
      options: {},
      events: {},
    },
    host: {
      name: "host",
      description: "host name of server",
      long_description: "this is the host name of the server",
      type: "String",
      default: "server 1",
      order: 3,
      options: { validators: [{ regex: ".+" }] },
      events: {},
    },
    verify_ssl: {
      name: "verify ssl",
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
      name: "number test",
      description: "number description",
      long_description: "enter the test number value",
      type: "Number",
      array: true,
      default: [1, 5],
      options: { signed: true, float: true },
      events: {},
    },
    first_name: {
      name: "first name is more than 30 characters in length",
      description:
        "your first name is more than 120 characters in lengh so it should be shown ellipsis at the end or maybe it's not yet 120 I think so baby",
      long_description: "enter your first name",
      default: "\u06cc\u06a9 \u0631\u0634\u062a\u0647",
      array: false,
      gid: "parent_group",
      options: {},
      events: {},
    },
    single_field: {
      default: "default value",
      gid: "test_group",
    },
  },
  styles: {},
  groups: {
    header: {
      name: "headers",
      gid: "parent_group",
      description: "headers of this form",
      array: true,
      default: [
        { port: 587, verify_ssl: [false, false, true, false] },
        { port: 45, verify_ssl: [] },
      ],
    },
    parent_group: {
      description: "parent with description without name",
      gid: "last parent",
      array: false,
    },
    test_group: { name: "test group", target_group: null },
  },
  input: {
    host: "evaaa",
    "last parent": {
      parent_group: {
        header: [{ port: 1000, verify_ssl: [true, false, true] }, {}],
      },
    },
    test_group: { single_field: "group value" },
    single_field:
      "single value should not be seen if target_group of test_group is not null",
  },
};
