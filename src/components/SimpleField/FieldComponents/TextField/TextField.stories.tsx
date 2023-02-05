import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import TextField from "./TextField";

export default {
  title: "PitayaForm/TextField",
  component: TextField,
} as ComponentMeta<typeof TextField>;

const Template: ComponentStory<typeof TextField> = (args) => (
  <TextField {...args} />
);

// Primary
export const Primary = Template.bind({});
Primary.args = {
  jsonKey: "text_field",
  options: {},
};

export const TextFieldWithOptions = Template.bind({});
TextFieldWithOptions.args = {
  jsonKey: "first_name",
  name: "first name",
  default: "\u06cc\u06a9 \u0631\u0634\u062a\u0647",
  options: {},
  events: {},
};
