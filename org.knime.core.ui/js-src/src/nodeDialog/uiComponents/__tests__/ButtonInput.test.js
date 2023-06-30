import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initializesJsonFormsControl, mountJsonFormsComponentWithCallbacks } from
    '@@/test-setup/utils/jsonFormsTestUtils';
import ButtonInput from '../ButtonInput.vue';
import DialogComponentWrapper from '../DialogComponentWrapper.vue';
import FunctionButton from 'webapps-common/ui/components/FunctionButton.vue';
import LoadingIcon from 'webapps-common/ui/components/LoadingIcon.vue';
import Label from 'webapps-common/ui/components/forms/Label.vue';

describe('ButtonInput', () => {
    let wrapper, props;
    const defaultOptions = {
        format: 'button',
        buttonTexts: {
            invoke: 'Custom Action Text',
            cancel: 'Custom Cancel Text',
            succeeded: 'Custom Succeeded Text'
        },
        isMultipleUse: false,
        displayErrorMessage: true,
        isCancelable: true,
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
        result: 'token'
    };

    const path = 'test';

    const getProps = (uischemaOptions = defaultOptions) => ({
        control: {
            visible: true,
            path,
            schema,
            label: 'Test title',
            uischema: {
                ...uischema,
                options: {
                    format: 'button',
                    ...uischemaOptions
                }
            }
        }
    });

    beforeEach(async () => {
        props = getProps(defaultOptions);
        vi.useFakeTimers();
        const comp = await mountJsonFormsComponentWithCallbacks(ButtonInput, { props });
        wrapper = comp.wrapper;
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.clearAllMocks();
    });

    it('initializes jsonforms', () => {
        initializesJsonFormsControl(wrapper);
    });

    describe('renders', () => {
        it('main components', () => {
            expect(wrapper.findComponent(DialogComponentWrapper).exists()).toBeTruthy();
            expect(wrapper.findComponent(FunctionButton).exists()).toBeTruthy();
            expect(wrapper.findComponent(Label).exists()).toBeTruthy();
        });

        it('displays custom button texts', async () => {
            expect(wrapper.find('.button-input-text').text()).toBe('Custom Action Text');
            wrapper.vm.isLoading = true;
            await wrapper.vm.$nextTick();
            expect(wrapper.find('.button-input-text').text()).toBe('Custom Cancel Text');
            wrapper.vm.isLoading = false;
            wrapper.vm.control.data = dataSuccess.result;
            await wrapper.vm.$nextTick();
            expect(wrapper.find('.button-input-text').text()).toBe('Custom Succeeded Text');
        });
    
        it('displays default button texts', async () => {
            const emptyUischemaOptions = {};
    
            props = getProps(emptyUischemaOptions);
            const { wrapper } = await mountJsonFormsComponentWithCallbacks(ButtonInput, { props });
            expect(wrapper.find('.button-input-text').text()).toBe('Invoke action');
            wrapper.vm.isLoading = true;
            await wrapper.vm.$nextTick();
            expect(wrapper.find('.button-input-text').text()).toBe('Cancel');
            wrapper.vm.isLoading = false;
            wrapper.vm.control.data = dataSuccess.result;
            await wrapper.vm.$nextTick();
            expect(wrapper.find('.button-input-text').text()).toBe('Success');
        });

        it('displays cancel button text when loading even if data are present', async () => {
            const emptyUischemaOptions = {};
    
            props = getProps(emptyUischemaOptions);
            const { wrapper } = await mountJsonFormsComponentWithCallbacks(ButtonInput, { props });
            wrapper.vm.control.data = dataSuccess.result;
            await wrapper.vm.$nextTick();
            expect(wrapper.find('.button-input-text').text()).toBe('Success');
            wrapper.vm.isLoading = true;
            await wrapper.vm.$nextTick();
            expect(wrapper.find('.button-input-text').text()).toBe('Cancel');
        });

        it('shows loading spinner during loading', async () => {
            wrapper.vm.isLoading = true;
            await wrapper.vm.$nextTick();
            expect(wrapper.findComponent(LoadingIcon).exists()).toBeTruthy();
        });

        it('displays labeled input on default', () => {
            expect(wrapper.findComponent(Label).exists()).toBeTruthy();
            expect(wrapper.findComponent(Label).text()).contains('Test title');
        });

        it('does not render label if showTitle is set to false', async () => {
            const hideTitleUischemaOptions = { showTitleAndDescription: false };
            props = getProps(hideTitleUischemaOptions);
            const { wrapper } = await mountJsonFormsComponentWithCallbacks(ButtonInput, { props });
            expect(wrapper.findComponent(Label).exists()).toBeFalsy();
        });
    });

    describe('actions', () => {
        it('invokes action on click', async () => {
            wrapper.vm.jsonDataService.data = vi.fn();
            const currentSettings = { foo: 'bar' };
            await wrapper.setData({
                currentSettings
            });
            await wrapper.findComponent(FunctionButton).find('button').trigger('click');
            expect(wrapper.vm.jsonDataService.data).toHaveBeenCalledWith({
                method: 'invokeActionHandler',
                options: [uischema.options.actionHandler, 'click', currentSettings]
            });
        });

        it('cancels action on click during loading', async () => {
            wrapper.vm.jsonDataService.data = vi.fn();
            wrapper.vm.isLoading = true;
            await wrapper.findComponent(FunctionButton).find('button').trigger('click');
            expect(wrapper.vm.jsonDataService.data).toHaveBeenCalledWith({
                method: 'invokeActionHandler',
                options: [uischema.options.actionHandler, 'cancel']
            });
        });

        it('disables button after action succeeded', async () => {
            wrapper.vm.jsonDataService.data = vi.fn(() => dataSuccess);
            wrapper.vm.handleChange = vi.fn(() => {
                wrapper.vm.control.data = dataSuccess.result;
            });
            await wrapper.findComponent(FunctionButton).find('button').trigger('click');
            vi.runAllTimers();
            expect(wrapper.vm.hasData).toBeTruthy();
            await wrapper.vm.$nextTick();
            expect(wrapper.findComponent(FunctionButton).find('button').attributes().class).contains('disabled');
        });
    
        it('does not disable button if isMultipleUse is true', async () => {
            const isMultipleUseUischemaOptions = { isMultipleUse: true };
    
            props = getProps(isMultipleUseUischemaOptions);
            const { wrapper } = await mountJsonFormsComponentWithCallbacks(ButtonInput, { props });
            wrapper.vm.jsonDataService.data = vi.fn(() => dataSuccess);
            wrapper.vm.handleChange = vi.fn(() => {
                wrapper.vm.control.data = dataSuccess.result;
            });
            await wrapper.findComponent(FunctionButton).find('button').trigger('click');
            vi.runAllTimers();
            expect(wrapper.vm.hasData).toBeTruthy();
            expect(wrapper.findComponent(FunctionButton).find('button').attributes().class).not.contains('disabled');
        });

        it('calls handleChange if action succeeded', async () => {
            wrapper.vm.jsonDataService.data = vi.fn(() => ({
                state: 'SUCCESS',
                result: 'token'
            }));
            wrapper.vm.handleChange = vi.fn();
            await wrapper.findComponent(FunctionButton).find('button').trigger('click');
            vi.runAllTimers();
            expect(wrapper.vm.handleChange).toHaveBeenCalledWith('test', 'token');
        });

        it('disables button during request if not cancelable', async () => {
            const isCancelableUischemaOptions = { isCancelable: false };
    
            props = getProps(isCancelableUischemaOptions);
            const { wrapper } = await mountJsonFormsComponentWithCallbacks(ButtonInput, { props });
            wrapper.vm.isLoading = true;
            await wrapper.vm.$nextTick();
            expect(wrapper.findComponent(FunctionButton).find('button').attributes().class).contains('disabled');
        });
    });
    
    describe('errors', () => {
        it('displays error message on error', async () => {
            wrapper.vm.errorMessage = 'some error';
            await wrapper.vm.$nextTick();
            expect(wrapper.find('.button-wrapper').exists()).toBeTruthy();
            expect(wrapper.find('.button-wrapper').text()).contains('Error');
        });
    
        it('displays no error message if displayErrorMessage is false', async () => {
            const noErrorUischema = { displayErrorMessage: false };
    
            props = getProps(noErrorUischema);
            const { wrapper } = await mountJsonFormsComponentWithCallbacks(ButtonInput, { props });
            wrapper.vm.errorMessage = 'some error';
            await wrapper.vm.$nextTick();
            expect(wrapper.find('.button-wrapper').exists()).toBeTruthy();
            expect(wrapper.find('.button-wrapper').text()).not.contains('Error');
        });
    });

    describe('dependencies to other settings', () => {
        let settingsChangeCallback, wrapper, dependencies;

        const dependenciesUischema = ['foo', 'bar'];

        beforeEach(() => {
            const props = getProps({ isCancelable: true });
            props.control.uischema.options.dependencies = dependenciesUischema;
            const comp = mountJsonFormsComponentWithCallbacks(ButtonInput, { props });
            wrapper = comp.wrapper;
            const firstWatcherCall = comp.callbacks[0];
            settingsChangeCallback = firstWatcherCall[0];
            dependencies = firstWatcherCall[1];
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

        it('cancels the current request and unsets data', async () => {
            await wrapper.setData({ isLoading: true });
            const control = wrapper.vm.control;
            await wrapper.setProps({ control: {
                ...control,
                data: 'nonEmptyData'
            } });
            settingsChangeCallback({ foo: 2 });
            expect(wrapper.vm.cancel).toHaveBeenCalled();
            vi.runAllTimers();
            expect(wrapper.vm.handleChange).toHaveBeenCalledWith(path, null);
        });

        it('does not cancel the request if not isLoading ', async () => {
            await wrapper.setProps({ control: {
                ...wrapper.vm.control,
                data: 'nonEmptyData'
            } });
            settingsChangeCallback({ foo: 2 });
            expect(wrapper.vm.cancel).not.toHaveBeenCalled();
        });

        it('does not cancel the request or unset data if no data', async () => {
            await wrapper.setData({ isLoading: true });
            const control = wrapper.vm.control;
            await wrapper.setProps({ control: {
                ...control
            } });
            settingsChangeCallback({ foo: 2 });
            expect(wrapper.vm.cancel).not.toHaveBeenCalled();
            vi.runAllTimers();
            expect(wrapper.vm.handleChange).not.toHaveBeenCalled();
        });

        it('does not cancel the request if not cancelable', async () => {
            await wrapper.setData({ isLoading: true });
            const control = wrapper.vm.control;
            await wrapper.setProps({ control: {
                ...control,
                data: 'nonEmptyData',
                uischema: {
                    ...control.uischmea,
                    options: {
                        ...control.uischema.options,
                        isCancelable: false
                    }
                }
            } });
            settingsChangeCallback({ foo: 2 });
            expect(wrapper.vm.cancel).not.toHaveBeenCalled();
        });
    });
});
