import { afterEach, beforeEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { mountJsonFormsComponent, initializesJsonFormsControl, mountJsonFormsComponentWithStore }
    from '@@/test-setup/utils/jsonFormsTestUtils';
import RichTextEditor from 'webapps-common/ui/components/forms/RichTextEditor/RichTextEditor.vue';
import RichTextInput from '../RichTextInput.vue';
import { inputFormats } from '@/nodeDialog/constants';

describe('RichTextInput.vue', () => {
    let props, wrapper, onChangeSpy;

    beforeAll(() => {
        onChangeSpy = vi.spyOn(RichTextInput.methods, 'onChange');
    });

    beforeEach(async () => {
        props = {
            control: {
                path: 'richTextContent',
                visible: true,
                data: 'test',
                schema: {
                    properties: {
                        richTextContent: {
                            type: 'string'
                        }
                    }
                },
                uischema: {
                    type: 'Control',
                    scope: '#/properties/view/properties/richTextContent',
                    options: {
                        format: inputFormats.richTextInput
                    }
                },
                rootSchema: {
                    hasNodeView: true,
                    flowVariablesMap: {
                        flowVar1: 'flow value'
                    }
                }
            }
            
        };
        wrapper = await mountJsonFormsComponent(RichTextInput, props);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders', () => {
        expect(wrapper.findComponent(RichTextInput).exists()).toBeTruthy();
        expect(wrapper.findComponent(RichTextEditor).exists()).toBeTruthy();
    });

    it('initializes jsonforms', () => {
        initializesJsonFormsControl(wrapper);
    });

    it('calls onChange when html content is changed', async () => {
        const dirtySettingsMock = vi.fn();
        const localWrapper = await mountJsonFormsComponentWithStore(RichTextInput, props, {
            'pagebuilder/dialog': {
                actions: { dirtySettings: dirtySettingsMock },
                namespaced: true
            }
        });
        const changedRichTextInput = 'abcdefg';
        localWrapper.findComponent(RichTextEditor).vm.$emit('update:modelValue', changedRichTextInput);
        expect(onChangeSpy).toHaveBeenCalledWith(changedRichTextInput);
        expect(localWrapper.vm.handleChange).toHaveBeenCalledWith(props.control.path, changedRichTextInput);
        expect(dirtySettingsMock).not.toHaveBeenCalled();
    });

    it('sets correct initial value', () => {
        expect(wrapper.findComponent(RichTextEditor).vm.modelValue).toBe(props.control.data);
    });

    it('sets editor to editable', () => {
        const editorComponent = wrapper.findComponent(RichTextEditor);
        expect(editorComponent.vm.editable).toBeTruthy();
    });
});
