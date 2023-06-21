import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mountJsonFormsComponent, initializesJsonFormsControl } from
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

    const getProps = (uischemaOptions = defaultOptions) => ({
        control: {
            visible: true,
            path: 'test',
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
        wrapper = await mountJsonFormsComponent(ButtonInput, props);
    });

    afterEach(() => {
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
            wrapper = await mountJsonFormsComponent(ButtonInput, props);
            expect(wrapper.find('.button-input-text').text()).toBe('Invoke action');
            wrapper.vm.isLoading = true;
            await wrapper.vm.$nextTick();
            expect(wrapper.find('.button-input-text').text()).toBe('Cancel');
            wrapper.vm.isLoading = false;
            wrapper.vm.control.data = dataSuccess.result;
            await wrapper.vm.$nextTick();
            expect(wrapper.find('.button-input-text').text()).toBe('Success');
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
            wrapper = await mountJsonFormsComponent(ButtonInput, props);
            expect(wrapper.findComponent(Label).exists()).toBeFalsy();
        });
    });

    describe('actions', () => {
        it('invokes action on click', async () => {
            wrapper.vm.jsonDataService.data = vi.fn();
            await wrapper.findComponent(FunctionButton).find('button').trigger('click');
            expect(wrapper.vm.jsonDataService.data).toHaveBeenCalledWith({
                method: 'invokeActionHandler',
                options: [uischema.options.actionHandler]
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
            expect(wrapper.vm.hasData).toBeTruthy();
            expect(wrapper.findComponent(FunctionButton).find('button').attributes().class).contains('disabled');
        });
    
        it('does not disable button if isMultipleUse is true', async () => {
            const isMultipleUseUischemaOptions = { isMultipleUse: true };
    
            props = getProps(isMultipleUseUischemaOptions);
            wrapper = await mountJsonFormsComponent(ButtonInput, props);
            wrapper.vm.jsonDataService.data = vi.fn(() => dataSuccess);
            wrapper.vm.handleChange = vi.fn(() => {
                wrapper.vm.control.data = dataSuccess.result;
            });
            await wrapper.findComponent(FunctionButton).find('button').trigger('click');
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
            expect(wrapper.vm.handleChange).toHaveBeenCalledWith('test', 'token');
        });

        it('disables button during request if not cancelable', async () => {
            const isCancelableUischemaOptions = { isCancelable: false };
    
            props = getProps(isCancelableUischemaOptions);
            wrapper = await mountJsonFormsComponent(ButtonInput, props);
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
            wrapper = await mountJsonFormsComponent(ButtonInput, props);
            wrapper.vm.errorMessage = 'some error';
            await wrapper.vm.$nextTick();
            expect(wrapper.find('.button-wrapper').exists()).toBeTruthy();
            expect(wrapper.find('.button-wrapper').text()).not.contains('Error');
        });
    });
});
