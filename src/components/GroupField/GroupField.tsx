import React from "react";
import { Button, Card, Col, Form, Row, Space, Tooltip } from "antd";
import "./GroupField.css";
import { RawGroupProps } from "../Form";
import SimpleField from "../SimpleField";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

export interface GroupProps extends RawGroupProps {
  fieldKey: string;
  childrenMap: any;
  getFormFieldValue: any;
  setFormFieldValue: any;
  parentPath: string[];
  parentName?: string[];
}

const GroupField = (props: GroupProps) => {
  let {
    array,
    default: rawDefault,
    order,
    description,
    getFormFieldValue,
    setFormFieldValue,
    parentPath,
    parentName = parentPath,
  } = props;

  let groupDefault: object[] = Array.isArray(rawDefault) ? rawDefault : [];

  let title = {};
  if (props.name || description) {
    const tooltipTitle = description ? { title: description } : {};
    title = {
      title: <Tooltip {...tooltipTitle}>{props.name}</Tooltip>,
    };
  }

  interface ChangeAction {
    type: "clone" | "remove" | "update";
    index?: number;
    updates?: any;
  }
  let dataModelPath: any =
    props.target_group === null
      ? [...parentPath]
      : props.target_group === undefined
      ? [...parentPath, props.fieldKey]
      : [...parentPath, props.target_group];

  if (
    array &&
    getFormFieldValue(dataModelPath) === undefined &&
    groupDefault !== undefined
  ) {
    setFormFieldValue(dataModelPath, groupDefault);
  }

  let groupName =
    props.target_group === null
      ? [...parentName]
      : props.target_group === undefined
      ? [...parentName, props.fieldKey]
      : [...parentName, props.target_group];

  function makeChildren(listItemName?: any) {
    let children = [];
    for (const [key, fieldProps] of props.childrenMap) {
      let childProps = { ...fieldProps };
      childProps.parentPath = array
        ? [...dataModelPath, listItemName]
        : dataModelPath;
      childProps.parentName = array ? [listItemName] : [...groupName];

      let childIsSimple = key.startsWith("simple_");

      if (childIsSimple) {
        children.push(
          <SimpleField key={childProps.fieldKey} {...childProps} />
        );
      } else {
        children.push(
          <GroupField key={childProps.fieldKey} {...childProps}></GroupField>
        );
      }
    }

    return children.map((child, index) => (
      <Col key={index} order={Number(child.props.order) || 0}>
        {child}
      </Col>
    ));
  }
  return array ? (
    <Form.List name={groupName}>
      {(fields, { add, remove }) => (
        <>
          {fields.map((field) => (
            <Space
              key={field.key}
              style={{ display: "flex", marginBottom: 2 }}
              align="start">
              <Card {...title}>
                <Row gutter={[16, 8]}>{makeChildren(field.name)}</Row>
              </Card>

              <MinusCircleOutlined onClick={() => remove(field.name)} />
            </Space>
          ))}
          <Form.Item>
            <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
              {`Add ${props.name || props.fieldKey}`}
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  ) : (
    <Card {...title}>{makeChildren()}</Card>
  );
};

export default GroupField;
