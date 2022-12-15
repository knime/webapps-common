import { mountJsonFormsComponent, initializesJsonFormsControl, mountJsonFormsComponentWithStore }
    from '~/test/unit/suites/utils/jsonFormsTestUtils';
import TextInput from '@/components/UIComponents/TextInput.vue';
import LabeledInput from '@/components/UIComponents/LabeledInput.vue';
import InputField from '~/webapps-common/ui/components/forms/InputField.vue';

describe('TextInput.vue', () => {
    let defaultPropsData, wrapper, onChangeSpy, handleChangeSpy;

    beforeAll(() => {
        onChangeSpy = jest.spyOn(TextInput.methods, 'onChange');
        handleChangeSpy = TextInput.methods.handleChange = jest.fn();
    });
    
    beforeEach(async () => {
        defaultPropsData = {
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

        wrapper = await mountJsonFormsComponent(TextInput, defaultPropsData);
    });

    afterEach(() => {
        jest.clearAllMocks();
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
        const dirtySettingsMock = jest.fn();
        const localWrapper = await mountJsonFormsComponentWithStore(TextInput, defaultPropsData, {
            'pagebuilder/dialog': {
                actions: { dirtySettings: dirtySettingsMock },
                namespaced: true
            }
        });
        const changedTextInput = 'Shaken not stirred';
        localWrapper.findComponent(InputField).vm.$emit('input', changedTextInput);
        expect(onChangeSpy).toHaveBeenCalledWith(changedTextInput);
        expect(handleChangeSpy).toHaveBeenCalledWith(defaultPropsData.control.path, changedTextInput);
        expect(dirtySettingsMock).not.toHaveBeenCalled();
    });

    it('indicates model settings change when model setting is changed', async () => {
        const dirtySettingsMock = jest.fn();
        const localWrapper = await mountJsonFormsComponentWithStore(
            TextInput,
            {
                ...defaultPropsData,
                control: {
                    ...defaultPropsData.control,
                    uischema: {
                        ...defaultPropsData.control.schema,
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
        localWrapper.findComponent(InputField).vm.$emit('input', changedTextInput);
        expect(dirtySettingsMock).toHaveBeenCalledWith(expect.anything(), true, expect.undefined);
        expect(handleChangeSpy).toHaveBeenCalledWith(defaultPropsData.control.path, changedTextInput);
    });

    it('sets correct initial value', () => {
        expect(wrapper.findComponent(InputField).vm.value).toBe(defaultPropsData.control.data);
    });

    it('sets correct label', () => {
        expect(wrapper.findComponent('label').text()).toBe(defaultPropsData.control.label);
    });

    it('disables input when controlled by a flow variable', () => {
        const localDefaultPropsData = JSON.parse(JSON.stringify(defaultPropsData));
        localDefaultPropsData.control.rootSchema
            .flowVariablesMap[defaultPropsData.control.path] = {
                controllingFlowVariableAvailable: true,
                controllingFlowVariableName: 'knime.test',
                exposedFlowVariableName: 'test',
                leaf: true
            };
        const localWrapper = mountJsonFormsComponent(TextInput, localDefaultPropsData);
        expect(localWrapper.vm.disabled).toBeTruthy();
    });

    it('does not render content of TextInput when visible is false', async () => {
        wrapper.setProps({ control: { ...defaultPropsData.control, visible: false } });
        await wrapper.vm.$nextTick(); // wait until pending promises are resolved
        expect(wrapper.findComponent(LabeledInput).exists()).toBe(false);
    });

    it('checks that it is not rendered if it is an advanced setting', async () => {
        defaultPropsData.control.uischema.options.isAdvanced = true;
        wrapper = await mountJsonFormsComponent(TextInput, defaultPropsData);
        expect(wrapper.getComponent(TextInput).isVisible()).toBe(false);
    });

    it('checks that it is rendered if it is an advanced setting and advanced settings are shown', async () => {
        defaultPropsData.control.rootSchema = { showAdvancedSettings: true };
        defaultPropsData.control.uischema.options.isAdvanced = true;
        wrapper = await mountJsonFormsComponent(TextInput, defaultPropsData);
        expect(wrapper.getComponent(TextInput).isVisible()).toBe(true);
    });
});
