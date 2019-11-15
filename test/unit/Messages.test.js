import { shallowMount } from '@vue/test-utils';
import Messages from '~/ui/components/Messages.vue';
import Message from '~/ui/components/Message.vue';
import SuccessIcon from '../assets/img/icons/circle-check.svg?inline';

const messages = [
    {
        message: 'Error 404',
        type: 'error',
        id: 1
    }, {
        message: 'Info of something',
        type: 'info',
        id: 2
    }, {
        message: 'Info of something',
        type: 'info',
        button: 'Okay',
        icon: SuccessIcon,
        id: 3
    }
];

describe('Messages.vue', () => {
    let wrapper;

    it('renders notifications', () => {
        wrapper = shallowMount(Messages, {
            propsData: { messages }
        });

        expect(wrapper.findAll(Message).length).toBe(messages.length);
        messages.forEach((message, i) => {
            const element = wrapper.findAll(Message).at(i);
            expect(element.props('type')).toEqual(message.type);
            if (message.button) {
                expect(element.props('button')).toEqual(message.button);
            }
            if (message.icon) {
                expect(element.find(message.icon).exists()).toBe(true);
            }
            expect(element.text()).toContain(message.message);
        });
    });
    
    it('renders no message when there is no notification', () => {
        wrapper = shallowMount(Messages);

        expect(wrapper.findAll(Message).length).toBe(0);
    });

    it('emits dismiss event', () => {
        wrapper = shallowMount(Messages, {
            propsData: { messages }
        });

        wrapper.findAll(Message).at(1).vm.$emit('dismiss');
        expect(wrapper.emitted().dismiss[0]).toEqual([messages[1].id]);
    });

});
