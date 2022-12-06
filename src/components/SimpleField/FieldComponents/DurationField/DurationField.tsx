import React from "react";
import { Col, Row, InputNumber, Slider } from "antd";
import type { FieldProps } from "../..";
import "./DurationField.css";

const DurationField = (props: FieldProps) => {
  let initialSeconds = parseInt(props.value);
  if (isNaN(initialSeconds) || initialSeconds < 0) initialSeconds = 0;

  const initialValue = {
    seconds: initialSeconds % 60,
    minutes: Math.floor((initialSeconds % 3600) / 60),
    hours: Math.floor((initialSeconds % 86400) / 3600),
    days: Math.floor(initialSeconds / 86400),
  };

  const handleChange = (
    precision: string,
    value: any,
    validate: boolean = false
  ) => {
    let newValue = initialValue;
    value = parseInt(value) || 0;
    switch (precision) {
      case "SECONDS":
        newValue = { ...initialValue, seconds: value };
        break;
      case "MINUTES":
        newValue = { ...initialValue, minutes: value };
        break;
      case "HOURS":
        newValue = { ...initialValue, hours: value };
        break;
      case "DAYS":
        newValue = { ...initialValue, days: value };
        break;
    }
    const newSeconds = totalSeconds(newValue);
    props.onChange(newSeconds);
    if (validate) props.onBlur(newSeconds);
  };

  const totalSeconds = (value: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }) => {
    return (
      value.days * 86400 +
      value.hours * 3600 +
      value.minutes * 60 +
      value.seconds
    );
  };

  // sliders are used as uncontrolled components to update the form data model
  // only after "onmouseup" event, not during sliding
  return (
    <>
      <Row gutter={8}>
        <Col span={2}>
          <label>Days</label>
        </Col>
        {/* key is used to enforce re-rendering after changeing initial value */}
        <Col span={12} key={initialValue.days}>
          <Slider
            min={0}
            max={8000}
            defaultValue={initialValue.days}
            onAfterChange={(value: number) => handleChange("DAYS", value, true)}
          />
        </Col>
        <Col span={4}>
          <InputNumber
            min={0}
            max={8000}
            value={initialValue.days}
            onChange={(value: number | null) => handleChange("DAYS", value)}
            onBlur={props.onBlur}
          />
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={2}>
          <label>Hours</label>
        </Col>
        <Col span={12} key={initialValue.hours}>
          <Slider
            min={0}
            max={23}
            defaultValue={initialValue.hours}
            onAfterChange={(value: number) =>
              handleChange("HOURS", value, true)
            }
          />
        </Col>
        <Col span={4}>
          <InputNumber
            min={0}
            max={23}
            value={initialValue.hours}
            onChange={(value: number | null) => handleChange("HOURS", value)}
            onBlur={props.onBlur}
          />
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={2}>
          <label>Minutes</label>
        </Col>
        <Col span={12} key={initialValue.minutes}>
          <Slider
            min={0}
            max={59}
            defaultValue={initialValue.minutes}
            onAfterChange={(value: number) =>
              handleChange("MINUTES", value, true)
            }
          />
        </Col>
        <Col span={4}>
          <InputNumber
            min={0}
            max={59}
            value={initialValue.minutes}
            onChange={(value: number | null) => handleChange("MINUTES", value)}
            onBlur={props.onBlur}
          />
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={2}>
          <label>Seconds</label>
        </Col>
        <Col span={12} key={initialValue.seconds}>
          <Slider
            min={0}
            max={59}
            defaultValue={initialValue.seconds}
            onAfterChange={(value: number) =>
              handleChange("SECONDS", value, true)
            }
          />
        </Col>
        <Col span={4}>
          <InputNumber
            min={0}
            max={59}
            value={initialValue.seconds}
            onChange={(value: number | null) => handleChange("SECONDS", value)}
            onBlur={props.onBlur}
          />
        </Col>
      </Row>
    </>
  );
};

export default DurationField;
