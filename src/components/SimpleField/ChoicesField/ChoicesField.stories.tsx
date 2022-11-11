import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import ChoicesField from "./ChoicesField";

export default {
  title: "PitayaForm/ChoicesField",
  component: ChoicesField,
} as ComponentMeta<typeof ChoicesField>;

const Template: ComponentStory<typeof ChoicesField> = (args) => (
  <ChoicesField {...args} />
);

// Primary
export const Primary = Template.bind({});
Primary.args = {
  fieldKey: "choices_field",
};

export const ChoicesFieldWithOptions = Template.bind({});
ChoicesFieldWithOptions.args = {
  fieldKey: "protocol",
  name: "protocol ssl",
  default: false,
  options: {},
  events: {},
};
