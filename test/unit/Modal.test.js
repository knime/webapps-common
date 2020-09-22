import { shallowMount } from '@vue/test-utils';
import Modal from '~/ui/components/Modal.vue';

jest.mock('focus-trap-vue', () => ({}), { virtual: true });

describe('Modal', () => {
    /* eslint-disable no-global-assign */
    beforeAll(() => {
        window.addEventListener = jest.fn();
        window.removeEventListener = jest.fn();
    });

    afterAll(() => {
        delete window.addEventListener;
        delete window.removeEventListener;
    });
    /* eslint-enable no-global-assign */


    it('renders default inactive', () => {
        let wrapper = shallowMount(Modal, {
            stubs: { FocusTrap: true },
            slots: {
                default: '<p>test</p>'
            },
            attachToDocument: true
        });
        expect(window.addEventListener).not.toHaveBeenCalled();
        expect(wrapper.html()).toBeFalsy();
    });

    it('activates and deactivates', () => {
        let wrapper = shallowMount(Modal, {
            stubs: { FocusTrap: true },
            slots: {
                default: '<p class="content-item">test</p>'
            },
            attachToDocument: true
        });

        // only manual activation is supported
        wrapper.setProps({ active: true });

        // activate
        expect(wrapper.find('.overlay').exists()).toBeTruthy();
        expect(wrapper.find('.content-item').exists()).toBeFalsy();

        // show content
        wrapper.setData({ showContent: true });
        expect(wrapper.find('.content-item').exists()).toBeTruthy();
        expect(window.addEventListener).toHaveBeenCalled();

        // hide again
        wrapper.setProps({ active: false });
        expect(window.removeEventListener).toHaveBeenCalled();
        expect(wrapper.html()).toBeFalsy();
    });


});
