import { Tooltip, TreeSelect } from "antd";
import React, { ReactNode } from "react";
import { FieldProps } from "..";
import "./ChoicesField.css";

interface OptionDetails {
  name: string;
  description?: string;
  // TODO: use icon property
  icon?: string;
  choices?: {
    [key: string | number]: OptionDetails;
  };
}

function makeOptions(
  choices: {
    [key: string | number]: OptionDetails;
  },
  selectable_parents: boolean
): object[] {
  let treeData = [];
  for (const key in choices) {
    let treeNode: {
      value: string;
      title?: ReactNode;
      children: object[];
      selectable?: boolean;
    } = {
      value: key,
      title: (
        <Tooltip title={choices[key].description}>{choices[key].name}</Tooltip>
      ),
      children: makeOptions(choices[key].choices || {}, selectable_parents),
    };
    // if selectable_parents is false set selectable to false for parent nodes
    if (!selectable_parents && treeNode.children.length > 0)
      treeNode.selectable = false;
    treeData.push(treeNode);
  }
  return treeData;
}

const ChoicesField = (props: FieldProps) => {
  let value = props.value;

  const choices: {
    [key: string | number]: OptionDetails;
  } = props.options?.choices || {};

  let treeData = makeOptions(
    choices,
    props.options?.selectable_parents || false
  );

  // TODO: implement arbitrary_entry_prefix to add user input options
  // useful link https://codesandbox.io/s/antd-select-add-option-cr6ii?file=/index.js:307-316

  const handleChange = (value: any) => {
    props.onChange(value);
    props.onBlur(value);
  };

  return (
    <TreeSelect
      value={value}
      multiple={props.options?.multiple || false}
      showSearch
      allowClear
      treeData={treeData}
      treeNodeFilterProp="title"
      // search on tree nodes base on titles instead of value
      filterTreeNode={(inputValue: string, treeNode: any) => {
        return treeNode.title.props.children.match(new RegExp(inputValue, "i"));
      }}
      treeDefaultExpandAll
      dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
      dropdownMatchSelectWidth={false}
      placeholder="Please select"
      onChange={handleChange}
      onBlur={props.onBlur}
    />
  );
};

export default ChoicesField;
