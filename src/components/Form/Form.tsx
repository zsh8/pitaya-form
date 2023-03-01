import React, { useReducer, useEffect } from "react";
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
   * A piece of javascript code that could be used in
   * actions
   */
  js?: string;
  /**
   * A function that will be called by form submission
   */
  submit?: (values: any) => any;
  /**
   * Base url for http requests in http_rest type of rpc actions
   */
  base_url?: string;
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
  options?: { [key: string]: string };
  async?: boolean;
  arguments?: { [key: string]: ArgSpec };
  on_failure?: string[];
}

type ModifyActionOptions = { extend_arrays?: boolean };

type ModifyActionSpec = Partial<PitayaFormProps> & ModifyActionOptions;

interface StateSpec extends Omit<PitayaFormProps, "submit" | "input"> {
  actionFunctionsMap: { [key: string]: (() => any)[] };
  inputChangesList: Partial<PitayaFormProps["input"]>[];
  modifyInput: boolean;
  modifyType: "update" | "remove";
  extendArrayInMerge: boolean;
}

type ReducerAction = {
  type: "modify" | "resetInputChanges";
  changes?: Partial<PitayaFormProps>;
  modifyType?: StateSpec["modifyType"];
  extendArrays?: boolean;
};

function makeJsFunctions(jsCode: string) {
  try {
    eval?.(jsCode);
  } catch (error) {
    console.log(error);
  }
}

