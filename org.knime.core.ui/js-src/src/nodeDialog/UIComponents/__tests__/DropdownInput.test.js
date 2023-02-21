import { afterEach, beforeEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { mountJsonFormsComponent, initializesJsonFormsControl, mountJsonFormsComponentWithStore }
    from '@@/test-setup/utils/jsonFormsTestUtils';
import DropdownInput from '@/components/UIComponents/DropdownInput.vue';
import LabeledInput from '@/components/UIComponents/LabeledInput.vue';
import Dropdown from 'webapps-common/ui/components/forms/Dropdown.vue';

describe('DropdownInput.vue', () => {
    let wrapper, onChangeSpy, handleChangeSpy, defaultProps;

    beforeAll(() => {
        onChangeSpy = vi.spyOn(DropdownInput.methods, 'onChange');
        handleChangeSpy = DropdownInput.methods.handleChange = vi.fn();
    });
    
    beforeEach(async () => {
        defaultProps = {
            control: {
                path: 'test',
                enabled: true,
                visible: true,
                data: 'Universe_0_0',
                label: 'defaultLabel',
                schema: {
                    oneOf: [
                        {
                            const: 'Universe_0_0',
                            title: 'Universe_0_0'
                        },
                        {
                            const: 'Universe_0_1',
                            title: 'Universe_0_1'
                        },
                        {
                            const: 'Universe_1_0',
                            title: 'Universe_1_0'
                        },
                        {
                            const: 'Universe_1_1',
                            title: 'Universe_1_1'
                        }
                    ],
                    title: 'Y Axis Column'
                },
                uischema: {
                    type: 'Control',
                    scope: '#/properties/view/properties/yAxisColumn',
                    options: {
                        format: 'columnSelection',
                        showRowKeys: false,
                        showNoneColumn: false
                    }
                },
                rootSchema: {
                    hasNodeView: true,
                    flowVariablesMap: {
                        test: {
                            controllingFlowVariableAvailable: true,
                            controllingFlowVariableName: 'knime.test',
                            exposedFlowVariableName: 'test',
                            leaf: true
                        }
                    }
                }
            }
        };
        wrapper = await mountJsonFormsComponent(DropdownInput, defaultProps);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders', () => {
        expect(wrapper.getComponent(DropdownInput).exists()).toBe(true);
        expect(wrapper.findComponent(LabeledInput).exists()).toBe(true);
        expect(wrapper.findComponent(Dropdown).exists()).toBe(true);
    });
    
    it('initializes jsonforms', () => {
        initializesJsonFormsControl(wrapper);
    });

    it('calls onChange when input is changed', async () => {
        const dirtySettingsMock = vi.fn();
        const localWrapper = await mountJsonFormsComponentWithStore(DropdownInput, defaultProps, {
            'pagebuilder/dialog': {
                actions: { dirtySettings: dirtySettingsMock },
                namespaced: true
            }
        });
        const changedDropdownInput = 'Shaken not stirred';
        localWrapper.findComponent(Dropdown).vm.$emit('update:modelValue', changedDropdownInput);
        expect(onChangeSpy).toHaveBeenCalledWith(changedDropdownInput);
        expect(handleChangeSpy).toHaveBeenCalledWith(defaultProps.control.path, changedDropdownInput);
        expect(dirtySettingsMock).not.toHaveBeenCalled();
    });

    it('indicates model settings change when model setting is changed', async () => {
        const dirtySettingsMock = vi.fn();
        const localWrapper = await mountJsonFormsComponentWithStore(
            DropdownInput,
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
        const changedDropdownInput = 'Shaken not stirred';
        localWrapper.findComponent(Dropdown).vm.$emit('update:modelValue', changedDropdownInput);
        expect(dirtySettingsMock).toHaveBeenCalledWith(expect.anything(), true);
        expect(handleChangeSpy).toHaveBeenCalledWith(defaultProps.control.path, changedDropdownInput);
    });

    it('sets correct initial value', () => {
        expect(wrapper.findComponent(Dropdown).vm.modelValue).toBe(defaultProps.control.data);
    });

    it('sets correct label', () => {
        expect(wrapper.find('label').text()).toBe(defaultProps.control.label);
    });

    it('transforms empty oneOf into empty possible values', async () => {
        defaultProps.control.schema.oneOf = [{ const: '', title: '' }];
        const localWrapper = await mountJsonFormsComponentWithStore(
            DropdownInput,
            defaultProps
        );
        expect(localWrapper.findComponent(Dropdown).props().possibleValues).toEqual([]);
    });

    it('Checks that placeholder text is correctly set if no possible values are present', async () => {
        defaultProps.control.schema.oneOf = [{ const: '', title: '' }];
        const localWrapper = await mountJsonFormsComponentWithStore(
            DropdownInput,
            defaultProps
        );
        expect(localWrapper.vm.placeholderText).toEqual('No values present');
    });

    it('Checks that placeholder text is correctly set if there are possible values present', async () => {
        defaultProps.control.data = '';
        const localWrapper = await mountJsonFormsComponentWithStore(
            DropdownInput,
            defaultProps
        );
        expect(localWrapper.vm.placeholderText).toEqual('No value selected');
    });

    it('disables dropdown when controlled by a flow variable', () => {
        expect(wrapper.vm.disabled).toBeTruthy();
        expect(wrapper.findComponent(Dropdown).vm.disabled).toBeTruthy();
    });

    it('does not disable dropdown when not controlled by a flow variable', async () => {
        delete defaultProps.control.rootSchema.flowVariablesMap;
        wrapper = await mountJsonFormsComponent(DropdownInput, defaultProps);
        expect(wrapper.vm.disabled).toBeFalsy();
        expect(wrapper.findComponent(Dropdown).vm.disabled).toBeFalsy();
    });

    it('disables dropdown when there are no possible values', async () => {
        defaultProps.control.schema.oneOf = [{ const: '', title: '' }];
        wrapper = await mountJsonFormsComponent(DropdownInput, defaultProps);
        expect(wrapper.vm.disabled).toBeTruthy();
        expect(wrapper.findComponent(Dropdown).vm.disabled).toBeTruthy();
    });

    it('does not render content of DropdownInput when visible is false', async () => {
        defaultProps.control.visible = false;
        wrapper = await mountJsonFormsComponent(DropdownInput, defaultProps);
        expect(wrapper.findComponent(LabeledInput).exists()).toBe(false);
    });

    it('checks that it is not rendered if it is an advanced setting', async () => {
        defaultProps.control.uischema.options.isAdvanced = true;
        wrapper = await mountJsonFormsComponent(DropdownInput, defaultProps);
        expect(wrapper.getComponent(DropdownInput).isVisible()).toBe(false);
    });

    it('checks that it is rendered if it is an advanced setting and advanced settings are shown', async () => {
        defaultProps.control.rootSchema = { showAdvancedSettings: true };
        defaultProps.control.uischema.options.isAdvanced = true;
        wrapper = await mountJsonFormsComponent(DropdownInput, defaultProps);
        expect(wrapper.getComponent(DropdownInput).isVisible()).toBe(true);
    });
});
