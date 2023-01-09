import { mountJsonFormsComponent, initializesJsonFormsControl } from '~/test/unit/suites/utils/jsonFormsTestUtils';
import ColumnFilter from '@/components/UIComponents/ColumnFilter.vue';
import TwinlistInput from '@/components/UIComponents/TwinlistInput.vue';


describe('ColumnFilter.vue', () => {
    const defaultPropsData = {
        path: '',
        control: {
            schema: {
                type: 'object',
                properties: {
                    isCaseSensitive: {
                        type: 'boolean'
                    },
                    isInverted: {
                        type: 'boolean'
                    },
                    manuallySelected: {
                        items: {
                            type: 'string'
                        },
                        type: 'array'
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
                        ]
                    },
                    selected: {
                        anyOf:
                            [{
                                const: 'test_1',
                                title: 'test_1',
                                columnType: 'String'
                            },
                            {
                                const: 'test_2',
                                title: 'test_2',
                                columnType: 'Double'
                            },
                            {
                                const: 'test_3',
                                title: 'test_3',
                                columnType: 'String'
                            }]
                    },
                    pattern: {
                        type: 'string'
                    }
                }
            },
            uischema: {
                type: 'Control',
                scope: '#/properties/xAxis',
                options: {
                    format: 'columnFilter'
                }
            }
        }
    };

    let wrapper;

    beforeEach(async () => {
        wrapper = await mountJsonFormsComponent(ColumnFilter, defaultPropsData);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders', () => {
        expect(wrapper.getComponent(ColumnFilter).exists()).toBe(true);
        expect(wrapper.getComponent(TwinlistInput).exists()).toBe(true);
    });

    it('passes default props', () => {
        const twinListProps = wrapper.getComponent(TwinlistInput).props();
        expect(twinListProps.twinlistLeftLabel).toBe('Excludes');
        expect(twinListProps.twinlistRightLabel).toBe('Includes');
    });

    it('initializes jsonforms on pass-through component', () => {
        initializesJsonFormsControl(wrapper.getComponent(TwinlistInput));
    });
});
