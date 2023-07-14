import { describe, it, beforeEach, expect, vi, afterEach } from 'vitest';
import TextView from '../TextView.vue';
import { mountJsonFormsComponentWithStore } from '@@/test-setup/utils/jsonFormsTestUtils';
import { JsonDataService } from '@knime/ui-extension-service';

describe('TextView.vue', () => {
    let wrapper, initialDataSpy, addOnDataChangeCallbackSpy, setReportingContentMock;

    const defaultContent = 'test data';
    const defaultFlowVariablesMap = {
        key1: 'value1',
        key2: 'value2'
    };

    const createJsonDataServiceMock = (content = defaultContent, flowVariablesMap = defaultFlowVariablesMap) => ({
        initialData: vi.fn(() => ({
            content,
            flowVariablesMap
        })),
        addOnDataChangeCallback: vi.fn()
    });

    const createSpies = (jsonDataServiceMock) => {
        JsonDataService.mockImplementation(() => jsonDataServiceMock);
        initialDataSpy = vi.spyOn(jsonDataServiceMock, 'initialData');
        addOnDataChangeCallbackSpy = vi.spyOn(jsonDataServiceMock, 'addOnDataChangeCallback');
        setReportingContentMock = vi.fn();
    };

    const mountWrapper = () => {
        const component = mountJsonFormsComponentWithStore(TextView, false, {
            pagebuilder: {
                actions: { setReportingContent: setReportingContentMock },
                namespaced: true
            }
        });
        wrapper = component.wrapper;
    };

    beforeEach(() => {
        const jsonDataServiceMock = createJsonDataServiceMock();
        createSpies(jsonDataServiceMock);
        mountWrapper();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    it('renders text view container', () => {
        expect(wrapper.find('.text-view-container').exists()).toBeTruthy();
    });

    it('calls initial data on mount', () => {
        expect(initialDataSpy).toHaveBeenCalled();
        expect(wrapper.vm.richTextContent).toBe('test data');
    });

    it('adds on data change callback on mount', () => {
        expect(addOnDataChangeCallbackSpy).toHaveBeenCalled();
    });

    describe('onViewSettingsChange', () => {
        it('updates content on view settings change', async () => {
            const data = {
                data: {
                    view: {
                        richTextContent: 'abcdefg'
                    }
                },
                schema: {
                    flowVariablesMap: {}
                }
            };
            await wrapper.vm.onViewSettingsChange({ data });
            expect(wrapper.vm.richTextContent).toStrictEqual(data.data.view.richTextContent);
        });

        it('replaces flow variables in text content on view settings change', async () => {
            const flowVariablesMap = {
                key1: 'value1',
                key2: 'value2'
            };
            const data = {
                data: {
                    view: {
                        richTextContent: '$$["key1"] abc $$["key2"]'
                    }
                },
                schema: {
                    flowVariablesMap: {}
                }
            };
            wrapper.vm.flowVariablesMap = flowVariablesMap;
            await wrapper.vm.onViewSettingsChange({ data });
            expect(wrapper.vm.richTextContent).toBe(`${flowVariablesMap.key1} abc ${flowVariablesMap.key2}`);
        });

        it('replaces flow variables in text for escaped quotes', async () => {
            const flowVariablesMap = {
                key1: 'value1',
                key2: 'value2'
            };
            const data = {
                data: {
                    view: {
                        richTextContent: '$$[&#34;key1&#34;] abc $$[&#34;key2&#34;]'
                    }
                },
                schema: {
                    flowVariablesMap: {}
                }
            };
            wrapper.vm.flowVariablesMap = flowVariablesMap;
            await wrapper.vm.onViewSettingsChange({ data });
            expect(wrapper.vm.richTextContent).toBe(`${flowVariablesMap.key1} abc ${flowVariablesMap.key2}`);
        });

        it('does not change richTextContent if it is controlled by flow variable', async () => {
            const data = {
                data: {
                    view: {
                        richTextContent: 'abcdefg'
                    }
                },
                schema: {
                    flowVariablesMap: {
                        'view.richTextContent': {
                            controllingFlowVariableAvailable: true
                        }
                    }
                }
            };
            await wrapper.vm.onViewSettingsChange({ data });
            expect(wrapper.vm.richTextContent).toStrictEqual(defaultContent);
        });
    });

    it('replaces flow variables in text content on mount', async () => {
        const content = '$$["key1"] $$["key2"]';
        const jsonDataServiceMock = createJsonDataServiceMock(content);
        createSpies(jsonDataServiceMock);
        mountWrapper();
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.richTextContent).toBe('value1 value2');
    });

    // TODO enable once we have a propper way to get the reporting state
    // eslint-disable-next-line vitest/no-skipped-tests
    it.skip('notifies pagebuilder when component is mounted if it is in reporting context', () => {
        expect(setReportingContentMock).toHaveBeenCalledWith(expect.anything(), {
            nodeId: 'nodeId',
            reportContent: false
        });
    });
});
