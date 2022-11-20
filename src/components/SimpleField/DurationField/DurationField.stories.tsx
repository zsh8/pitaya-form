import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import DurationField from "./DurationField";

export default {
  title: "PitayaForm/DurationField",
  component: DurationField,
} as ComponentMeta<typeof DurationField>;

const Template: ComponentStory<typeof DurationField> = (args) => (
  <DurationField {...args} />
);

// Primary
export const Primary = Template.bind({});
Primary.args = {
  fieldKey: "duration_field",
  default: null,
  options: {},
  events: {},
};

export const DurationFieldWithOptions = Template.bind({});
DurationFieldWithOptions.args = {
  fieldKey: "duration",
  name: "duration",
  default: 12000,
  options: {},
  events: {},
};
