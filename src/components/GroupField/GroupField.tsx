import React from "react";
import { Button, Card, Col, Form, Row, Space, Tooltip } from "antd";
import "./GroupField.css";
import type { RawGroupProps } from "../Form";
import SimpleField from "../SimpleField";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

export interface GroupProps extends RawGroupProps {
  jsonKey: string;
  childrenMap: any;
  parentPath: string[];
}

/**
 * Renders a group of fields inside a group component
 * @param props all properties to define a group header and content
 * @returns Form.List or Card component
 */
const GroupField: React.FC<GroupProps> = (props: GroupProps) => {
  let {
    array,
    default: groupDefault = [],
    order,
    description,
    parentPath,
  } = props;

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

  // used as name property of Form.List component for initializing value
  // from form initialValue and setting value after calling onChange
  let groupPath =
    props.target_group === null // null target group indicates no change in data model path
      ? [...parentPath]
      : props.target_group === undefined
      ? [...parentPath, props.jsonKey]
      : [...parentPath, props.target_group];

  /**
   * Renders fields or groups inside the current group based on
   * the distinctive keys of the children map
   * @param listItemName required only for array groups for naming sub fields or groups
   * @returns a Row component containing each child of the group as a Col
   */
  function makeChildren(listItemName?: any) {
    let children = [];
    for (const [key, fieldProps] of props.childrenMap) {
      let childProps = { ...fieldProps };
      // set parent path for naming the sub field or group in the form
      childProps.parentPath = array ? [listItemName] : [...groupPath];

      let childIsSimple = key.startsWith("simple_");

      if (childIsSimple) {
        children.push(<SimpleField key={childProps.jsonKey} {...childProps} />);
      } else {
        children.push(
          <GroupField key={childProps.jsonKey} {...childProps}></GroupField>
        );
      }
    }

    return (
      <Row gutter={[16, 8]}>
        {children.map((child, index) => (
          <Col key={index} order={Number(child.props.order) || 0}>
            {child}
          </Col>
        ))}
      </Row>
    );
  }
  return array ? (
    <Form.List name={groupPath} initialValue={groupDefault}>
      {(fields, { add, remove }) => (
        <>
          {fields.map((field) => (
            <Space
              key={field.key}
              style={{ display: "flex", marginBottom: 2 }}
              align="start">
              <Card {...title}>{makeChildren(field.name)}</Card>

              <MinusCircleOutlined onClick={() => remove(field.name)} />
            </Space>
          ))}
          <Form.Item>
            <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
              {`Add ${props.name || props.jsonKey}`}
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
