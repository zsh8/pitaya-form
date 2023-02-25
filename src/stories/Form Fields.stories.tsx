import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { PitayaForm } from "..";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "PitayaForm/Form Fields",
  component: PitayaForm,
} as ComponentMeta<typeof PitayaForm>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PitayaForm> = (args) => <PitayaForm {...args} />;

export const allFields = Template.bind({});
allFields.args = {
    "form": {
        "binary_field": {
            "type": "Binary",
            "name": "Binary Field",
            "default": "",
            "order": 8
        },
        "string_field": {
            "name": "String Field",
            "long_description": "Change 'multiline' value in options to see the result",
            "default": "default type of a field is 'String'",
            "options": {
                "multiline": false
            },
            "order": 2
        },
        "duration_field": {
            "type": "Duration",
            "name": "Duration Field",
            "default": 604800,
            "order": 9
        },
        "file_field": {
            "type": "File",
            "name": "File Field",
            "long_description": "Change 'multiple' value in options to see the result",
            "default": {
                "content-url": "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
                "filename": "sample image"
            },
            "options": {
                "multiple": false
            },
            "order": 5
        },
        "boolean_field": {
            "type": "Boolean",
            "name": "Boolean Field",
            "order": 0
        },
        "hostname_field": {
            "type": "Hostname",
            "name": "Host Name Field",
            "default": "host",
            "order": 10
        },
        "number_field": {
            "type": "Number",
            "long_description": "Change 'float' and 'signed' value in options to see the result\n",
            "name": "Number Field",
            "options": {
                "float": true,
                "signed": false
            },
            "order": 1
        },
        "password_field": {
            "type": "Password",
            "name": "password",
            "order": 7
        },
        "port_field": {
            "type": "Port",
            "name": "Port Field",
            "order": 11
        },
        "choice_field": {
            "type": "Choices",
            "name": "Choice Field",
            "long_description": "Set 'multiple' and/or 'selectable_parents' in options to 'true'\nto see the result\n",
            "options": {
                "choices": {
                    "group_1": {
                        "name": 1,
                        "description": "group #1",
                        "choices": {
                            "group_1_nested_group_1": {
                                "name": 11,
                                "description": "nested group #1 of group #1",
                                "choices": {
                                    "group_1_nested_group_1_choice_1": {
                                        "description": "choice #1 of nested group #1 of group #1",
                                        "name": 111
                                    },
                                    "group_1_nested_group_1_choice_2": {
                                        "description": "choice #2 of nested group #1 of group #1",
                                        "name": 112
                                    }
                                }
                            },
                            "group_1_nested_group_2": {
                                "name": 12,
                                "description": "nested group #2 of group #1"
                            }
                        }
                    },
                    "group_2": {
                        "name": 2,
                        "description": "group #2 ",
                        "choices": {
                            "group_2_nested_group_1": {
                                "name": 21,
                                "description": "nested group #1 of group #2",
                                "choices": {
                                    "group_2_nested_group_1_choice_1": {
                                        "name": 211,
                                        "description": "choice #1 of nested group #1 of group #2"
                                    },
                                    "group_2_nested_group_1_choice_2": {
                                        "name": 212,
                                        "description": "choice #2 of nested group #1 of group #2"
                                    }
                                }
                            },
                            "group_2_nested_group_2": {
                                "name": 22,
                                "description": "nested group #2 of Group #2"
                            }
                        }
                    }
                },
                "multiple": false,
                "selectable_parents": false
            },
            "order": 3
        },
        "submit_field": {
            "type": "Submit",
            "name": "Submit Field",
            "order": 12
        },
        "label_field": {
            "type": "Label",
            "name": "Add 'gid: sample_group' to any field to see the result",
            "gid": "sample_group"
        },
        "date_time_field": {
            "type": "DateTime",
            "name": "Date Time Field",
            "long_description": "Change 'precision' value in options to see the result",
            "default": 1647249721,
            "options": {
                "precision": "milliseconds"
            },
            "order": 4
        }
    },
    "groups": {
        "sample_group": {
            "name": "Sample Group",
            "order": 6
        }
    },
    "input": {
        "string_field": "input value of a field overrides the default value"
    },
    "styles": {},
    "version": "1"
}
