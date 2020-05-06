import { shallowMount, mount } from '@vue/test-utils';
import Messages from '~/ui/components/Messages.vue';
import Message from '~/ui/components/Message.vue';
import SuccessIcon from '../assets/img/icons/circle-check.svg?inline';

const messages = [
    {
        message: 'Error 404',
        type: 'error',
        id: 1,
        count: 2
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
    }, {
        message: 'Info of something',
        type: 'info',
        button: 'Okay',
        icon: SuccessIcon,
        id: 4,
        link: {
            text: 'Linked text.',
            href: 'some_link'
        }
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

    it('handles messages with and without counts', () => {
        wrapper = mount(Messages, {
            propsData: { messages }
        });

        expect(wrapper.findAll(Message).at(0).find('.message-count').isVisible()).toBe(true);
        expect(wrapper.findAll(Message).at(0).vm.count).toBe(2);
        expect(wrapper.findAll(Message).at(1).find('.message-count').isVisible()).toBe(false);
        expect(wrapper.findAll(Message).at(1).vm.count).toBe(1);
        expect(wrapper.findAll(Message).at(2).find('.message-count').isVisible()).toBe(false);
        expect(wrapper.findAll(Message).at(2).vm.count).toBe(1);
    });

    it('renders link if specified', () => {
        wrapper = mount(Messages, {
            propsData: { messages }
        });

        for (let i of [0, 1, 2]) {
            expect(wrapper.findAll(Message).at(i).find('a').exists()).toBe(false);
        }

        // eslint-disable-next-line no-magic-numbers
        let link = wrapper.findAll(Message).at(3).find('a');
        expect(link.exists()).toBe(true);
        expect(link.text()).toBe('Linked text.');
        expect(link.attributes('href')).toBe('some_link');
    });
});
