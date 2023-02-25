import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { PitayaForm } from "..";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "PitayaForm/Fields Validation",
  component: PitayaForm,
} as ComponentMeta<typeof PitayaForm>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PitayaForm> = (args) => <PitayaForm {...args} />;

export const validation = Template.bind({});
validation.args = {
    "form": {
        "binary_field": {
            "type": "Binary",
            "name": "Binary Field",
            "long_description": "insert a non empty value with maximum length 30",
            "default": "",
            "options": {
                "validators": [
                    {
                        "allow_empty": false
                    },
                    {
                        "max": 30
                    }
                ]
            },
            "order": 8
        },
        "string_field": {
            "name": "String Field",
            "long_description": "insert at most 5 characters, white spaces is not acceptable",
            "default": "   ",
            "options": {
                "multiline": false,
                "options": null,
                "validators": [
                    {
                        "allow_whitespace": false
                    },
                    {
                        "max": 5
                    }
                ]
            },
            "order": 2
        },
        "duration_field": {
            "type": "Duration",
            "name": "Duration Field",
            "long_description": "select a duration between 100 and 1000 seconds",
            "default": 604800,
            "options": {
                "validators": [
                    {
                        "max": 1000
                    },
                    {
                        "min": 100
                    }
                ]
            },
            "order": 9
        },
        "file_field": {
            "type": "File",
            "name": "File Field",
            "long_description": "upload at least two files",
            "default": [
                {
                    "content-url": "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
                    "filename": "sample image"
                }
            ],
            "options": {
                "multiple": true,
                "validators": [
                    {
                        "min": 2
                    }
                ]
            },
            "order": 5
        },
        "boolean_field": {
            "type": "Boolean",
            "name": "Boolean Field",
            "long_description": "default null value is not acceptable",
            "default": null,
            "options": {
                "validators": [
                    {
                        "allow_null": false
                    }
                ]
            },
            "order": 0
        },
        "number_field": {
            "type": "Number",
            "long_description": "insert a number not less than 12",
            "name": "Number Field",
            "options": {
                "float": true,
                "signed": false,
                "validators": [
                    {
                        "min": 12
                    }
                ]
            },
            "order": 1
        },
        "password_field": {
            "type": "Password",
            "name": "password",
            "long_description": "insert at least one number and one capital letter in password",
            "options": {
                "validators": [
                    {
                        "allow_empty": false
                    },
                    {
                        "allow_null": false
                    },
                    {
                        "regex": "[A-Z]+"
                    },
                    {
                        "regex": "\\d+"
                    }
                ]
            },
            "order": 7
        },
        "port_field": {
            "type": "Port",
            "name": "Port Field",
            "long_description": "select a port not less than 3000 or left it empty",
            "default": 0,
            "options": {
                "validators": [
                    {
                        "min": 3000
                    }
                ]
            },
            "order": 10
        },
        "choice_field": {
            "type": "Choices",
            "name": "Choice Field",
            "long_description": "select at least two options",
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
                "multiple": true,
                "selectable_parents": false,
                "validators": [
                    {
                        "min": 2
                    }
                ]
            },
            "order": 3
        },
        "date_time_field": {
            "type": "DateTime",
            "name": "Date Time Field",
            "long_description": "select a date since 2023",
            "default": 1672245800,
            "options": {
                "precision": "milliseconds",
                "validators": [
                    {
                        "min": 1672534800
                    }
                ]
            },
            "order": 4
        },
        "url_field": {
            "name": "URL Field",
            "long_description": "insert a url with https scheme",
            "default": "invalid url",
            "options": {
                "multiline": false,
                "options": null,
                "validators": [
                    {
                        "url": true,
                        "url_schemes": [
                            "https"
                        ]
                    }
                ]
            },
            "order": 6
        }
    }
}
