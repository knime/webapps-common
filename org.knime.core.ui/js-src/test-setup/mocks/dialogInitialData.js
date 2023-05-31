export const dialogInitialData = {
    data: {
        view: {
            title: 'Scatter Plot',
            yAxisScale: 'VALUE',
            dropdown: 'value 1',
            simpleColumnSelect: 'column 1',
            xAxisColumn: {
                selected: 'Universe_1_1'
            },
            yAxisColumn: 'Universe_0_1',
            xAxisLabel: '',
            yAxisLabel: '',
            frequencyColumns: ['Universe_0_0', 'Universe_0_1', 'Universe_1_0', 'Universe_1_1'],
            referenceLines: [
                {
                    borderStyle: null,
                    color: '',
                    label: '',
                    size: 0,
                    value: 0
                }
            ]
        }
    },
    schema: {
        type: 'object',
        properties: {
            view: {
                type: 'object',
                properties: {
                    title: {
                        type: 'string',
                        title: 'Title',
                        description: 'some description'
                    },
                    dropdown: {
                        type: 'string',
                        title: 'Simple Dropdown'
                    },
                    simpleColumnSelect: {
                        type: 'string',
                        title: 'Simple Dropdown'
                    },
                    xAxisColumn: {
                        type: 'object',
                        properties: {
                            selected: {
                                type: 'string'
                            }
                        },
                        title: 'X Axis Column'
                    },
                    xAxisLabel: {
                        type: 'string',
                        title: 'X Axis Label'
                    },
                    yAxisColumn: {
                        type: 'string',
                        title: 'Y Axis Column'
                    },
                    yAxisLabel: {
                        type: 'string',
                        title: 'Y Axis Label'
                    },
                    yAxisScale: {
                        oneOf: [
                            {
                                const: 'LOG',
                                title: 'Logarithmic'
                            },
                            {
                                const: 'VALUE',
                                title: 'Linear'
                            }
                        ],
                        title: 'Y Axis Scale'
                    },
                    showTooltip: {
                        type: 'boolean',
                        title: 'Show tooltip'
                    },
                    maxRows: {
                        type: 'integer',
                        title: 'Show tooltip'
                    },
                    fraction: {
                        type: 'number',
                        title: 'Show tooltip'
                    },
                    frequencyColumns: {
                        type: 'object',
                        properties: {
                            isCaseSensitive: {
                                type: 'boolean',
                                default: false
                            },
                            isInverted: {
                                type: 'boolean',
                                default: false
                            },
                            manuallySelected: {
                                default: [],
                                type: 'array',
                                items: {
                                    type: 'string'
                                }
                            },
                            mode: {
                                oneOf: [
                                    {
                                        const: 'MANUAL',
                                        title: 'Manual'
                                    },
                                    {
                                        const: 'REGEX',
                                        title: 'Regex'
                                    },
                                    {
                                        const: 'WILDCARD',
                                        title: 'Wildcard'
                                    },
                                    {
                                        const: 'TYPE',
                                        title: 'Type'
                                    }
                                ],
                                default: 'MANUAL'
                            },
                            pattern: {
                                type: 'string',
                                default: ''
                            },
                            selected: {
                                anyOf: [
                                    {
                                        const: 'Universe_0_0',
                                        title: 'Universe_0_0',
                                        columnType: 'DoubleValue',
                                        columnTypeDisplayed: 'Double'
                                    },
                                    {
                                        const: 'Universe_0_1',
                                        title: 'Universe_0_1',
                                        columnType: 'DoubleValue',
                                        columnTypeDisplayed: 'Double'
                                    },
                                    {
                                        const: 'Universe_1_0',
                                        title: 'Universe_1_0',
                                        columnType: 'DoubleValue',
                                        columnTypeDisplayed: 'Double'
                                    },
                                    {
                                        const: 'Universe_1_1',
                                        title: 'Universe_1_1',
                                        columnType: 'DoubleValue',
                                        columnTypeDisplayed: 'Double'
                                    },
                                    {
                                        const: 'Cluster Membership',
                                        title: 'Cluster Membership',
                                        columnType: 'StringValue',
                                        columnTypeDisplayed: 'String'
                                    }
                                ]
                            },
                            selectedTypes: {
                                default: [],
                                type: 'array',
                                items: {
                                    type: 'string'
                                }
                            }
                        },
                        title: 'Frequency column selection'
                    },
                    simpleTwinlist: {
                        anyOf: [
                            {
                                const: 'Universe_0_0',
                                title: 'Universe_0_0',
                                columnType: 'DoubleValue'
                            },
                            {
                                const: 'Universe_0_1',
                                title: 'Universe_0_1',
                                columnType: 'DoubleValue'
                            },
                            {
                                const: 'Universe_1_0',
                                title: 'Universe_1_0',
                                columnType: 'DoubleValue'
                            },
                            {
                                const: 'Universe_1_1',
                                title: 'Universe_1_1',
                                columnType: 'DoubleValue'
                            },
                            {
                                const: 'Cluster Membership',
                                title: 'Cluster Membership',
                                columnType: 'StringValue',
                                columnTypeDisplayed: 'String'
                            }
                        ],
                        title: 'Frequency column selection'
                    },
                    referenceLines: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                borderStyle: {
                                    oneOf: [
                                        {
                                            const: 'DASHED',
                                            title: 'Dashed'
                                        },
                                        {
                                            const: 'DOTTED',
                                            title: 'Dotted'
                                        },
                                        {
                                            const: 'SOLID',
                                            title: 'Solid'
                                        }
                                    ],
                                    title: 'Borderstyle'
                                },
                                color: {
                                    type: 'string',
                                    title: 'Color'
                                },
                                label: {
                                    type: 'string',
                                    title: 'Label'
                                },
                                size: {
                                    type: 'integer',
                                    title: 'Size',
                                    minimum: 0,
                                    maximum: 10
                                },
                                value: {
                                    type: 'string',
                                    title: 'Value'
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    ui_schema: { // eslint-disable-line camelcase
        elements: [
            {
                type: 'Section',
                label: 'Style',
                elements: [
                    {
                        type: 'Control',
                        scope: '#/properties/view/properties/title'
                    },
                    {
                        type: 'Control',
                        scope: '#/properties/view/properties/yAxisScale',
                        options: {
                            format: 'radio',
                            radioLayout: 'horizontal'
                        }
                    },
                    {
                        type: 'Control',
                        scope: '#/properties/view/properties/maxRows',
                        options: {
                            format: 'integer'
                        }
                    },
                    {
                        type: 'Control',
                        scope: '#/properties/view/properties/fraction',
                        options: {
                            format: 'number'
                        }
                    },
                    {
                        type: 'Control',
                        scope: '#/properties/view/properties/showTooltip',
                        options: {
                            format: 'checkbox'
                        }
                    }
                ]
            },
            {
                type: 'Section',
                label: 'Data',
                elements: [
                    {
                        type: 'Control',
                        scope: '#/properties/view/properties/xAxisColumn',
                        options: {
                            format: 'columnSelection',
                            possibleValues: [{
                                id: 'Cluster_Membership',
                                text: 'Cluster_Membership'
                            }, {
                                id: 'Universe_0_0',
                                text: 'Universe_0_0'
                            }, {
                                id: 'Universe_0_1',
                                text: 'Universe_0_1'
                            }, {
                                id: 'Universe_1_0',
                                text: 'Universe_1_0'
                            }, {
                                id: 'Universe_1_1',
                                text: 'Universe_1_1'
                            }],
                            showRowKeys: false,
                            showNoneColumn: false
                        }
                    },
                    {
                        type: 'Control',
                        scope: '#/properties/view/properties/yAxisColumn',
                        options: {
                            format: 'twinList',
                            possibleValues: [{
                                id: 'Cluster_Membership',
                                text: 'Cluster_Membership'
                            }, {
                                id: 'Universe_0_0',
                                text: 'Universe_0_0'
                            }, {
                                id: 'Universe_0_1',
                                text: 'Universe_0_1'
                            }, {
                                id: 'Universe_1_0',
                                text: 'Universe_1_0'
                            }, {
                                id: 'Universe_1_1',
                                text: 'Universe_1_1'
                            }],
                            showRowKeys: false,
                            showNoneColumn: false
                        }
                    },
                    {
                        type: 'Control',
                        scope: '#/properties/view/properties/xAxisLabel'
                    },
                    {
                        type: 'Control',
                        scope: '#/properties/view/properties/yAxisLabel'
                    },
                    {
                        type: 'Control',
                        scope: '#/properties/view/properties/frequencyColumns',
                        options: {
                            format: 'columnFilter',
                            possibleValues: [{
                                id: 'Cluster_Membership',
                                text: 'Cluster_Membership'
                            }, {
                                id: 'Universe_0_0',
                                text: 'Universe_0_0'
                            }, {
                                id: 'Universe_0_1',
                                text: 'Universe_0_1'
                            }, {
                                id: 'Universe_1_0',
                                text: 'Universe_1_0'
                            }, {
                                id: 'Universe_1_1',
                                text: 'Universe_1_1'
                            }],
                            allowEmptyInclude: true,
                            twinlistSize: 7,
                            twinlistLeftLabel: 'Excluded Columns',
                            twinlistRightLabel: 'Included Columns'
                        }
                    },
                    {
                        type: 'Control',
                        scope: '#/properties/view/properties/simpleTwinlist',
                        options: {
                            format: 'twinList',
                            possibleValues: [{
                                id: 'Cluster_Membership',
                                text: 'Cluster_Membership'
                            }, {
                                id: 'Universe_0_0',
                                text: 'Universe_0_0'
                            }, {
                                id: 'Universe_0_1',
                                text: 'Universe_0_1'
                            }, {
                                id: 'Universe_1_0',
                                text: 'Universe_1_0'
                            }, {
                                id: 'Universe_1_1',
                                text: 'Universe_1_1'
                            }]
                        }
                    }
                ]
            },
            {
                type: 'Section',
                label: 'Reference Lines',
                elements: [
                    {
                        type: 'Control',
                        scope: '#/properties/view/properties/referenceLines',
                        options: {
                            detail: {
                                value: {
                                    type: 'Control',
                                    scope: '#/properties/value'
                                },
                                label: {
                                    type: 'Control',
                                    scope: '#/properties/label'
                                },
                                borderStyle: {
                                    type: 'Control',
                                    scope: '#/properties/borderStyle',
                                    options: {
                                        format: 'radio',
                                        radioLayout: 'horizontal'
                                    }
                                },
                                horizontalLayout: {
                                    type: 'HorizontalLayout',
                                    elements: [
                                        {
                                            type: 'Control',
                                            scope: '#/properties/size'
                                        },
                                        {
                                            type: 'Control',
                                            scope: '#/properties/color'
                                        }
                                    ]
                                }
                            }
                        }
                    }
                ]
            }
        ]
    }
};

export const expectedRenderers = [
    { scope: '#/properties/view/properties/title', component: 'TextInput' },
    { scope: '#/properties/view/properties/yAxisScale', component: 'RadioInput' },
    { scope: '#/properties/view/properties/maxRows', component: 'IntegerInput' },
    { scope: '#/properties/view/properties/fraction', component: 'IntegerInput' },
    { scope: '#/properties/view/properties/showTooltip', component: 'CheckboxInput' },
    { scope: '#/properties/view/properties/xAxisColumn', component: 'ColumnSelect' },
    { scope: '#/properties/view/properties/yAxisColumn', component: 'SimpleTwinListInput' },
    { scope: '#/properties/view/properties/xAxisLabel', component: 'TextInput' },
    { scope: '#/properties/view/properties/yAxisLabel', component: 'TextInput' },
    { scope: '#/properties/view/properties/frequencyColumns', component: 'ColumnFilter' },
    { scope: '#/properties/view/properties/simpleTwinlist', component: 'SimpleTwinListInput' },
    { scope: '#/properties/view/properties/referenceLines', component: 'ArrayLayout' }
];
