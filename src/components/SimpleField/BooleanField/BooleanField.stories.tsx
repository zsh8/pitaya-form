import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import BooleanField from "./BooleanField";

export default {
  title: "PitayaForm/BooleanField",
  component: BooleanField,
} as ComponentMeta<typeof BooleanField>;

const Template: ComponentStory<typeof BooleanField> = (args) => (
  <BooleanField {...args} />
);

// Primary
export const Primary = Template.bind({});
Primary.args = {
  fieldKey: "boolean_field",
};

export const BooleanFieldWithOptions = Template.bind({});
BooleanFieldWithOptions.args = {
  fieldKey: "verify_ssl",
  name: "verify ssl",
  default: false,
  options: {},
  events: {},
};
