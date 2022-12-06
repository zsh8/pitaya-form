import React from "react";
import moment, { Moment } from "moment";
import { DatePicker } from "antd";
import type { FieldProps } from "../..";
import "./DateTimeField.css";

const DateTimeField = (props: FieldProps) => {
  const value =
    typeof props.value === "number"
      ? { value: moment.unix(props.value) }
      : null;

  const pickerMap = {
    days: "date",
    weeks: "week",
    months: "month",
    quarters: "quarter",
    years: "year",
  } as const;

  const formatMap = {
    hours: "HH",
    minutes: "HH:mm",
    seconds: "HH:mm:ss",
    milliseconds: "HH:mm:ss.SSS",
    microseconds: "HH:mm:ss.SSSSSS",
  } as const;

  const precision = props.options?.precision || "seconds"; // default precision if not exist

  let picker: typeof pickerMap[keyof typeof pickerMap] = "date";
  if (precision in pickerMap)
    picker = pickerMap[precision as keyof typeof pickerMap];

  let showTime: boolean | { format: string } = false;
  if (precision in formatMap)
    showTime = { format: formatMap[precision as keyof typeof formatMap] };

  let dateTimeFormat: { format: string } | null = null;
  const dateFormat = "YYYY-MM-DD";

  if (showTime)
    // adding fraction of a second to string representation
    // to enable editing fraction of a second
    dateTimeFormat = {
      format: `${dateFormat} ${showTime.format}`,
    };

  const handleChange = (dateTime: Moment | null, dateString: string) => {
    let value: number | null = null;
    if (dateTime) value = dateTime.unix() + dateTime.milliseconds() / 1000;
    props.onChange(value);
  };

  return (
    // TODO: add jalali DatePicker
    <DatePicker
      {...value}
      {...dateTimeFormat}
      picker={picker}
      showTime={showTime}
      onChange={handleChange}
      onBlur={props.onBlur}
    />
  );
};

export default DateTimeField;
