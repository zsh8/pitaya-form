import { isIP } from "is-ip";

const typeTemplate = "'${msgLabel}' has not a valid value";

export const defaultValidateMessages = {
  default: "Validation error on field '${msgLabel}'",
  required: "'${msgLabel}' is required",
  enum: "'${msgLabel}' must be one of [${enum}]",
  whitespace: "'${msgLabel}' cannot be only whitespaces",
  null: "'${msgLabel}' cannot be null",
  empty: "'${msgLabel}' cannot be empty",
  date: {
    format: "'${msgLabel}' is invalid for format date",
    parse: "'${msgLabel}' could not be parsed as date",
    invalid: "'${msgLabel}' is invalid date",
  },
  types: {
    string: typeTemplate,
    method: typeTemplate,
    array: typeTemplate,
    object: typeTemplate,
    number: typeTemplate,
    date: typeTemplate,
    boolean: typeTemplate,
    integer: typeTemplate,
    float: typeTemplate,
    regexp: typeTemplate,
    email: typeTemplate,
    url: typeTemplate,
    hex: typeTemplate,
  },
  string: {
    len: "'${msgLabel}' must be exactly ${len} characters",
    min: "'${msgLabel}' must be at least ${min} characters",
    max: "'${msgLabel}' cannot be longer than ${max} characters",
    range: "'${msgLabel}' must be between ${min} and ${max} characters",
  },
  number: {
    len: "'${msgLabel}' must equal ${len} ${msgUnit}",
    min: "'${msgLabel}' cannot be less than ${min} ${msgUnit}",
    max: "'${msgLabel}' cannot be greater than ${max} ${msgUnit}",
    range: "'${msgLabel}' must be between ${min} and ${max} ${msgUnit}",
  },
  array: {
    len: "'${msgLabel}' must be exactly ${len} in length",
    min: "'${msgLabel}' cannot be less than ${min} in length",
    max: "'${msgLabel}' cannot be greater than ${max} in length",
    range: "'${msgLabel}' must be between ${min} and ${max} in length",
  },
  pattern: {
    mismatch: "'${msgLabel}' does not match pattern ${pattern}",
  },
};

export interface Validator {
  allow_empty?: boolean;
  allow_whitespace?: boolean;
  allow_null?: boolean;
  min?: number;
  max?: number;
  hostname?: boolean;
  url?: boolean;
  url_schemes?: string[];
  regex?: string | RegExp;
  binary?: boolean;
  hint?: string;
}

