import { shallowMount } from '@vue/test-utils';
import BaseModal from '~/ui/components/BaseModal.vue';

jest.mock('focus-trap-vue', () => ({}), { virtual: true });

describe('BaseModal', () => {
    describe('rendering', () => {
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
            let wrapper = shallowMount(BaseModal, {
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
            let wrapper = shallowMount(BaseModal, {
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

    it('emits cancel event on ESC key', () => {
        let wrapper = shallowMount(BaseModal, {
            stubs: { FocusTrap: true },
            attachToDocument: true
        });

        // only manual activation is supported
        wrapper.setProps({ active: true });

        wrapper.trigger('keyup.esc');
        expect(wrapper.emitted().cancel).toBeTruthy();
    });

    it('emits cancel event on overlay click', () => {
        let wrapper = shallowMount(BaseModal, {
            stubs: { FocusTrap: true },
            attachToDocument: true
        });

        // only manual activation is supported
        wrapper.setProps({ active: true });

        wrapper.find('.overlay').trigger('click');
        expect(wrapper.emitted().cancel).toBeTruthy();
    });

    it('does not propagate event on overlay click', () => {
        let wrapper = shallowMount(BaseModal, {
            stubs: { FocusTrap: true },
            slots: {
                default: '<p class="content-item">test</p>'
            },
            attachToDocument: true
        });

        wrapper.setProps({ active: true });
        wrapper.setData({ showContent: true });
        let fakeEvent = { stopPropagation: jest.fn() };

        wrapper.find('.wrapper').trigger('click', fakeEvent);
        expect(fakeEvent.stopPropagation).toHaveBeenCalledTimes(1);

        wrapper.find('.overlay').trigger('click', fakeEvent);
        expect(fakeEvent.stopPropagation).toHaveBeenCalledTimes(2);
    });
});
