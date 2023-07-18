import { afterEach, beforeEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { mountJsonFormsComponent, initializesJsonFormsControl }
    from '@@/test-setup/utils/jsonFormsTestUtils';
import RadioInputBase from '../RadioInputBase.vue';
import LabeledInput from '../LabeledInput.vue';
import RadioButtons from 'webapps-common/ui/components/forms/RadioButtons.vue';
import ValueSwitch from 'webapps-common/ui/components/forms/ValueSwitch.vue';
import BaseRadioButtons from 'webapps-common/ui/components/forms/BaseRadioButtons.vue';
import OnlyFlowVariable from 'webapps-common/ui/assets/img/icons/only-flow-variables.svg';
import BothFlowVariables from 'webapps-common/ui/assets/img/icons/both-flow-variables.svg';
import ExposeFlowVariable from 'webapps-common/ui/assets/img/icons/expose-flow-variables.svg';

describe('RadioInputBase.vue', () => {
    let defaultProps, wrapper, onChangeSpy, component;

    beforeAll(() => {
        onChangeSpy = vi.spyOn(RadioInputBase.methods, 'onChange');
    });

    beforeEach(async () => {
        defaultProps = {
            type: 'radio',
            control: {
                path: 'test',
                enabled: true,
                visible: true,
                label: 'defaultLabel',
                data: 'LOG',
                schema: {
                    oneOf: [
                        {
                            const: 'LOG',
                            title: 'Logarithmic'
                        },
                        {
                            const: 'VALUE',
                            title: 'Linear'
                        }
                    ]
                },
                uischema: {
                    type: 'Control',
                    scope: '#/properties/testScale',
                    options: {
                        format: 'radio',
                        radioLayout: 'horizontal'
                    }
                },
                rootSchema: {
                    hasNodeView: true,
                    flowVariablesMap: {}
                }
            }
        };

        component = await mountJsonFormsComponent(RadioInputBase, { props: defaultProps });
        wrapper = component.wrapper;
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders', () => {
        expect(wrapper.getComponent(RadioInputBase).exists()).toBe(true);
        expect(wrapper.findComponent(LabeledInput).exists()).toBe(true);
        expect(wrapper.findComponent(RadioButtons).exists()).toBe(true);
        expect(wrapper.findComponent(BaseRadioButtons).exists()).toBe(true);
    });

    it('initializes jsonforms', () => {
        initializesJsonFormsControl(component);
    });

    const createTypedWrapper = (type) => mountJsonFormsComponent(
        RadioInputBase,
        {
            props: {
                ...defaultProps,
                type,
                control: {
                    ...defaultProps.control,
                    uischema: {
                        ...defaultProps.control.schema,
                        scope: '#/properties/model/properties/testColumn'
                    }
                }
            }
        }
    );

    const testTypes = [
        ['radio', RadioButtons],
        ['valueSwitch', ValueSwitch],
        ['unknown', RadioButtons]
    ];

    it.each(testTypes)('renders explicit type %s', async (type, comp) => {
        const { wrapper } = await createTypedWrapper(type);
        expect(wrapper.getComponent(RadioInputBase).exists()).toBe(true);
        expect(wrapper.findComponent(LabeledInput).exists()).toBe(true);
        expect(wrapper.findComponent(BaseRadioButtons).exists()).toBe(true);
        expect(wrapper.getComponent(comp).exists()).toBe(true);
    });

    it.each(testTypes)('initializes jsonforms for type %s', async (type, comp) => {
        const component = await createTypedWrapper(type);
        initializesJsonFormsControl(component);
    });

    it('calls onChange when radio button is changed', async () => {
        const dirtySettingsMock = vi.fn();
        const { wrapper, updateData } = await mountJsonFormsComponent(RadioInputBase, {
            props: defaultProps,
            modules: {
                'pagebuilder/dialog': {
                    actions: { dirtySettings: dirtySettingsMock },
                    namespaced: true
                }
            }
        });
        const changedRadioInputBase = 'Shaken not stirred';
        wrapper.findComponent(RadioButtons).vm.$emit('update:modelValue', changedRadioInputBase);
        expect(onChangeSpy).toHaveBeenCalledWith(changedRadioInputBase);
        expect(updateData).toHaveBeenCalledWith(
            expect.anything(), defaultProps.control.path, changedRadioInputBase
        );
        expect(dirtySettingsMock).not.toHaveBeenCalled();
    });

    it('indicates model settings change when model setting is changed', async () => {
        const dirtySettingsMock = vi.fn();
        const { wrapper, updateData } = await mountJsonFormsComponent(
            RadioInputBase,
            {
                props: {
                    ...defaultProps,
                    control: {
                        ...defaultProps.control,
                        uischema: {
                            ...defaultProps.control.schema,
                            scope: '#/properties/model/properties/testColumn'
                        }
                    }
                },
                modules: {
                    'pagebuilder/dialog': {
                        actions: { dirtySettings: dirtySettingsMock },
                        namespaced: true
                    }
                }
            }
        );
        const changedRadioInputBase = 'Shaken not stirred';
        await wrapper.findComponent(RadioButtons).vm.$emit('update:modelValue', changedRadioInputBase);
        expect(dirtySettingsMock).toHaveBeenCalledWith(expect.anything(), true);
        expect(updateData).toHaveBeenCalledWith(
            expect.anything(), defaultProps.control.path, changedRadioInputBase
        );
    });

    it('sets correct initial value', () => {
        expect(wrapper.findComponent(BaseRadioButtons).vm.modelValue).toBe(defaultProps.control.data);
    });

    it('sets correct label', () => {
        expect(wrapper.find('label').text()).toBe(defaultProps.control.label);
    });

    it('sets correct possible values', () => {
        const possibleValues = [{ id: 'LOG', text: 'Logarithmic' }, { id: 'VALUE', text: 'Linear' }];
        expect(wrapper.findComponent(BaseRadioButtons).props().possibleValues).toStrictEqual(possibleValues);
    });

    it('disables radioInput when controlled by a flow variable', () => {
        const localDefaultProps = JSON.parse(JSON.stringify(defaultProps));
        localDefaultProps.control.rootSchema
            .flowVariablesMap[defaultProps.control.path] = {
                controllingFlowVariableAvailable: true,
                controllingFlowVariableName: 'knime.test',
                exposedFlowVariableName: 'test',
                leaf: true
            };

        const { wrapper } = mountJsonFormsComponent(RadioInputBase, { props: localDefaultProps });
        expect(wrapper.vm.disabled).toBeTruthy();
    });

    it('does not disable radioInput when not controlled by a flow variable', () => {
        defaultProps.control.rootSchema
            .flowVariablesMap[defaultProps.control.path] = {};
        expect(wrapper.vm.disabled).toBeFalsy();
    });

    it('renders both icons when controlled and exposed by a flow variable', () => {
        defaultProps.control.rootSchema
            .flowVariablesMap[defaultProps.control.path] = {
                controllingFlowVariableAvailable: true,
                controllingFlowVariableName: 'knime.test',
                exposedFlowVariableName: 'test',
                leaf: true
            };

        const { wrapper } = mountJsonFormsComponent(RadioInputBase, { props: defaultProps });
        const icon = wrapper.findComponent(BothFlowVariables);
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

        const { wrapper } = mountJsonFormsComponent(RadioInputBase, { props: defaultProps });
        const icon = wrapper.findComponent(ExposeFlowVariable);
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

        const { wrapper } = mountJsonFormsComponent(RadioInputBase, { props: defaultProps });
        const icon = wrapper.findComponent(OnlyFlowVariable);
        expect(icon.exists()).toBe(true);
    });

    it('does not render content of RadioInputBase when visible is false', async () => {
        wrapper.setProps({ control: { ...defaultProps.control, visible: false } });
        await wrapper.vm.$nextTick(); // wait until pending promises are resolved
        expect(wrapper.findComponent(LabeledInput).exists()).toBe(false);
    });

    it('checks that it is not rendered if it is an advanced setting', () => {
        defaultProps.control.uischema.options.isAdvanced = true;
        const { wrapper } = mountJsonFormsComponent(RadioInputBase, { props: defaultProps });
        expect(wrapper.getComponent(RadioInputBase).isVisible()).toBe(false);
    });

    it('checks that it is rendered if it is an advanced setting and advanced settings are shown', () => {
        defaultProps.control.rootSchema = { showAdvancedSettings: true };
        defaultProps.control.uischema.options.isAdvanced = true;
        const { wrapper } = mountJsonFormsComponent(RadioInputBase, { props: defaultProps });
        expect(wrapper.getComponent(RadioInputBase).isVisible()).toBe(true);
    });
});