export function convertValidatorsToRules(
  validators: Validator[],
  valueType: any,
  validateLabel: string,
  validateUnit?: string
) {
  let rules: object[] = [];

  // determine allow_null, allow_empty and allow_whitespace
  // conditions to apply in all rules

  let global_allow_null: boolean | undefined = undefined;
  let global_allow_empty: boolean | undefined = undefined;
  let global_allow_whitespace: boolean | undefined = undefined;

  const find_true_allow_null = validators.some(
    (validator) => validator.allow_null
  );
  if (find_true_allow_null) global_allow_null = true;
  else {
    const find_false_allow_null = validators.some(
      (validator) => validator.allow_null === false
    );
    if (find_false_allow_null) global_allow_null = false;
  }

  const find_true_allow_empty = validators.some(
    (validator) => validator.allow_empty
  );
  if (find_true_allow_empty) global_allow_empty = true;
  else {
    const find_false_allow_empty = validators.some(
      (validator) => validator.allow_empty === false
    );
    if (find_false_allow_empty) global_allow_empty = false;
  }

  const find_true_allow_whitespace = validators.some(
    (validator) => validator.allow_whitespace
  );
  if (find_true_allow_whitespace) global_allow_whitespace = true;
  else {
    const find_false_allow_whitespace = validators.some(
      (validator) => validator.allow_whitespace === false
    );
    if (find_false_allow_whitespace) global_allow_whitespace = false;
  }

  for (const validator of validators) {
    let rule: { [key: string]: any } = {
      msgLabel: validateLabel,
      msgUnit: validateUnit,
    };

    const {
      allow_null: current_allow_null,
      allow_empty: current_allow_empty,
      allow_whitespace: current_allow_whitespace,
    } = validator;
    let customValidator: ((rule: any, value: any) => any) | undefined;

    const lengthKeys = ["min", "max"] as const;
    for (const key of lengthKeys)
      if (key in validator) {
        rule[key] = Number(validator[key]) || 0;
        // type is required for length keys
        rule["type"] = valueType;
      }

    if (validator["url"]) {
      // TODO: this does not work beside url_schemes
      rule["type"] = "url";
    }

    if ("regex" in validator) {
      try {
        rule["pattern"] = new RegExp(validator["regex"] || "");
      } catch (err) {}
    }

    if ("url_schemes" in validator) {
      customValidator = (_: any, value: any) => {
        if (!validator["url"]) return Promise.resolve();
        const message = `Acceptable schemes are: ${validator[
          "url_schemes"
        ]?.join(", ")}`;
        if (typeof value !== "string")
          return Promise.reject(new Error(message));
        const urlParts = value.trim().split(":");
        let scheme = "";
        if (urlParts) scheme = urlParts[0];
        if (!validator["url_schemes"]?.includes(scheme))
          return Promise.reject(new Error(message));
        else return Promise.resolve();
      };
    }

    if (validator["hostname"]) {
      customValidator = (_: any, value: any) => {
        const message = "'${msgLabel}' is not a valid hostname or ip";
        if (typeof value !== "string") {
          return Promise.reject(new Error(message));
        }

        value = value.trim();
        // check the value is IPv6 or IPv4
        // if (isIP(value)) return Promise.resolve();

        // check the value is a valid hostname
        if (value && value.slice(-1) === ".") {
          // It is valid for the last character to be a dot; strip
          // exactly one dot from the right, if present
          value = value.slice(0, -1);
        }

        if (value.length > 253) return Promise.reject(new Error(message));

        const sections = value.split(".");

        // the TLD (last section) must be not all-numeric
        if (sections.at(-1).match(/^[0-9]+$/))
          return Promise.reject(new Error(message));

        const sectionRx = /^(?!-)[a-z0-9-]{1,63}(?<!-)$/i;
        for (const section of sections) {
          if (!section.match(sectionRx))
            return Promise.reject(new Error(message));
        }
        return Promise.resolve();
      };
    }

    if (validator["binary"]) {
      customValidator = (_: any, value: any) => {
        const message = "'${msgLabel}' is not a valid binary string";

        if (typeof value !== "string") {
          return Promise.reject(new Error(message));
        }

        try {
          window.atob(value);
        } catch (err) {
          return Promise.reject(new Error(message));
        }
        return Promise.resolve();
      };
    }

    if (
      [
        customValidator,
        current_allow_null,
        current_allow_empty,
        current_allow_whitespace,
      ].some((item) => item !== undefined)
    )
      rule["validator"] = (_rule: any, value: any) => {
        // global true conditions must be checked before any custom validator
        if (
          (global_allow_null && value === null) ||
          (global_allow_empty && value === "") ||
          (global_allow_whitespace && /^\s+$/.test(value))
        )
          return Promise.resolve();

        // false conditions of the current rule must be checked just before
        // the current custom validator to prevent repetitive error messages
        if (
          (current_allow_null === false && value === null) ||
          (current_allow_empty === false && value === "") ||
          (current_allow_whitespace === false && /^\s+$/.test(value))
        )
          return Promise.reject(
            new Error(
              defaultValidateMessages[
                value === null ? "null" : value === "" ? "empty" : "whitespace"
              ]
            )
          );

        if (customValidator) return customValidator(_rule, value);

        return Promise.resolve();
      };

    // 'hint' must be set at the end to override the custom validator message
    if ("hint" in validator) rule["message"] = validator["hint"];

    rules.push(rule);
  }
  return rules;
}
