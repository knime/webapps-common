import { describe, it, beforeEach, expect, vi, afterEach } from 'vitest';
import TextView from '../TextView.vue';
import { mountJsonFormsComponentWithStore } from '@@/test-setup/utils/jsonFormsTestUtils';
import { JsonDataService } from '@knime/ui-extension-service';

describe('TextView.vue', () => {
    let wrapper, initialDataSpy, addOnDataChangeCallbackSpy, setReportingContentMock;

    beforeEach(() => {
        const jsonDataServiceMock = {
            initialData: vi.fn(() => ({
                content: 'test data',
                flowVariablesMap: {
                    key1: 'value1',
                    key2: 'value2'
                }
            })),
            addOnDataChangeCallback: vi.fn()
        };
        JsonDataService.mockImplementation(() => jsonDataServiceMock);
        initialDataSpy = vi.spyOn(jsonDataServiceMock, 'initialData');
        addOnDataChangeCallbackSpy = vi.spyOn(jsonDataServiceMock, 'addOnDataChangeCallback');
        setReportingContentMock = vi.fn();

        wrapper = mountJsonFormsComponentWithStore(TextView, false, {
            pagebuilder: {
                actions: { setReportingContent: setReportingContentMock },
                namespaced: true
            }
        });
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

    it('updates content on view settings change', async () => {
        const data = {
            data: {
                view: {
                    richTextContent: 'abcdefg'
                }
            }
        };
        await wrapper.vm.onViewSettingsChange({ data });
        expect(wrapper.vm.richTextContent).toStrictEqual(data.data.view.richTextContent);
    });

    it('replaces flow variables in text content', async () => {
        const flowVariableMap = {
            key1: 'value1',
            key2: 'value2'
        };
        const data = {
            data: {
                view: {
                    richTextContent: '$$[key1] abc $$[key2]'
                }
            }
        };
        wrapper.vm.flowVariableMap = flowVariableMap;
        await wrapper.vm.onViewSettingsChange({ data });
        expect(wrapper.vm.richTextContent).toBe(`${flowVariableMap.key1} abc ${flowVariableMap.key2}`);
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
