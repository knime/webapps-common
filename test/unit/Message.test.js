import Message from '~/ui/components/Message';
import Button from '~/ui/components/Button';
import { shallowMount } from '@vue/test-utils';
import WarnIcon from '~/ui/assets/img/icons/sign-warning.svg?inline';

describe('Message.vue', () => {
    let wrapper;

    let copyTextMock = jest.fn();

    it('renders default', () => {
        wrapper = shallowMount(Message);

        expect(wrapper.classes()).toEqual(['info']);
        expect(wrapper.find('span.close').exists()).toBe(true);
        expect(wrapper.find('.collapser').exists()).toBe(false);
        expect(wrapper.find('.banner').exists()).toBe(true);
    });

    it('renders success', () => {
        wrapper = shallowMount(Message, {
            propsData: {
                type: 'success'
            }
        });

        expect(wrapper.classes()).toEqual(['success']);
    });

    it('renders error', () => {
        wrapper = shallowMount(Message, {
            propsData: {
                type: 'error'
            }
        });

        expect(wrapper.classes()).toEqual(['error']);
    });

    it('renders button', () => {
        let buttonText = 'Okay';
        wrapper = shallowMount(Message, {
            propsData: {
                button: buttonText
            }
        });

        expect(wrapper.find(Button).text()).toEqual(buttonText);
    });

    it('renders icon', () => {
        wrapper = shallowMount(Message, {
            slots: {
                icon: WarnIcon
            }
        });

        expect(wrapper.find(WarnIcon).exists()).toBe(true);
    });

    it('hides count if message is unique', () => {
        wrapper = shallowMount(Message, {
            propsData: {
                type: 'error'
            }
        });

        expect(wrapper.find('.message-count').exists()).toBe(true);
        expect(wrapper.find('.message-count').isVisible()).toBe(false);
    });

    it('shows count if message is repeated', () => {
        wrapper = shallowMount(Message, {
            propsData: {
                type: 'error',
                count: 2
            }
        });

        expect(wrapper.find('.message-count').exists()).toBe(true);
        expect(wrapper.find('.message-count').isVisible()).toBe(true);
    });

    it('renders collapser', () => {
        wrapper = shallowMount(Message, {
            propsData: {
                type: 'error',
                details: 'test message'
            },
            methods: {
                copyMessage: copyTextMock
            }
        });
        expect(wrapper.find('.copy-button').exists()).toBe(true);
        expect(wrapper.find('.collapser').exists()).toBe(true);
        expect(wrapper.find('#detail-text').text()).toEqual('test message');
        wrapper.find('.copy-button').trigger('click');

        expect(copyTextMock).toHaveBeenCalled();
    });

    it('renders without close button when not dismissable', () => {
        wrapper = shallowMount(Message, {
            propsData: {
                type: 'error',
                showCloseButton: false
            }
        });
        expect(wrapper.vm.active).toBe(true);
        expect(wrapper.find('.close').exists()).toBe(false);
    });

    it('copies text by enter key', () => {
        jest.clearAllMocks();
        wrapper = shallowMount(Message, {
            propsData: {
                type: 'error',
                details: 'test message'
            },
            methods: {
                copyMessage: copyTextMock
            }
        });
        wrapper.find('.copy-button').trigger('keyup.space');
        expect(copyTextMock).toHaveBeenCalled();
    });

    it('closes', () => {
        wrapper = shallowMount(Message, {
            propsData: {
                type: 'error',
                count: 2
            }
        });
        expect(wrapper.vm.active).toBe(true);
        wrapper.find('.close').trigger('click');
        expect(wrapper.vm.active).toBe(false);
        expect(wrapper.emitted('dismiss')).toBeTruthy();
    });

    it('closes on space key', () => {
        wrapper = shallowMount(Message, {
            propsData: {
                type: 'error',
                count: 2
            }
        });
        expect(wrapper.vm.active).toBe(true);
        wrapper.find('.close').trigger('keydown.space');
        expect(wrapper.vm.active).toBe(false);
        expect(wrapper.emitted('dismiss')).toBeTruthy();
    });
});
