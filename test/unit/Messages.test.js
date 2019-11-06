import Message from '~/ui/components/Message.vue';
import { shallowMount } from '@vue/test-utils';
import Messages from '~/ui/components/Messages.vue';

const notificationsData = {
    notifications: [
        {
            message: 'Error 404',
            type: 'error',
            id: 1
        }, {
            message: 'Info of something',
            type: 'info',
            id: 2
        }
    ]
};

describe('Messages.vue', () => {
    let wrapper;

    beforeAll(() => {
        wrapper = shallowMount(Messages, {
            propsData: notificationsData
        });
    });

    it('renders content', () => {
        expect(wrapper.findAll(Message).length).toBe(2);
        notificationsData.notifications.forEach((notification, i) => {
            const element = wrapper.findAll(Message).at(i);
            expect(element.props('type')).toEqual(notification.type);
            expect(element.text()).toContain(notification.message);
        });
    });

    it('renders no message when there is no notification', () => {
        wrapper = shallowMount(Messages);

        expect(wrapper.findAll(Message).length).toBe(0);
    });

});
