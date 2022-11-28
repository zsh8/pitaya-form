import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import NumberField from "./NumberField";

export default {
  title: "PitayaForm/NumberField",
  component: NumberField,
} as ComponentMeta<typeof NumberField>;

const Template: ComponentStory<typeof NumberField> = (args) => (
  <NumberField {...args} />
);

// Primary
export const Primary = Template.bind({});
Primary.args = {
  jsonKey: "number_field",
  default: null,
  options: {},
  events: {},
};

export const NumberFieldWithOptions = Template.bind({});
NumberFieldWithOptions.args = {
  jsonKey: "port",
  name: "port",
  default: 12,
  options: { signed: true, float: true },
  events: {},
};
