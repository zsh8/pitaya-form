import React, { useReducer } from "react";
import { Button, Col, Form, Row } from "antd";
import GroupField from "../GroupField";
import SimpleField from "../SimpleField";
import "antd/dist/antd.css";
import "./Form.css";
import { defaultValidateMessages } from "../../utils";

const jsonPath = require("jsonpath");

export interface PitayaFormProps {
  /**
   * Version of PitayaForm specification
   */
  version: string;
  /**
   * An object which defines the fields of the PitayaForm
   * each key of this object corresponds to one field
   */
  form: { [key: string]: any };
  /**
   * Optional object in which keys are references to
   * fields and groups and values are objects that
   * add styles to the reference
   */
  styles?: object;
  /**
   * An object that each key defines a logical group
   * for changing the appearance of fields that share
   * a group key in thier gid attribute
   */
  groups?: { [key: string]: RawGroupProps };
  /**
   * An object containing actions that cab be used
   * as fields or groups events
   */
  actions?: { [key: string]: ActionProps[] };
  /**
   * Target data model according to the current
   * entered values by the user
   */
  input?: { [key: string]: any };
  /**
   * A function that will be balled by form submission
   */
  submit?: (values: any) => any;
  /**
   * A piece of javascript code that could be used in
   * actions
   */
  js?: string;
}

const EventsMap = { click: "onClick", change: "onChange" } as const;

export interface RawGroupProps {
  name?: string;
  description?: string;
  target_group?: string | null;
  default?: object[];
  gid?: string;
  array?: boolean;
  order?: number;
  events?: { [key in keyof typeof EventsMap]?: string[] };
}

type ActionKey = "remove" | "update" | "rpc" | "modal" | "submit";

type ActionProps = {
  [key in ActionKey]?: object;
};

type RPCType = "http_rest" | "grpc" | "soap" | "js";

type ArgSpec = {
  mode?: "value" | "document_reference";
  type?: string;
  value?: any;
  reference?: any;
};

interface RPCSpec {
  type: RPCType;
  name: string;
  options?: object;
  async?: boolean;
  arguments?: { [key: string]: ArgSpec };
  on_failure?: string[];
}

function makeJsFunctions(jsCode: string) {
  try {
    eval?.(jsCode);
  } catch (error) {}
}

/**
 * Renders a PitayaForm with specification defined by properties
 * @param props specification of form
 * @returns an antd Form component
 */