function isObject(obj: any) {
  return typeof obj === "object" && obj !== null && !Array.isArray(obj);
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

  const initialInput = { ...props.input } || {};

  function initialState() {
    const { input, submit, ...otherProps } = { ...props };
    let initialState: StateSpec = {
      ...otherProps,
      actionFunctionsMap: createActionFunctionsMap(props.actions),
      inputChangesList: [],
      modifyInput: false,
      modifyType: "update",
      extendArrayInMerge: false,
    };
    makeJsFunctions(initialState.js || "");

    return initialState;
  }

  const [state, dispatch] = useReducer(
    (state: StateSpec, action: ReducerAction) => {
      let newState = { ...state };

      switch (action.type) {
        case "resetInputChanges":
          newState.modifyInput = false;
          newState.inputChangesList = [];
          break;
        case "modify":
          newState.modifyType = action.modifyType || "update";
          newState.extendArrayInMerge = action.extendArrays || false;
          const { input: inputChanges, ...otherChanges } = action.changes || {};

          switch (action.modifyType) {
            case "update":
              newState = deepMergeObject(
                newState,
                otherChanges,
                newState.extendArrayInMerge
              );
              break;
            case "remove":
              newState = deepRemoveProperties(newState, otherChanges);
              break;
          }

          if (isObject(inputChanges)) {
            newState.modifyInput = true;
            newState.inputChangesList.push(inputChanges);
          }

          if ("actions" in otherChanges) {
            newState.actionFunctionsMap = createActionFunctionsMap(
              newState.actions
            );
          }

          if ("js" in otherChanges) {
            makeJsFunctions(newState.js || "");
          }
      }

      return newState;
    },
    {},
    () => initialState()
  );

  useEffect(() => {
    if (state.modifyInput) {
      for (const changes of state.inputChangesList) {
        form.setFieldsValue(convertInputChangesToFieldsValue(changes));
      }
      dispatch({ type: "resetInputChanges" });
    }
  });

  function convertInputChangesToFieldsValue(
    inputObj: Partial<PitayaFormProps["input"]>,
    parentNamePath: string[] = []
  ): Partial<PitayaFormProps["input"]> {
    const fieldsValue: Partial<PitayaFormProps["input"]> = {};
    for (const [fieldKey, value] of Object.entries(inputObj as {})) {
      const fieldNamePath = [...parentNamePath, fieldKey];
      if (isObject(value)) {
        if (Object.keys(value as {}).length === 0) {
          if (state.modifyType === "remove") fieldsValue[fieldKey] = null;
        } else {
          fieldsValue[fieldKey] = convertInputChangesToFieldsValue(
            value as {},
            fieldNamePath
          );
        }
      } else {
        if (state.modifyType === "update") {
          // in case of update action
          if (state.extendArrayInMerge && Array.isArray(value)) {
            // if current value is undefined or null
            // replace with an empty array
            const currentValue = form.getFieldValue(fieldNamePath) || [];
            if (Array.isArray(currentValue))
              fieldsValue[fieldKey] = [...currentValue, ...value];
          } else fieldsValue[fieldKey] = value;
        } else {
          // in case of remove action
          if (value === null) {
            fieldsValue[fieldKey] = null;
          } else {
            const currentValue = form.getFieldValue(fieldNamePath);

            if (Array.isArray(currentValue)) {
              // remove the first item of the array with the specified value
              const foundIndex = currentValue.findIndex(
                (element: any) => element === value
              );
              if (foundIndex >= 0) currentValue.splice(foundIndex, 1);
              fieldsValue[fieldKey] = currentValue;
            } else if (currentValue === value) {
              // remove the current key if its value is equal to the specified value
              fieldsValue[fieldKey] = null;
            }
          }
        }
      }
    }
    return fieldsValue;
  }

  function makeActionFunctions(actionKey: ActionKey, actionSpec: object) {
    switch (actionKey) {
      case "rpc":
        return makeRPCFunction(actionSpec as RPCSpec);
      case "update":
      case "remove":
        return makeModifyFunction(actionSpec as ModifyActionSpec, actionKey);
    }
    return () => null;
  }

  function makeModifyFunction(
    modifySpec: ModifyActionSpec,
    actionKey: "remove" | "update"
  ) {
    if (!isObject(modifySpec))
      // if modifySpec is not a real object, then
      // an empty function should be returned
      return () => null;

    const { extend_arrays: extendArrays = false, ...changes } = {
      ...modifySpec,
    };

    return () => {
      dispatch({
        type: "modify",
        modifyType: actionKey,
        changes,
        extendArrays,
      });
    };
  }

  /**
   * This function will accept the two objects as arguments and return the object of deeply
   * merged with nested properties.
   * @param {object} mainObj object containing the properties to be merged with changes.
   * @param {object} changesObj object containing the properties you want to apply.
   * @param {extendArrays} boolean inidcates that in case of array in value, new array should
   * replace or be merged with the old one
   * @return {object} return the deeply merged objects
   */
  function deepMergeObject(
    mainObj: any = {},
    changesObj: any = {},
    extendArrays: boolean
  ) {
    // copy objects to avoid mutation
    mainObj = { ...mainObj };
    changesObj = { ...changesObj };

    // iterating through all the keys of changes object
    Object.keys(changesObj).forEach((key) => {
      if (isObject(changesObj[key])) {
        if (!isObject(mainObj[key])) {
          // if equivalent value in main object is not a real object,
          // then should be replaced with the value in changes object
          mainObj[key] = changesObj[key];
        } else {
          // nested object should be merged
          mainObj[key] = deepMergeObject(
            mainObj[key],
            changesObj[key],
            extendArrays
          );
        }
      } else {
        if (
          extendArrays &&
          Array.isArray(changesObj[key]) &&
          Array.isArray(mainObj[key])
        ) {
          // extend arrays in case of 'true' extendArrays option
          mainObj[key] = [...mainObj[key], ...changesObj[key]];
        }
        // replace key's value in main object for non object values
        else mainObj[key] = changesObj[key];
      }
    });

    return mainObj;
  }

  /**
   * This function will accept the two objects as arguments and return the firest object
   * with deeply removed properties of the second object.
   * @param {object} mainObj main object to apply deep removing properties.
   * @param {object} changesObj object containing the properties you want to remove.
   * @return {object} return the deeply subtracted object
   */
  function deepRemoveProperties(mainObj: any = {}, changesObj: any = {}) {
    // copy objects to avoid mutation
    mainObj = { ...mainObj };
    changesObj = { ...changesObj };

    // iterating through all the keys of changes object
    Object.keys(changesObj).forEach((key) => {
      if (
        changesObj[key] === null ||
        (isObject(changesObj[key]) && Object.keys(changesObj[key]).length === 0)
      ) {
        delete mainObj[key];
      } else {
        if (
          isObject(changesObj[key]) // is not an empty object
        ) {
          if (isObject(mainObj[key])) {
            // main object will be changed if the equivalent value in
            // main object is a real object
            mainObj[key] = deepRemoveProperties(mainObj[key], changesObj[key]);
          }
        } else {
          if (Array.isArray(mainObj[key])) {
            // remove the first item of the array with the specified value
            const foundIndex = mainObj[key].findIndex(
              (element: any) => element === changesObj[key]
            );
            if (foundIndex >= 0) mainObj[key].splice(foundIndex, 1);
          } else if (mainObj[key] === changesObj[key]) {
            // remove the key if its value is the specified value
            delete mainObj[key];
          }
        }
      }
    });

    return mainObj;
  }

  function makeRPCFunction(rpcSpec: RPCSpec) {
    let rpcFunction = () => null as any;
    const isAsync = rpcSpec.async || false;

    switch (rpcSpec.type) {
      case "js":
        rpcFunction = () =>
          (window as any)[rpcSpec.name](makeArguments(rpcSpec.arguments || {}));

        break;
      case "http_rest":
        rpcFunction = makeHttpRestFunction(rpcSpec);

        break;
    }
    return () => {
      let resultActions: (() => any)[] = [];

      const rpcPromise = Promise.resolve(rpcFunction())
        .then((actionSpecList: ActionProps[]) => {
          resultActions = convertActionsToFunctions(actionSpecList);
        })
        .catch((error: any) => {
          if (
            typeof error === "object" &&
            error !== null &&
            "message" in error
          ) {
            console.log((error as Error).message);
          }

          let actionNames = rpcSpec.on_failure || [];
          if (Array.isArray(actionNames)) {
            for (const act of actionNames) {
              if (act in state.actionFunctionsMap) {
                resultActions.push(...state.actionFunctionsMap[act]);
              }
            }
          }
        })
        .then(async () => {
          for (const actFunc of resultActions) {
            const actResult = actFunc();
            if (
              actResult &&
              typeof actResult === "object" &&
              typeof actResult.then === "function"
            )
              await actResult;
          }
        });

      if (!isAsync) return rpcPromise;
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

  function makeHttpRestFunction(rpcSpec: RPCSpec) {
    const method = rpcSpec.options?.method?.toUpperCase() || "GET";
    const contentType = (rpcSpec.options?.content_type || "").toLowerCase();
    let url: any;
    try {
      url = new URL(rpcSpec.name).toString();
    } catch (error) {
      url = new URL(rpcSpec.name, props.base_url).toString();
    }

    return () => {
      let encodedParams: any = "";
      const params = makeArguments(rpcSpec.arguments || {});

      switch (contentType) {
        case "multipart/form-data":
          encodedParams = new FormData();
          for (const key in params) {
            encodedParams.append(key, params[key]);
          }
          break;
        case "application/json":
          encodedParams = JSON.stringify(params);
          break;
        case "application/x-www-form-urlencoded":
        default:
          encodedParams = new URLSearchParams(params).toString();
      }

      if (method === "GET" || !contentType) {
        url = new URL(encodedParams, url).toString();
      }

      const requestOptions: { [key: string]: any } = {
        method: method,
      };

      if (method !== "GET" && contentType) {
        requestOptions["headers"] = {
          "Content-Type": contentType,
        };
        requestOptions["body"] = encodedParams;
      }

      return fetch(url, requestOptions)
        .then((response) => response.json())
        .then((data) => data);
    };
  }

  function createActionFunctionsMap(actionsSpec: PitayaFormProps["actions"]) {
    const actionsDict: StateSpec["actionFunctionsMap"] = {};
    for (const [actionKey, actionSpecList] of Object.entries(
      actionsSpec || {}
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
        try {
          actionFunctions.push(
            makeActionFunctions(subActionKey as ActionKey, subActionSpec)
          );
        } catch (error) {
          if (
            typeof error === "object" &&
            error !== null &&
            "message" in error
          ) {
            console.log((error as Error).message);
          }
        }
      }
    }
    return actionFunctions;
  }

  const rootGroup = "_root";
  const formSpec = state.form || {};
  const groupsSpec = state.groups || {};
  const actionFunctionsMap = state.actionFunctionsMap;

  const dataModelRoot = groupsSpec[rootGroup]?.target_group;
  const formPath = dataModelRoot ? [dataModelRoot] : [];
  let formChildrenMap = new Map<string, any>();

  for (const jsonKey in formSpec) {
    const { gid = rootGroup, events = {}, ...fieldProps } = formSpec[jsonKey];
    const fieldEvents: { [key: string]: () => any } = {};
    for (const eventKey in events) {
      const eventActions: (() => any)[] = [];
      for (const act of events[eventKey]) {
        if (act in actionFunctionsMap) {
          eventActions.push(...actionFunctionsMap[act]);
        }
      }
      fieldEvents[EventsMap[eventKey as keyof typeof EventsMap] || "onClick"] =
        async () => {
          for (const actFunc of eventActions) {
            const actResult = actFunc();
            if (
              actResult &&
              typeof actResult === "object" &&
              typeof actResult.then === "function"
            )
              await actResult;
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
    <Form
      form={form}
      initialValues={initialInput}
      layout={"vertical"}
      colon={false}
      validateMessages={defaultValidateMessages}
      onFinish={props.submit || handleSubmit}>
      <Row>
        {formChildren.map((formChild, index) => (
          <Col key={index} order={Number(formChild.props.order) || 0} span={24}>
            {formChild}
          </Col>
        ))}
      </Row>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PitayaForm;
