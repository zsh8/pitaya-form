import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import SubmitField from "./SubmitField";

export default {
  title: "PitayaForm/SubmitField",
  component: SubmitField,
} as ComponentMeta<typeof SubmitField>;

const Template: ComponentStory<typeof SubmitField> = (args) => (
  <SubmitField {...args} />
);

// Primary
export const Primary = Template.bind({});
Primary.args = {
  jsonKey: "submit_field",
};

export const SubmitFieldWithOptions = Template.bind({});
SubmitFieldWithOptions.args = {
  jsonKey: "add_options",
  name: "add options",
  options: {},
  events: {},
};
