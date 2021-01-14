import { shallowMount, mount } from '@vue/test-utils';
import Modal from '~/ui/components/Modal.vue';
import BaseModal from '~/ui/components/BaseModal.vue';

describe('Modal', () => {

    describe('rendering', () => {

        it('renders style type classes', () => {
            let wrapper = shallowMount(Modal);
            expect(wrapper.classes()).toContain('info');

            wrapper = shallowMount(Modal, {
                propsData: {
                    styleType: 'warn'
                }
            });
            expect(wrapper.classes()).toContain('warn');
        });

        it('renders title, icon and controls', () => {
            let wrapper = shallowMount(Modal, {
                propsData: {
                    title: 'Modal title'
                },
                slots: {
                    icon: '<svg class="icon"></svg>',
                    controls: '<p>controls</p>'
                }
            });

            expect(wrapper.find('.header h2').text()).toContain('Modal title');
            expect(wrapper.find('.header svg.icon').exists()).toBeTruthy();
            expect(wrapper.find('.controls').text()).toContain('controls');
        });

        it('renders notice (if set)', () => {
            let wrapper = shallowMount(Modal);
            expect(wrapper.find('.notice').exists()).toBeFalsy();

            wrapper = shallowMount(Modal, {
                slots: {
                    notice: '<p>notice</p>'
                }
            });
            expect(wrapper.find('.notice').text()).toContain('notice');
        });

        it('renders confirmation (if set)', () => {
            let wrapper = shallowMount(Modal);
            expect(wrapper.find('.confirmation').exists()).toBeFalsy();

            wrapper = shallowMount(Modal, {
                slots: {
                    confirmation: '<p>confirmation</p>'
                }
            });
            expect(wrapper.find('.confirmation').text()).toContain('confirmation');
        });

        it('passes-through props to BaseModal', () => {
            let wrapper = shallowMount(Modal, {
                propsData: {
                    active: true
                }
            });

            expect(wrapper.find(BaseModal).props().active).toBeTruthy();
        });

        it('passes-through event listeners to BaseModal', () => {
            let wrapper = shallowMount(Modal, {
                listeners: {
                    fakeEvent: jest.fn()
                }
            });
            expect(wrapper.find(BaseModal).vm.$listeners).toHaveProperty('fakeEvent');
        });
    });

    it('emits cancel event on close button click', async () => {
        let wrapper = shallowMount(Modal);

        expect(wrapper.emitted().cancel).toBeFalsy();
        await wrapper.find('.header .closer').vm.$emit('click');
        expect(wrapper.emitted().cancel).toBeTruthy();
    });

});
