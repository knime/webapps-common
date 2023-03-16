import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { mountJsonFormsComponent, initializesJsonFormsControl, mountJsonFormsComponentWithStore } from
    '@@/test-setup/utils/jsonFormsTestUtils';
import CheckboxInput from '../CheckboxInput.vue';
import ErrorMessage from '../ErrorMessage.vue';
import FlowVariableIcon from '../FlowVariableIcon.vue';
import DescriptionPopover from '../DescriptionPopover.vue';
import ReexecutionIcon from 'webapps-common/ui/assets/img/icons/reexecution.svg';
import Checkbox from 'webapps-common/ui/components/forms/Checkbox.vue';
import BothFlowVariables from 'webapps-common/ui/assets/img/icons/both-flow-variables.svg';
import OnlyFlowVariable from 'webapps-common/ui/assets/img/icons/only-flow-variables.svg';
import ExposeFlowVariable from 'webapps-common/ui/assets/img/icons/expose-flow-variables.svg';

describe('CheckboxInput.vue', () => {
    let wrapper, onChangeSpy, defaultProps;

    beforeAll(() => {
        onChangeSpy = vi.spyOn(CheckboxInput.methods, 'onChange');
    });
    
    beforeEach(async () => {
        defaultProps = {
            control: {
                path: 'test',
                enabled: true,
                visible: true,
                label: 'defaultLabel',
                data: true,
                schema: {
                    properties: {
                        showTooltip: {
                            type: 'boolean',
                            title: 'Show tooltip'
                        }
                    }
                },
                uischema: {
                    type: 'Control',
                    scope: '#/properties/showTooltip',
                    options: {
                        format: 'checkbox'
                    }
                },
                rootSchema: {
                    hasNodeView: true,
                    flowVariablesMap: {}
                }
            }
        };
        wrapper = await mountJsonFormsComponent(CheckboxInput, defaultProps);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });
    
    it('renders', () => {
        expect(wrapper.getComponent(CheckboxInput).exists()).toBe(true);
        expect(wrapper.getComponent(Checkbox).exists()).toBe(true);
        expect(wrapper.getComponent(ErrorMessage).exists()).toBe(true);
        expect(wrapper.findComponent(ReexecutionIcon).exists()).toBe(false);
    });

    it('renders the description popover', async () => {
        expect(wrapper.findComponent(DescriptionPopover).exists()).toBe(false);
        wrapper.setProps({ control: { ...defaultProps.control, description: 'foo' } });
        await wrapper.vm.$nextTick(); // wait until pending promises are resolved
        expect(wrapper.findComponent(DescriptionPopover).exists()).toBe(true);
    });
    
    it('initializes jsonforms', () => {
        initializesJsonFormsControl(wrapper);
    });

    it('calls onChange when checkbox is changed', async () => {
        const dirtySettingsMock = vi.fn();
        const localWrapper = await mountJsonFormsComponentWithStore(CheckboxInput, defaultProps, {
            'pagebuilder/dialog': {
                actions: { dirtySettings: dirtySettingsMock },
                namespaced: true
            }
        });
        await localWrapper.findComponent(Checkbox).vm.$emit('update:modelValue', true);
        expect(onChangeSpy).toHaveBeenCalledWith(true);
        expect(localWrapper.vm.handleChange).toHaveBeenCalledWith(defaultProps.control.path, true);
        expect(dirtySettingsMock).not.toHaveBeenCalled();
    });

    it('indicates model settings change when model setting is changed', async () => {
        const dirtySettingsMock = vi.fn();
        const localWrapper = await mountJsonFormsComponentWithStore(
            CheckboxInput,
            {
                ...defaultProps,
                control: {
                    ...defaultProps.control,
                    uischema: {
                        ...defaultProps.control.schema,
                        scope: '#/properties/model/filterMissingValues'
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
        await localWrapper.findComponent(Checkbox).vm.$emit('update:modelValue', true);
        expect(onChangeSpy).toHaveBeenCalledWith(true);
        expect(localWrapper.vm.handleChange).toHaveBeenCalledWith(defaultProps.control.path, true);
        expect(dirtySettingsMock).toHaveBeenCalledWith(expect.anything(), true);
    });

    it('checks that re-execution icon is present if it is a model setting', async () => {
        const localWrapper = await mountJsonFormsComponent(
            CheckboxInput,
            {
                ...defaultProps,
                control: {
                    ...defaultProps.control,
                    uischema: {
                        ...defaultProps.control.schema,
                        scope: '#/properties/model/filterMissingValues'
                    }
                }
            }
        );
        expect(localWrapper.findComponent(ReexecutionIcon).exists()).toBe(true);
    });

    it('sets correct initial value', () => {
        expect(wrapper.findComponent(Checkbox).vm.modelValue).toBe(defaultProps.control.data);
    });

    it('sets correct label', () => {
        expect(wrapper.find('label').text()).toBe(defaultProps.control.label);
    });

    it('disables input when controlled by a flow variable', () => {
        defaultProps.control.rootSchema
            .flowVariablesMap[defaultProps.control.path] = {
                controllingFlowVariableAvailable: true,
                controllingFlowVariableName: 'knime.test',
                exposedFlowVariableName: 'test',
                leaf: true
            };
        const localWrapper = mountJsonFormsComponent(CheckboxInput, defaultProps);
        expect(localWrapper.vm.disabled).toBeTruthy();
    });

    it('renders both icons when controlled and exposed by a flow variable', () => {
        defaultProps.control.rootSchema
            .flowVariablesMap[defaultProps.control.path] = {
                controllingFlowVariableAvailable: true,
                controllingFlowVariableName: 'knime.test',
                exposedFlowVariableName: 'test',
                leaf: true
            };
        
        const localWrapper = mountJsonFormsComponent(CheckboxInput, defaultProps);
        expect(Boolean(localWrapper.findComponent(FlowVariableIcon).vm.isControlledByFlowVariable)).toBe(true);
        expect(Boolean(localWrapper.findComponent(FlowVariableIcon).vm.isExposedFlowVariable)).toBe(true);
        
        const icon = localWrapper.findComponent(BothFlowVariables);
        expect(icon.exists()).toBe(true);
    });

    it('renders exposedFlowVariable icon when exposed flow variable exists', () => {
        defaultProps.control.rootSchema
            .flowVariablesMap[defaultProps.control.path] = {
                controllingFlowVariableAvailable: true,
                controllingFlowVariableName: null,
                exposedFlowVariableName: 'test',
                leaf: true
            };

        const localWrapper = mountJsonFormsComponent(CheckboxInput, defaultProps);
        expect(Boolean(localWrapper.findComponent(FlowVariableIcon).vm.isControlledByFlowVariable)).toBe(false);
        expect(Boolean(localWrapper.findComponent(FlowVariableIcon).vm.isExposedFlowVariable)).toBe(true);
        
        const icon = localWrapper.findComponent(ExposeFlowVariable);
        expect(icon.exists()).toBe(true);
    });

    it('renders onlyFlowVariable icon when controlled by a flow variable', () => {
        defaultProps.control.rootSchema
            .flowVariablesMap[defaultProps.control.path] = {
                controllingFlowVariableAvailable: true,
                controllingFlowVariableName: 'knime.test',
                exposedFlowVariableName: null,
                leaf: true
            };

        const localWrapper = mountJsonFormsComponent(CheckboxInput, defaultProps);
        expect(Boolean(localWrapper.findComponent(FlowVariableIcon).vm.isControlledByFlowVariable)).toBe(true);
        expect(Boolean(localWrapper.findComponent(FlowVariableIcon).vm.isExposedFlowVariable)).toBe(false);

        const icon = localWrapper.findComponent(OnlyFlowVariable);
        expect(icon.exists()).toBe(true);
    });

    it('does not render content of CheckboxInput when visible is false', async () => {
        wrapper.setProps({ control: { ...defaultProps.control,
            visible: false,
            errors: 'errors',
            description: 'description' } });
        await wrapper.vm.$nextTick(); // wait until pending promises are resolved
        expect(wrapper.findComponent(Checkbox).exists()).toBe(false);
        expect(wrapper.findComponent(ErrorMessage).exists()).toBe(false);
        expect(wrapper.findComponent(ReexecutionIcon).exists()).toBe(false);
    });

    it('checks that it is not rendered if it is an advanced setting', async () => {
        defaultProps.control.uischema.options.isAdvanced = true;
        wrapper = await mountJsonFormsComponent(CheckboxInput, defaultProps);
        expect(wrapper.getComponent(CheckboxInput).isVisible()).toBe(false);
    });

    it('checks that it is rendered if it is an advanced setting and advanced settings are shown', async () => {
        defaultProps.control.rootSchema = { showAdvancedSettings: true };
        defaultProps.control.uischema.options.isAdvanced = true;
        wrapper = await mountJsonFormsComponent(CheckboxInput, defaultProps);
        expect(wrapper.getComponent(CheckboxInput).isVisible()).toBe(true);
    });
});
