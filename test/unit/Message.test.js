import Message from '~/ui/components/Message';
import Button from '~/ui/components/Button';
import { shallowMount } from '@vue/test-utils';
import InfoIcon from '../assets/img/icons/circle-info.svg?inline';
import WarnIcon from '../assets/img/icons/sign-warning.svg?inline';
import SuccessIcon from '../assets/img/icons/circle-check.svg?inline';

describe('Message.vue', () => {
    let wrapper;

    it('renders default', () => {
        wrapper = shallowMount(Message);

        expect(wrapper.classes()).toEqual(['info']);
        expect(wrapper.find(InfoIcon).exists()).toBe(true);
        expect(wrapper.find('span.close').exists()).toBe(true);
    });

    it('renders success', () => {
        wrapper = shallowMount(Message, {
            propsData: {
                type: 'success'
            }
        });

        expect(wrapper.classes()).toEqual(['success']);
        expect(wrapper.find(SuccessIcon).exists()).toBe(true);
    });

    it('renders error', () => {
        wrapper = shallowMount(Message, {
            propsData: {
                type: 'error'
            }
        });

        expect(wrapper.classes()).toEqual(['error']);
        expect(wrapper.find(WarnIcon).exists()).toBe(true);
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
            propsData: {
                icon: WarnIcon
            }
        });

        expect(wrapper.find(WarnIcon).exists()).toBe(true);
    });

    it('dismisses message', () => {
        wrapper = shallowMount(Message, {
            propsData: {
                type: 'error'
            }
        });

        expect(wrapper.find('section').exists()).toBe(true);
        wrapper.find('.close').trigger('click');
        expect(wrapper.find('section').exists()).toBe(false);
        expect(wrapper.emitted().dismiss).toBeTruthy();
    });
});
