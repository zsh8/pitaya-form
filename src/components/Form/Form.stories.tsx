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

export const actionForm = Template.bind({});
actionForm.args = {
  form: {
    country: {
      name: "Countries",
      type: "Choices",
      options: {
        choices: {
          iran: { name: "Iran" },
          afghanistan: { name: "Afghanistan" },
        },
        multiple: true,
      },
      events: {
        change: ["update_cities"],
      },
      gid: "address",
    },
    city: {
      name: "Cities",
      type: "Choices",
      options: {
        choices: {
          tehran: { name: "Tehran" },
          esfahan: { name: "Esfahan" },
        },
      },
      gid: "address",
    },
  },
  groups: {
    address: { array: false },
  },
  actions: {
    update_cities: [
      {
        rpc: {
          type: "js",
          name: "get_cities",
          arguments: {
            countries: {
              mode: "document_reference",
              type: "jsonpath",
              reference: "input.address.country",
            },
          },
        },
      },
    ],
  },

  js: 'function get_cities({countries}) { return [{"update": {"input":{"address":{"city": (countries[0]==="iran")?"tehran":(countries[0]==="afghanistan")?"kabul":null}}, "form": {"city": {"options": {"choices": Object.assign({}, ...countries.map(country => ({"iran": {         "tehran": {"name": "Tehran"}, "esfahan": {"name": "Esfahan"}}, "afghanistan": {  "kabul": {"name": "Kabul"}, "herat": {"name": "Herat"}}}[country])))}}}}}];}',
};

export const HelloWorld = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
HelloWorld.args = {
  version: "1",
  form: {
    device_name: {
      name: "Device Name direct child of form",
      type: "Boolean",
      order: 5,
      default: null,
      options: { validators: [{ allow_null: false }] },
    },
    text_field: {
      name: "text direct child of form",
      default: null,
      order: -1,
      options: {
        validators: [{ hostname: true }],
      },
    },

    port: {
      name: "port child of headers",
      description: "port of server",
      long_description: "if server has port",
      type: "Number",
      default: null,
      gid: "header",
      options: { validators: [{ min: 600 }] },
      events: {},
      order: 1,
    },
    host: {
      name: "array host",
      description: "host name of server",
      long_description: "this is the host name of the server",
      type: "String",
      default: ["server 1"],
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
      options: {},
      events: {},
    },
    number_test: {
      name: "number test child of form and array",
      description: "number description",
      long_description: "enter the test number value",
      type: "Number",
      array: true,
      default: [-1, 5],
      options: { signed: false, float: true, validators: [{ min: 12 }] },
      events: {},
      order: 4,
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
      name: null,
      description: "your first name is more than 120 ",
      long_description:
        "a very long description that should be shown anyway without trimming and it is the first name of the parent group that should be beside the headers group list. it has a farsi default value, but if input value is shown it has input value too",
      default: "\u06cc\u06a9 \u0631\u0634\u062a\u0647",
      array: false,
      gid: "parent_group",
      // TODO: negative order inside group does not work
      order: -1,
      options: { validators: [{ max: 5 }, { allow_whitespace: false }] },
      events: {},
    },
    single_field: {
      default: "default value child of test group and single",
      gid: "null_group",
    },
    protocol: {
      name: "protocol",
      description: "protocol of server",
      long_description: "if server has protocol",
      type: "Choices",
      default: ["tcp"],
      gid: "header",
      options: {
        choices: {
          ip: {
            name: "Internet Protocol",
            description: "version 4",
            choices: {
              tcp: {
                name: "Transmission Control",
                description: "control transmission",
                choices: {
                  http: {
                    name: "Hypertext Transfer",
                    description: "http description",
                  },
                  dns: {
                    name: "Domain Name System",
                    description: "dns description",
                  },
                },
              },
              udp: { name: "User Datagram" },
            },
          },
          icmp: {
            name: "Internet Control Message Protocol",
            description: "icmp description",
          },
        },
        selectable_parents: true,
        multiple: true,
      },
      events: {},
      order: 1,
    },
    time_field: {
      name: "date time",
      type: "DateTime",
      default: 1647249721,
      options: {
        precision: "milliseconds",
      },
    },
    file_field: {
      name: "attachments",
      type: "File",
      array: true,
      order: 0,
      options: { multiple: true, validators: [{ min: 2 }] },
      gid: "header",
      default: [
        [
          {
            filename: "eeee",
            "content-url":
              "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
          },
        ],
      ],
    },
    test_label: {
      name: "just label",
      type: "Label",
      array: true,
      order: 0,
      options: {},
      gid: "parent_group",
    },
    password_field: {
      name: "password",
      type: "Password",
      order: 0,
      options: {},
      default: "abced",
      gid: "header",
    },
    binary_field: {
      name: "binary value",
      type: "Binary",
      options: { validators: [{ allow_null: true }] },
      default: "",
    },
    duration_field: {
      name: "duration",
      type: "Duration",
      options: { validators: [{ min: 10, max: 1000 }] },
      default: 604800,
    },
    hostname_field: {
      name: "host name",
      type: "Hostname",
      options: {},
      default: null,
      gid: "header",
    },
    submit_field: {
      name: "add options",
      type: "Submit",
      options: {},
      default: null,
    },
  },
  styles: {},
  groups: {
    header: {
      name: "array header child of parent group",
      gid: "parent_group",
      description: "headers of this form",
      array: true,
      default: [{ port: 587, verify_ssl: [null, false, true, false] }, {}],
    },
    parent_group: {
      description: "parent with description without name",
      gid: "non_existent_group",
      array: true,
    },
    null_group: { name: "group with null target", target_group: null },
    array_group: {
      name: "array group",
      array: true,
      default: [{ single_number: 66 }],
      order: 4,
    },
    _root: { target_group: "main" },
  },
  input: {
    main: {
      host: ["input host value"],
      parent_group: [{ first_name: "input name value" }],
      null_group: { single_field: "input value inside group" },
      array_group: [{ single_number: 9999 }, { single_number: 2222 }],
      single_field: "input value with null target group",
    },
  },
};
