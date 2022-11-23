import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import PasswordField from "./PasswordField";

export default {
  title: "PitayaForm/PasswordField",
  component: PasswordField,
} as ComponentMeta<typeof PasswordField>;

const Template: ComponentStory<typeof PasswordField> = (args) => (
  <PasswordField {...args} />
);

// Primary
export const Primary = Template.bind({});
Primary.args = {
  jsonKey: "password_field",
};

export const PasswordFieldWithOptions = Template.bind({});
PasswordFieldWithOptions.args = {
  jsonKey: "password",
  name: "password",
  default: false,
  options: {},
  events: {},
};
