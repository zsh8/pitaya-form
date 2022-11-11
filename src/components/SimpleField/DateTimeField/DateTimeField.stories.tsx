import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import DateTimeField from "./DateTimeField";

export default {
  title: "PitayaForm/DateTimeField",
  component: DateTimeField,
} as ComponentMeta<typeof DateTimeField>;

const Template: ComponentStory<typeof DateTimeField> = (args) => (
  <DateTimeField {...args} />
);

// Primary
export const Primary = Template.bind({});
Primary.args = {
  fieldKey: "datetime_field",
};

export const DateTimeFieldYearsPrecision = Template.bind({});
DateTimeFieldYearsPrecision.args = {
  fieldKey: "datetime_field",
  value: 1647249721.123456,
  options: { precision: "years" },
};
export const DateTimeFieldQuartersPrecision = Template.bind({});
DateTimeFieldQuartersPrecision.args = {
  fieldKey: "datetime_field",
  value: 1647249721.123456,
  options: { precision: "quarters" },
};

export const DateTimeFieldMonthsPrecision = Template.bind({});
DateTimeFieldMonthsPrecision.args = {
  fieldKey: "datetime_field",
  value: 1647249721.123456,
  options: { precision: "months" },
};

export const DateTimeFieldWeeksPrecision = Template.bind({});
DateTimeFieldWeeksPrecision.args = {
  fieldKey: "datetime_field",
  value: 1647249721.123456,
  options: { precision: "weeks" },
};

export const DateTimeFieldDaysPrecision = Template.bind({});
DateTimeFieldDaysPrecision.args = {
  fieldKey: "datetime_field",
  value: 1647249721.123456,
  options: { precision: "days" },
};

export const DateTimeFieldHoursPrecision = Template.bind({});
DateTimeFieldHoursPrecision.args = {
  fieldKey: "datetime_field",
  value: 1647249721.123456,
  options: { precision: "hours" },
};

export const DateTimeFieldMinutesPrecision = Template.bind({});
DateTimeFieldMinutesPrecision.args = {
  fieldKey: "datetime_field",
  value: 1647249721.123456,
  options: { precision: "minutes" },
};

export const DateTimeFieldSecondsPrecision = Template.bind({});
DateTimeFieldSecondsPrecision.args = {
  fieldKey: "datetime_field",
  value: 1647249721.123456,
  options: { precision: "seconds" },
};

export const DateTimeFieldMillisecondsPrecision = Template.bind({});
DateTimeFieldMillisecondsPrecision.args = {
  fieldKey: "datetime_field",
  value: 1647249721.123456,
  options: { precision: "milliseconds" },
};

export const DateTimeFieldMicrosecondsPrecision = Template.bind({});
DateTimeFieldMicrosecondsPrecision.args = {
  fieldKey: "datetime_field",
  value: 1647249721.123456,
  options: { precision: "microseconds" },
};
