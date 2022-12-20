import { describe, it, expect, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';

import Modal from '../Modal.vue';

vi.mock('focus-trap-vue', () => ({}), { virtual: true });

describe('Modal', () => {
    describe('rendering', () => {
        it('renders style type classes', () => {
            let wrapper = shallowMount(Modal);
            expect(wrapper.classes()).toContain('info');

            wrapper = shallowMount(Modal, {
                props: {
                    styleType: 'warn'
                }
            });
            expect(wrapper.classes()).toContain('warn');
        });

        it('renders title, icon and controls', () => {
            let wrapper = shallowMount(Modal, {
                props: {
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
    });

    describe('BaseModal', () => {
        let BaseModal = {
            template: '<div />',
            props: {
                active: {
                    default: false,
                    type: Boolean
                }
            }
        };

        it('passes-through props to BaseModal', () => {
            let wrapper = shallowMount(Modal, {
                props: {
                    active: true
                },
                global: {
                    stubs: {
                        BaseModal
                    }
                }
            });
            expect(wrapper.findComponent(BaseModal).props().active).toBeTruthy();
        });

        it('passes-through event listeners to BaseModal', () => {
            let wrapper = shallowMount(Modal, {
                listeners: {
                    fakeEvent: vi.fn()
                },
                global: {
                    stubs: {
                        BaseModal
                    }
                }
            });
            expect(wrapper.findComponent(BaseModal).vm.$listeners).toHaveProperty('fakeEvent');
        });
    });

    it('emits cancel event on close button click', async () => {
        let wrapper = shallowMount(Modal);

        expect(wrapper.emitted().cancel).toBeFalsy();
        await wrapper.find('.header .closer').vm.$emit('click');
        expect(wrapper.emitted().cancel).toBeTruthy();
    });
});
