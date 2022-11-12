import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import FileField from "./FileField";

export default {
  title: "PitayaForm/FileField",
  component: FileField,
} as ComponentMeta<typeof FileField>;

const Template: ComponentStory<typeof FileField> = (args) => (
  <FileField {...args} />
);

export const FileFieldWithOptions = Template.bind({});
FileFieldWithOptions.args = {
  fieldKey: "file",
  name: "attachments",
  default: false,
  options: {},
  events: {},
};
