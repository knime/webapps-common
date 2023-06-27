import { afterEach, beforeEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { mountJsonFormsComponent, initializesJsonFormsControl, mountJsonFormsComponentWithStore,
    mountJsonFormsComponentWithCallbacks } from '@@/test-setup/utils/jsonFormsTestUtils';
import DropdownInput from '../DropdownInput.vue';
import LabeledInput from '../LabeledInput.vue';
import Dropdown from 'webapps-common/ui/components/forms/Dropdown.vue';
import flushPromises from 'flush-promises';

describe('DropdownInput.vue', () => {
    let wrapper, onChangeSpy, defaultProps, component;

    beforeAll(() => {
        onChangeSpy = vi.spyOn(DropdownInput.methods, 'onChange');
    });

    const path = 'test';

    beforeEach(async () => {
        defaultProps = {
            control: {
                path,
                enabled: true,
                visible: true,
                data: 'Universe_0_0',
                label: 'defaultLabel',
                schema: {
                    title: 'Y Axis Column'
                },
                uischema: {
                    type: 'Control',
                    scope: '#/properties/view/properties/yAxisColumn',
                    options: {
                        format: 'columnSelection',
                        showRowKeys: false,
                        showNoneColumn: false,
                        possibleValues: [
                            {
                                id: 'Universe_0_0',
                                text: 'Universe_0_0'
                            },
                            {
                                id: 'Universe_0_1',
                                text: 'Universe_0_1'
                            },
                            {
                                id: 'Universe_1_0',
                                text: 'Universe_1_0'
                            },
                            {
                                id: 'Universe_1_1',
                                text: 'Universe_1_1'
                            }
                        ]
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
        component = await mountJsonFormsComponent(DropdownInput, defaultProps);
        wrapper = component.wrapper;
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
        initializesJsonFormsControl(component);
    });

    describe('reacts to dropdown input change', () => {
        let dirtySettingsMock;

        beforeEach(() => {
            dirtySettingsMock = vi.fn();
        });

        afterEach(() => {
            vi.clearAllMocks();
        });

        it('calls onChange when input is changed', async () => {
            const { wrapper, updateData } = await mountJsonFormsComponentWithCallbacks(
                DropdownInput,
                { props: defaultProps },
                {
                    'pagebuilder/dialog': {
                        actions: { dirtySettings: dirtySettingsMock },
                        namespaced: true
                    }
                }
            );
            const changedDropdownInput = 'Shaken not stirred';
            wrapper.findComponent(Dropdown).vm.$emit('update:modelValue', changedDropdownInput);
            expect(onChangeSpy).toHaveBeenCalledWith(changedDropdownInput);
            expect(updateData).toHaveBeenCalledWith(
                expect.anything(), defaultProps.control.path, changedDropdownInput
            );
            expect(dirtySettingsMock).not.toHaveBeenCalled();
        });
    
        it('indicates model settings change when model setting is changed', async () => {
            const { wrapper, updateData } = await mountJsonFormsComponentWithCallbacks(
                DropdownInput,
                { props: {
                    ...defaultProps,
                    control: {
                        ...defaultProps.control,
                        uischema: {
                            ...defaultProps.control.schema,
                            scope: '#/properties/model/properties/yAxisColumn'
                        }
                    }
                } },
                {
                    'pagebuilder/dialog': {
                        actions: { dirtySettings: dirtySettingsMock },
                        namespaced: true
                    }
                }
            );
            const changedDropdownInput = 'Shaken not stirred';
            wrapper.findComponent(Dropdown).vm.$emit('update:modelValue', changedDropdownInput);
            expect(dirtySettingsMock).toHaveBeenCalledWith(expect.anything(), true);
            expect(updateData).toHaveBeenCalledWith(
                expect.anything(), defaultProps.control.path, changedDropdownInput
            );
        });
    });
    

    it('sets correct initial value', () => {
        expect(wrapper.findComponent(Dropdown).vm.modelValue).toBe(defaultProps.control.data);
    });

    it('sets correct label', () => {
        expect(wrapper.find('label').text()).toBe(defaultProps.control.label);
    });

    it('checks that placeholder text is correctly set if no possible values are present', () => {
        defaultProps.control.uischema.options.possibleValues = [];
        const { wrapper } = mountJsonFormsComponentWithStore(
            DropdownInput,
            defaultProps
        );
        expect(wrapper.vm.placeholderText).toBe('No values present');
    });

    it('checks that placeholder text is correctly set if there are possible values present', () => {
        defaultProps.control.data = '';
        const { wrapper } = mountJsonFormsComponentWithStore(
            DropdownInput,
            defaultProps
        );
        expect(wrapper.vm.placeholderText).toBe('No value selected');
    });

    it('disables dropdown when controlled by a flow variable', () => {
        expect(wrapper.vm.disabled).toBeTruthy();
        expect(wrapper.findComponent(Dropdown).vm.disabled).toBeTruthy();
    });

    it('does not disable dropdown when not controlled by a flow variable', async () => {
        delete defaultProps.control.rootSchema.flowVariablesMap;
        const { wrapper } = await mountJsonFormsComponent(DropdownInput, defaultProps);
        expect(wrapper.vm.disabled).toBeFalsy();
        expect(wrapper.findComponent(Dropdown).vm.disabled).toBeFalsy();
    });

    it('disables dropdown when there are no possible values', async () => {
        defaultProps.control.uischema.options.possibleValues = [];
        const { wrapper } = await mountJsonFormsComponent(DropdownInput, defaultProps);
        expect(wrapper.vm.disabled).toBeTruthy();
        expect(wrapper.findComponent(Dropdown).vm.disabled).toBeTruthy();
    });

    it('does not render content of DropdownInput when visible is false', () => {
        defaultProps.control.visible = false;
        const { wrapper } = mountJsonFormsComponent(DropdownInput, defaultProps);
        expect(wrapper.findComponent(LabeledInput).exists()).toBe(false);
    });

    it('checks that it is not rendered if it is an advanced setting', () => {
        defaultProps.control.uischema.options.isAdvanced = true;
        const { wrapper } = mountJsonFormsComponent(DropdownInput, defaultProps);
        expect(wrapper.getComponent(DropdownInput).isVisible()).toBe(false);
    });

    it('checks that it is rendered if it is an advanced setting and advanced settings are shown', () => {
        defaultProps.control.rootSchema = { showAdvancedSettings: true };
        defaultProps.control.uischema.options.isAdvanced = true;
        const { wrapper } = mountJsonFormsComponent(DropdownInput, defaultProps);
        expect(wrapper.getComponent(DropdownInput).isVisible()).toBe(true);
    });
    
    describe('update initial data', () => {
        it('updates initial data on change', async () => {
            const updatedValue = 'Universe_0_1 (updated value)';
            const props = {
                ...defaultProps,
                dropdownValueToControlData: () => updatedValue
            };
            const { updateData } = await mountJsonFormsComponentWithCallbacks(DropdownInput, { props }, null, false);
            expect(updateData).toHaveBeenCalledWith(
                expect.anything(), defaultProps.control.path, updatedValue
            );
        });

        it('does not update initial data if they are current', async () => {
            const { updateData } = await mountJsonFormsComponentWithCallbacks(DropdownInput, { props: defaultProps });
            expect(updateData).not.toHaveBeenCalled();
        });
    });


    describe('dependencies to other settings', () => {
        let settingsChangeCallback, initialSettingsChangeCallback, wrapper, dependencies, handleResultSpy;

        const dependenciesUischema = ['foo', 'bar'];
        const result = [{ id: 'first', text: 'First' }, { id: 'second', text: 'Second' }];
        const newSettings = { view: { foo: 'foo', bar: 'bar' }, model: { baz: 'baz' } };

        beforeAll(() => {
            handleResultSpy = vi.spyOn(DropdownInput.methods, 'handleResult');
        });

        beforeEach(() => {
            defaultProps.control.uischema.options.dependencies = dependenciesUischema;
            defaultProps.control.uischema.options.choicesUpdateHandler = 'UpdateHandler';
            const comp = mountJsonFormsComponentWithCallbacks(DropdownInput, { props: defaultProps });
            wrapper = comp.wrapper;
            wrapper.vm.jsonDataService = {
                data: vi.fn(() => ({
                    result,
                    state: 'SUCCESS',
                    message: null
                }))
            };
            
            const callbacks = comp.callbacks;
            const firstWatcherCall = callbacks[0];
            settingsChangeCallback = firstWatcherCall.transformSettings;
            initialSettingsChangeCallback = firstWatcherCall.init;
            dependencies = firstWatcherCall.dependencies;
            wrapper.vm.cancel = vi.fn();
        });

        it('registers watcher', () => {
            expect(settingsChangeCallback).toBeDefined();
            expect(dependencies).toStrictEqual(dependenciesUischema);
        });

        it('requests new data if dependencies change', () => {
            settingsChangeCallback({ view: { foo: 'foo', bar: 'bar' }, model: { baz: 'baz' } });
            expect(wrapper.vm.jsonDataService.data).toHaveBeenCalledWith({
                method: 'update',
                options: [
                    'UpdateHandler',
                    {
                        foo: 'foo',
                        bar: 'bar',
                        baz: 'baz'
                    }
                ]
            });
        });


        it('sets new options and selected the first option', async () => {
            await settingsChangeCallback(newSettings);
            await flushPromises();
            expect(wrapper.vm.options).toStrictEqual(
                result
            );
            expect(handleResultSpy).toHaveBeenCalledWith(result, newSettings, true);
        });

        it('sets new options without changing the data on the initial update', async () => {
            initialSettingsChangeCallback(newSettings);
            await flushPromises();
            expect(wrapper.vm.options).toStrictEqual(
                result
            );
            expect(handleResultSpy).toHaveBeenCalledWith(result, newSettings, false);
        });

        it('selects null if the fetched options are empty', async () => {
            wrapper.vm.jsonDataService.data = vi.fn(() => ({
                result: [],
                state: 'SUCCESS',
                message: null
            }));
            settingsChangeCallback(newSettings);
            await flushPromises();
            expect(wrapper.vm.options).toStrictEqual([]);
            expect(handleResultSpy).toHaveBeenCalledWith([], newSettings, true);
            expect(wrapper.vm.getFirstValueFromDropdownOrNull([])).toBeNull();
        });


        it('sets empty options and warns about error on state FAIL', async () => {
            const message = 'Error message';
            wrapper.vm.jsonDataService.data = vi.fn(() => ({
                result: null,
                state: 'FAIL',
                message
            }));
            const knimeService = {
                createAlert: vi.fn(() => 'Alert'),
                sendWarning: vi.fn()
            };
            wrapper.vm.getKnimeService = () => knimeService;
            settingsChangeCallback(newSettings);
            await flushPromises();
            expect(wrapper.vm.options).toStrictEqual([]);
            expect(handleResultSpy).toHaveBeenCalledWith([], newSettings, true);
            expect(knimeService.createAlert).toHaveBeenCalledWith({
                type: 'error',
                message
            });
            expect(knimeService.sendWarning).toHaveBeenCalledWith('Alert');
        });
    });
});