const PitayaForm: React.FC<PitayaFormProps> = (props: PitayaFormProps) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    // Preventing the page from reloading
    console.log(values);
  };

  const initialInput = props.input || {};

  const [state, dispatch] = useReducer(
    (state: PitayaFormProps, newState: Partial<PitayaFormProps>) => {
      return { ...state, ...newState };
    },
    { ...props }
  );

  makeJsFunctions(state.js || "");

  const actionsMap = createActionFunctionsMap();

  function makeActionFunctions(actionKey: ActionKey, actionSpec: object) {
    switch (actionKey) {
      case "rpc":
        return makeRPCFunction(actionSpec as RPCSpec);
    }
    return () => null;
  }

  function makeRPCFunction(rpcSpec: RPCSpec) {
    let rpcFunction = () => [];

    switch (rpcSpec.type) {
      case "js":
        rpcFunction = () =>
          (window as any)[rpcSpec.name](makeArguments(rpcSpec.arguments || {}));

        break;
    }
    return () => {
      let resultActions: (() => any)[] = [];
      try {
        let actionSpecList = rpcFunction();
        resultActions = convertActionsToFunctions(actionSpecList);
      } catch (error) {
        let actionNames = rpcSpec.on_failure || [];
        if (Array.isArray(actionNames)) {
          for (const act of actionNames) {
            if (act in actionsMap) {
              resultActions.push(...actionsMap[act]);
            }
          }
        }
      }

      for (const actFunc of resultActions) {
        actFunc();
      }
    };
  }

  function makeArguments(argsSpec: { [key: string]: ArgSpec }) {
    const args: { [key: string]: any } = {};
    for (const [argName, argSpec] of Object.entries(argsSpec)) {
      let value: any = argSpec.value;
      const argMode = argSpec.mode || "value";
      const argType = argSpec.type || "simple";

      switch (argMode) {
        case "value": {
          switch (argType) {
            case "simple": {
              value = argSpec.value;
              break;
            }
          }
          break;
        }
        case "document_reference":
          {
            switch (argType) {
              case "jsonpath": {
                const path = String(argSpec.reference);
                const currentState = {
                  ...state,
                  input: form.getFieldsValue(true),
                };
                let queryResult = jsonPath.query(currentState, path);

                value = queryResult.length > 0 ? queryResult[0] : null;
              }
            }
          }
          break;
      }
      args[argName] = value;
    }

    return args;
  }

  function createActionFunctionsMap() {
    const actionsDict: { [key: string]: (() => any)[] } = {};
    for (const [actionKey, actionSpecList] of Object.entries(
      state.actions || {}
    )) {
      actionsDict[actionKey] = convertActionsToFunctions(
        actionSpecList as ActionProps[]
      );
    }
    return actionsDict;
  }

  function convertActionsToFunctions(actionSpecList: ActionProps[]) {
    if (!Array.isArray(actionSpecList)) return [];

    const actionFunctions = [];
    for (const actionSpecItem of actionSpecList) {
      for (const [subActionKey, subActionSpec] of Object.entries(
        actionSpecItem || {}
      )) {
        actionFunctions.push(
          makeActionFunctions(subActionKey as ActionKey, subActionSpec)
        );
      }
    }
    return actionFunctions;
  }

  const rootGroup = "_root";
  const formSpec = state.form || {};
  const groupsSpec = state.groups || {};

  const dataModelRoot = groupsSpec[rootGroup]?.target_group;
  const formPath = dataModelRoot ? [dataModelRoot] : [];
  let formChildrenMap = new Map<string, any>();

  for (const jsonKey in formSpec) {
    const { gid = rootGroup, events = {}, ...fieldProps } = formSpec[jsonKey];
    const fieldEvents: { [key: string]: () => any } = {};
    for (const eventKey in events) {
      const eventActions: (() => any)[] = [];
      for (const act of events[eventKey]) {
        if (act in actionsMap) {
          eventActions.push(...actionsMap[act]);
        }
      }
      fieldEvents[EventsMap[eventKey as keyof typeof EventsMap] || "onClick"] =
        () => {
          for (const actFunc of eventActions) {
            actFunc();
          }
        };
    }
    fieldProps.jsonKey = jsonKey;
    fieldProps.parentPath = formPath;
    fieldProps.events = fieldEvents;

    let currentGid: string = gid;
    let groupStack = [];
    // add all parent groups of the field to the groupStack
    while (currentGid !== rootGroup) {
      groupStack.push(currentGid);
      currentGid = groupsSpec[currentGid]?.gid || rootGroup;
    }
    // set the form children as the default parent children of the current field
    let parentChildren: Map<string, any> = formChildrenMap;
    while (groupStack.length > 0) {
      currentGid = groupStack.pop() || "";
      if (!parentChildren.has(`group_${currentGid}`)) {
        // create the new group properties by groups specification
        const { gid: groupGid = rootGroup, ...otherProps } =
          currentGid in groupsSpec
            ? groupsSpec[currentGid] || {}
            : // non-existent group means no change in data model
              { target_group: null };
        const groupProps: any = { ...otherProps };
        groupProps.jsonKey = currentGid;
        if (groupGid === rootGroup) groupProps.parentPath = formPath;

        groupProps.childrenMap = new Map<string, any>();
        // add the new group properties to the parent children
        parentChildren.set(`group_${currentGid}`, groupProps);
        // set the new group children as the parent children of the current field
        parentChildren = groupProps.childrenMap;
      } else {
        // set the existent group children as the parent children of the current field
        parentChildren = parentChildren.get(`group_${currentGid}`).childrenMap;
      }
    }
    // add the current field properties as a child to the parent children
    parentChildren.set(`simple_${jsonKey}`, fieldProps);
  }

  // make the form fields or groups from the form children map based
  // on the distinctive keys of the children map
  let formChildren = [];
  for (const [key, fieldProps] of formChildrenMap) {
    if (key.startsWith("simple_")) {
      formChildren.push(
        <SimpleField key={fieldProps.jsonKey} {...fieldProps} />
      );
    } else {
      formChildren.push(
        <GroupField key={fieldProps.jsonKey} {...fieldProps}></GroupField>
      );
    }
  }

  return (
    <>
      <Form
        form={form}
        initialValues={initialInput}
        layout={"vertical"}
        colon={false}
        validateMessages={defaultValidateMessages}
        onFinish={props.submit || handleSubmit}>
        <Row>
          {formChildren.map((formChild, index) => (
            <Col
              key={index}
              order={Number(formChild.props.order) || 0}
              span={24}>
              {formChild}
            </Col>
          ))}
        </Row>
        <Button type="primary" htmlType="submit">
          save
        </Button>
      </Form>
    </>
  );
};

export default PitayaForm;
