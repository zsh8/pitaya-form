import { Tooltip, Select, TreeSelect } from "antd";
import React, { ReactNode } from "react";
import type { FieldProps } from "../..";
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

function makeTreeData(
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
      children: makeTreeData(choices[key].choices || {}, selectable_parents),
    };
    // if selectable_parents is false set selectable to false for parent nodes
    if (!selectable_parents && treeNode.children.length > 0)
      treeNode.selectable = false;
    treeData.push(treeNode);
  }
  return treeData;
}

function makeSelectOptions(
  choices: {
    [key: string | number]: OptionDetails;
  },
  level: number = 0
): object[] {
  let optionsData = [];
  for (const key in choices) {
    let option: {
      value: string;
      label?: ReactNode;
      options?: object[];
    } = {
      value: key,
      label: (
        <Tooltip title={choices[key].description}>{choices[key].name}</Tooltip>
      ),
    };
    // Select supports just one level of nested options
    if (level === 0) {
      const nestedOptions = makeSelectOptions(choices[key].choices || {}, 1);
      if (nestedOptions.length > 0) {
        option["options"] = nestedOptions;
      }
    }
    optionsData.push(option);
  }
  return optionsData;
}

const ChoicesField = (props: FieldProps) => {
  let value = props.value;

  const {
    choices = {},
    multiple = false,
    arbitrary_entry_prefix: arbitraryEntryPrefix = null,
    selectable_parents: selectableParents = false,
  } = props.options;

  // TODO: add arbitrary_entry_prefix to user input options
  const handleChange = (value: any) => {
    props.onChange(value);
    props.onBlur(value);
  };

  const {
    onChange: onChangeEvent,
    onBlur: onBlurEvent,
    ...events
  }: { [key: string]: (...args: any[]) => void } = {
    ...props.events,
  };

  events["onChange"] = (value: any) => {
    handleChange(value);
    onChangeEvent?.();
  };

  events["onBlur"] = (value: any) => {
    props.onBlur(value);
    onBlurEvent?.();
  };

  const commonProps = {
    value: value,
    showSearch: true,
    allowClear: true,
    dropdownStyle: { maxHeight: 400, overflow: "auto" },
    dropdownMatchSelectWidth: false,
    placeholder: "Please select",
    ...events,
  };

  return arbitraryEntryPrefix !== null && multiple ? (
    <Select
      mode="tags"
      options={makeSelectOptions(choices)}
      optionFilterProp="label"
      filterOption={(inputValue: string, option: any) => {
        const filterValue =
          typeof option.label === "object"
            ? option.label.props.children
            : option.label;

        return filterValue.match(new RegExp(inputValue, "i"));
      }}
      {...commonProps}
    />
  ) : (
    <TreeSelect
      multiple={multiple}
      treeData={makeTreeData(choices, selectableParents)}
      treeNodeFilterProp="title"
      // search on tree nodes base on titles instead of value
      filterTreeNode={(inputValue: string, treeNode: any) => {
        return treeNode.title.props.children.match(new RegExp(inputValue, "i"));
      }}
      treeDefaultExpandAll
      {...commonProps}
    />
  );
};

export default ChoicesField;
