import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initializesJsonFormsControl, mountJsonFormsComponentWithCallbacks } from
    '@@/test-setup/utils/jsonFormsTestUtils';
import ButtonInput from '../ButtonInput.vue';
import DialogComponentWrapper from '../DialogComponentWrapper.vue';
import FunctionButton from 'webapps-common/ui/components/FunctionButton.vue';
import LoadingIcon from 'webapps-common/ui/components/LoadingIcon.vue';
import Label from 'webapps-common/ui/components/forms/Label.vue';

describe('ButtonInput', () => {
    const states = [{
        id: 'A',
        text: 'Text_A',
        disabled: true,
        primary: true,
        nextState: 'B'
    }, {
        id: 'B',
        text: 'Text_B',
        disabled: false,
        primary: false,
        nextState: 'C'
    }, {
        id: 'C',
        text: 'Text_C'
    }];

    const defaultOptions = {
        format: 'button',
        states,
        displayErrorMessage: true,
        showTitleAndDescription: true,
        actionHandler: 'MyActionHandlerClass'
    };
    const uischema = {
        type: 'Control',
        scope: '#/properties/buttonInput',
        options: defaultOptions
    };
    const schema = {
        properties: {
            buttonInput: {
                type: 'string',
                title: 'Test title'
            }
        }
    };
    const dataSuccess = {
        state: 'SUCCESS',
        result: {
            settingResult: 'token',
            saveResult: true,
            buttonState: states[1].id
        }
    };

    const path = 'test';

    const getProps = (uischemaOptions) => ({
        control: {
            visible: true,
            path,
            schema,
            label: 'Test title',
            uischema: {
                ...uischema,
                options: {
                    format: 'button',
                    ...defaultOptions,
                    ...uischemaOptions
                }
            }
        }
    });

    const mountButtonInput = ({ props, getDataMock }) => mountJsonFormsComponentWithCallbacks(
        ButtonInput, { props, provide: { getDataMock } }
    );

    let wrapper, props, component, getData;

    beforeEach(async () => {
        props = getProps(defaultOptions);
        vi.useFakeTimers();
        getData = vi.fn(() => dataSuccess);
        component = await mountButtonInput({ props, getDataMock: getData });
        wrapper = component.wrapper;
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.clearAllMocks();
    });

    it('initializes jsonforms', () => {
        initializesJsonFormsControl(component);
    });

    describe('renders', () => {
        it('renders main components', () => {
            expect(wrapper.findComponent(DialogComponentWrapper).exists()).toBeTruthy();
            expect(wrapper.findComponent(FunctionButton).exists()).toBeTruthy();
            expect(wrapper.findComponent(Label).exists()).toBeTruthy();
        });

        it('shows loading spinner during loading', async () => {
            wrapper.vm.numPendingRequests = 1;
            await wrapper.vm.$nextTick();
            expect(wrapper.findComponent(LoadingIcon).exists()).toBeTruthy();
        });

        it('displays labeled input on default', () => {
            expect(wrapper.findComponent(Label).exists()).toBeTruthy();
            expect(wrapper.findComponent(Label).text()).contains('Test title');
        });

        it('does not render label if showTitleAndDescription is set to false', async () => {
            const hideTitleUischemaOptions = { showTitleAndDescription: false };
            props = getProps(hideTitleUischemaOptions);
            const { wrapper } = await mountButtonInput({ props, getDataMock: getData });
            expect(wrapper.findComponent(Label).exists()).toBeFalsy();
        });
    });

    describe('actions', () => {
        it('invokes action on click', async () => {
            const currentSettings = { foo: 'bar' };
            await wrapper.setData({
                currentSettings
            });
            await wrapper.findComponent(FunctionButton).find('button').trigger('click');
            expect(getData).toHaveBeenCalledWith({
                method: 'invokeButtonAction',
                options: [uischema.options.actionHandler, states[1].id, currentSettings]
            });
        });

        it('sets next state specified in the uischema immediately', () => {
            wrapper.findComponent(FunctionButton).find('button').trigger('click');
            expect(wrapper.vm.currentState).toStrictEqual(states[2]);
        });

        it('sets next state specified by the returned value', async () => {
            const nextState = states[0];
            getData.mockImplementation(() => ({
                state: 'SUCCESS',
                result: { buttonState: nextState.id }
            }));
            await wrapper.findComponent(FunctionButton).find('button').trigger('click');
            expect(wrapper.vm.currentState).toStrictEqual(nextState);
        });

        it('calls handleChange if the result should be applied', async () => {
            getData.mockImplementation(() => ({
                state: 'SUCCESS',
                result: { settingResult: 'token', saveResult: true, buttonState: states[1].id }
            }));
            wrapper.vm.handleChange = vi.fn();
            await wrapper.findComponent(FunctionButton).find('button').trigger('click');
            vi.runAllTimers();
            expect(wrapper.vm.handleChange).toHaveBeenCalledWith('test', 'token');
        });

        it('does not call handleChange if the result should not be applied', async () => {
            getData.mockImplementation(() => ({
                state: 'SUCCESS',
                result: { settingResult: 'token', saveResult: false, buttonState: states[1].id }
            }));
            vi.runAllTimers();
            wrapper.vm.handleChange = vi.fn();
            await wrapper.findComponent(FunctionButton).find('button').trigger('click');
            vi.runAllTimers();
            expect(wrapper.vm.handleChange).not.toHaveBeenCalled();
        });
    });
    
    describe('errors', () => {
        const errorReult = {
            state: 'FAIL',
            message: 'some error',
            result: { buttonState: states[1].id, saveResult: false, settingResult: null }
        };

        beforeEach(() => {
            getData.mockImplementation(() => errorReult);
        });

        it('displays error message on FAIL', async () => {
            await wrapper.findComponent(FunctionButton).find('button').trigger('click');
            await wrapper.vm.$nextTick();
            expect(wrapper.find('.button-wrapper').text()).contains('Error: some error');
        });
    
        it('displays no error message if displayErrorMessage is false', async () => {
            const noErrorUischema = { displayErrorMessage: false };
            props = getProps(noErrorUischema);
            getData = vi.fn(() => dataSuccess);
            const { wrapper } = await mountButtonInput({ props, getDataMock: vi.fn(() => errorReult) });
            await wrapper.findComponent(FunctionButton).find('button').trigger('click');
            expect(wrapper.find('.button-wrapper').text()).not.contains('Error: some error');
        });

        it('clears error message on next update', async () => {
            await wrapper.findComponent(FunctionButton).find('button').trigger('click');
            expect(wrapper.find('.button-wrapper').text()).contains('Error: some error');
            wrapper.findComponent(FunctionButton).find('button').trigger('click');
            await wrapper.vm.$nextTick();
            expect(wrapper.find('.button-wrapper').text()).not.contains('Error: some error');
        });
    });

    describe('dependencies to other settings', () => {
        let settingsChangeCallback, wrapper, dependencies;

        const dependenciesUischema = ['foo', 'bar'];

        beforeEach(() => {
            const props = getProps({ isCancelable: true });
            props.control.uischema.options.dependencies = dependenciesUischema;
            getData = vi.fn(() => dataSuccess);
            const comp = mountButtonInput({ props, getDataMock: getData });
            wrapper = comp.wrapper;
            const firstWatcherCall = comp.callbacks[0];
            settingsChangeCallback = firstWatcherCall.transformSettings;
            dependencies = firstWatcherCall.dependencies;
            wrapper.vm.cancel = vi.fn();
            wrapper.vm.handleChange = vi.fn();
        });

        it('registers watcher', () => {
            expect(settingsChangeCallback).toBeDefined();
            expect(dependencies).toStrictEqual(dependenciesUischema);
        });

        it('unpacks new data to current settings', () => {
            settingsChangeCallback({ model: { foo: 2, bar: 1 }, view: { baz: 3 } });
            expect(wrapper.vm.currentSettings).toStrictEqual({ foo: 2, bar: 1, baz: 3 });
        });

        it('applies new state defined by the update callback', async () => {
            const settingResult = 'updateSettingResult';
            const nextState = states[0];
            getData.mockImplementation(() => ({
                state: 'SUCCESS',
                result: {
                    settingResult,
                    saveResult: true,
                    buttonState: nextState.id
                }
            }));
            await settingsChangeCallback({ model: { foo: 2, bar: 1 }, view: { baz: 3 } });
            expect(getData).toHaveBeenCalledWith({
                method: 'update',
                options: [uischema.options.actionHandler, { foo: 2, bar: 1, baz: 3 }]
            });
            expect(wrapper.vm.currentState).toBe(nextState);
            vi.runAllTimers();
            expect(wrapper.vm.handleChange).toHaveBeenCalledWith(path, settingResult);
        });
    });

    describe('reset current state', () => {
        it('resets current state after failed request on click', async () => {
            const nextState = states[0];
            wrapper.vm.jsonDataService.data = vi.fn(() => ({
                state: 'FAIL',
                result: {
                    buttonState: nextState.id
                }
            }));
            await wrapper.findComponent(FunctionButton).find('button').trigger('click');
            expect(wrapper.vm.currentState).toBe(states[1]);
        });

        it('resets current state after canceled request on click', async () => {
            const nextState = states[0];
            wrapper.vm.jsonDataService.data = vi.fn(() => ({
                state: 'CANCELED',
                result: {
                    buttonState: nextState.id
                }
            }));
            await wrapper.findComponent(FunctionButton).find('button').trigger('click');
            expect(wrapper.vm.currentState).toBe(states[1]);
        });
    });


    it('does not switch to next state on click when none exists', () => {
        wrapper.vm.currentState = states[2];
        expect(wrapper.vm.currentState).toBe(states[2]);
        wrapper.findComponent(FunctionButton).find('button').trigger('click');
        expect(wrapper.vm.currentState).toBe(states[2]);
    });

    describe('current state', () => {
        it('disabled button if current state is disabled', async () => {
            await wrapper.setData({
                currentState: { disabled: true }
            });
            expect(wrapper.findComponent(FunctionButton).find('button').attributes().class).contains('disabled');
        });

        it('does not disabled button if current state is not disabled', async () => {
            await wrapper.setData({
                currentState: { disabled: false }
            });
            expect(wrapper.findComponent(FunctionButton).find('button').attributes().class).not.contains('disabled');
        });

        it('sets primary if current state is primary', async () => {
            await wrapper.setData({
                currentState: { primary: true }
            });
            expect(wrapper.findComponent(FunctionButton).find('button').attributes().class).contains('primary');
        });

        it('does not set primary if current state is not primary', async () => {
            await wrapper.setData({
                currentState: { primary: false }
            });
            expect(wrapper.findComponent(FunctionButton).find('button').attributes().class).not.contains('primary');
        });

        it('displays custom button texts', async () => {
            const text = 'customText';
            await wrapper.setData({
                currentState: { text }
            });
            expect(wrapper.find('.button-input-text').text()).toBe(text);
        });
    });
});
