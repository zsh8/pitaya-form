import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { PitayaForm } from "..";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "PitayaForm/Fields Actions",
  component: PitayaForm,
} as ComponentMeta<typeof PitayaForm>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PitayaForm> = (args) => <PitayaForm {...args} />;

export const updateAndRemoveActions = Template.bind({});
updateAndRemoveActions.args = {
    "form": {
        "city": {
            "type": "Choices",
            "name": "City",
            "gid": "address",
            "order": 1
        },
        "country": {
            "type": "Choices",
            "name": "Country",
            "options": {
                "choices": {
                    "afghanistan": {
                        "name": "Afghanistan"
                    },
                    "iran": {
                        "name": "Iran"
                    }
                }
            },
            "events": {
                "change": [
                    "update_cities"
                ]
            },
            "gid": "address"
        },
        "add_details_button": {
            "name": "Add Details",
            "type": "Submit",
            "events": {
                "click": [
                    "add_details_field"
                ]
            },
            "gid": "address",
            "order": 2
        }
    },
    "groups": {
        "address": {
            "name": "Address"
        }
    },
    "actions": {
        "update_cities": [
            {
                "rpc": {
                    "arguments": {
                        "country": {
                            "mode": "document_reference",
                            "type": "jsonpath",
                            "value": "input.address.country"
                        }
                    },
                    "name": "get_cities",
                    "type": "js"
                }
            }
        ],
        "add_details_field": [
            {
                "remove": {
                    "form": {
                        "add_details_button": {}
                    }
                },
                "update": {
                    "form": {
                        "street": {
                            "name": "Street",
                            "gid": "details",
                            "order": 0
                        },
                        "zip": {
                            "name": "Zip code",
                            "gid": "details",
                            "order": 1
                        },
                        "remove_details_button": {
                            "name": "Remove Details",
                            "type": "Submit",
                            "events": {
                                "click": [
                                    "remove_details_field"
                                ]
                            },
                            "gid": "address",
                            "order": 2
                        }
                    },
                    "groups": {
                        "details": {
                            "name": "Details",
                            "gid": "address",
                            "order": 3
                        }
                    }
                }
            }
        ],
        "remove_details_field": [
            {
                "remove": {
                    "form": {
                        "street": null,
                        "zip": null,
                        "remove_details_button": null
                    },
                    "groups": {
                        "details": null
                    }
                },
                "update": {
                    "form": {
                        "add_details_button": {
                            "name": "Add Details",
                            "type": "Submit",
                            "events": {
                                "click": [
                                    "add_details_field"
                                ]
                            },
                            "gid": "address",
                            "order": 2
                        }
                    }
                }
            }
        ]
    },
    "js": "function get_cities({country}) {\n  return [{\n    \"remove\": {\n      \"input\": {\n        \"address\": {\"city\": null}\n      },\n      \"form\": {\n        \"city\": {\n          \"options\": {\"choices\": {}}\n        }\n      }\n    },\n    \"update\": {\n      \"form\": {\"city\": {\n        \"options\": {\n          \"choices\": {\n            \"iran\": {\n              \"tehran\": {\"name\": \"Tehran\"}, \"esfahan\": {\"name\": \"Esfahan\"}\n            },\n            \"afghanistan\": {\n              \"kabul\": {\"name\": \"Kabul\"}, \"herat\": {\"name\": \"Herat\"}\n            }\n          }[country]\n        }\n      }}\n    }\n  }];\n}\n"
}
