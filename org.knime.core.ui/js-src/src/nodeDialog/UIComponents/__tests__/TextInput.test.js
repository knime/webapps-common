import { afterEach, beforeEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { mountJsonFormsComponent, initializesJsonFormsControl, mountJsonFormsComponentWithStore }
    from '@@/test-setup/utils/jsonFormsTestUtils';
import TextInput from '@/nodeDialog/UIComponents/TextInput.vue';
import LabeledInput from '@/nodeDialog/UIComponents/LabeledInput.vue';
import InputField from 'webapps-common/ui/components/forms/InputField.vue';

describe('TextInput.vue', () => {
    let defaultProps, wrapper, onChangeSpy, handleChangeSpy;

    beforeAll(() => {
        onChangeSpy = vi.spyOn(TextInput.methods, 'onChange');
        handleChangeSpy = TextInput.methods.handleChange = vi.fn();
    });
    
    beforeEach(async () => {
        defaultProps = {
            control: {
                path: 'test',
                enabled: true,
                visible: true,
                label: 'defaultLabel',
                data: 'test',
                schema: {
                    properties: {
                        xAxisLabel: {
                            type: 'string',
                            title: 'X Axis Label'
                        }
                    },
                    default: 'default value'
                },
                uischema: {
                    type: 'Control',
                    scope: '#/properties/view/properties/xAxisLabel',
                    options: {
                        isAdvanced: false
                    }
                },
                rootSchema: {
                    hasNodeView: true,
                    flowVariablesMap: {}
                }
            }
        };

        wrapper = await mountJsonFormsComponent(TextInput, defaultProps);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders', () => {
        expect(wrapper.getComponent(TextInput).exists()).toBe(true);
        expect(wrapper.findComponent(LabeledInput).exists()).toBe(true);
        expect(wrapper.findComponent(InputField).exists()).toBe(true);
    });
    
    it('initializes jsonforms', () => {
        initializesJsonFormsControl(wrapper);
    });

    it('calls onChange when text input is changed', async () => {
        const dirtySettingsMock = vi.fn();
        const localWrapper = await mountJsonFormsComponentWithStore(TextInput, defaultProps, {
            'pagebuilder/dialog': {
                actions: { dirtySettings: dirtySettingsMock },
                namespaced: true
            }
        });
        const changedTextInput = 'Shaken not stirred';
        localWrapper.findComponent(InputField).vm.$emit('update:modelValue', changedTextInput);
        expect(onChangeSpy).toHaveBeenCalledWith(changedTextInput);
        expect(handleChangeSpy).toHaveBeenCalledWith(defaultProps.control.path, changedTextInput);
        expect(dirtySettingsMock).not.toHaveBeenCalled();
    });

    it('indicates model settings change when model setting is changed', async () => {
        const dirtySettingsMock = vi.fn();
        const localWrapper = await mountJsonFormsComponentWithStore(
            TextInput,
            {
                ...defaultProps,
                control: {
                    ...defaultProps.control,
                    uischema: {
                        ...defaultProps.control.schema,
                        scope: '#/properties/model/properties/yAxisColumn'
                    }
                }
            },
            {
                'pagebuilder/dialog': {
                    actions: { dirtySettings: dirtySettingsMock },
                    namespaced: true
                }
            }
        );
        const changedTextInput = 'Shaken not stirred';
        localWrapper.findComponent(InputField).vm.$emit('update:modelValue', changedTextInput);
        expect(dirtySettingsMock).toHaveBeenCalledWith(expect.anything(), true);
        expect(handleChangeSpy).toHaveBeenCalledWith(defaultProps.control.path, changedTextInput);
    });

    it('sets correct initial value', () => {
        expect(wrapper.findComponent(InputField).vm.modelValue).toBe(defaultProps.control.data);
    });

    it('sets correct label', () => {
        expect(wrapper.find('label').text()).toBe(defaultProps.control.label);
    });

    it('disables input when controlled by a flow variable', () => {
        const localDefaultProps = JSON.parse(JSON.stringify(defaultProps));
        localDefaultProps.control.rootSchema
            .flowVariablesMap[defaultProps.control.path] = {
                controllingFlowVariableAvailable: true,
                controllingFlowVariableName: 'knime.test',
                exposedFlowVariableName: 'test',
                leaf: true
            };
        const localWrapper = mountJsonFormsComponent(TextInput, localDefaultProps);
        expect(localWrapper.vm.disabled).toBeTruthy();
    });

    it('does not render content of TextInput when visible is false', async () => {
        wrapper.setProps({ control: { ...defaultProps.control, visible: false } });
        await wrapper.vm.$nextTick(); // wait until pending promises are resolved
        expect(wrapper.findComponent(LabeledInput).exists()).toBe(false);
    });

    it('checks that it is not rendered if it is an advanced setting', async () => {
        defaultProps.control.uischema.options.isAdvanced = true;
        wrapper = await mountJsonFormsComponent(TextInput, defaultProps);
        expect(wrapper.getComponent(TextInput).isVisible()).toBe(false);
    });

    it('checks that it is rendered if it is an advanced setting and advanced settings are shown', async () => {
        defaultProps.control.rootSchema = { showAdvancedSettings: true };
        defaultProps.control.uischema.options.isAdvanced = true;
        wrapper = await mountJsonFormsComponent(TextInput, defaultProps);
        expect(wrapper.getComponent(TextInput).isVisible()).toBe(true);
    });
});
