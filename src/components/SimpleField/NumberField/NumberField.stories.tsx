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
  field_key: "number_field",
  default: null,
  options: {},
  events: {},
};

export const NumberFieldWithOptions = Template.bind({});
NumberFieldWithOptions.args = {
  field_key: "port",
  name: "port",
  description: "port of source",
  long_description: "enter the port of source",
  default: 12,
  options: { signed: true, float: true },
  events: {},
};
