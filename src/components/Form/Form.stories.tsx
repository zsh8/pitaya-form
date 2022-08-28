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
      default: true,
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
      options: { signed: true, float: true },
      events: {},
    },
    first_name: {
      name: "first name",
      description: "your first name",
      long_description: "enter your first name",
      default: "\u06cc\u06a9 \u0631\u0634\u062a\u0647",
      options: {},
      events: {},
    },
  },
  styles: {},
  groups: { header: {} },
};
