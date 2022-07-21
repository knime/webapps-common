import { mount, shallowMount } from '@vue/test-utils';

import DialogOptions from '../../ui/components/node/DialogOptions.vue';
import Collapser from '../../ui/components/Collapser.vue';

describe('DialogOptions.vue', () => {
    it('renders', () => {
        const wrapper = shallowMount(DialogOptions, {
            propsData: {
                options: [{
                    fields: [{
                        name: 'foo',
                        description: 'bar'
                    }]
                }]
            }
        });
        expect(wrapper.is('div')).toBeTruthy();
    });

    it('renders nothing when no data is given', () => {
        const wrapper = shallowMount(DialogOptions);
        expect(wrapper.find('*').exists()).toBe(false);
    });

    it('shows optional options as optional', () => {
        const wrapper = shallowMount(DialogOptions, {
            propsData: {
                options: [{
                    fields: [{
                        name: 'foo',
                        optional: true,
                        description: 'bar'
                    }]
                }]
            }
        });
        expect(wrapper.find('.option-field-name').text()).toMatch(/^foo\s+\(optional\)$/);
    });

    it('renders no collapser if sectionName is not set', () => {
        const wrapper = shallowMount(DialogOptions, {
            propsData: {
                options: [{
                    fields: [{
                        name: 'foo',
                        description: 'bar'
                    }]
                }]
            }
        });
        expect(wrapper.findAll(Collapser).length).toBeFalsy();
        expect(wrapper.find('.option-field-name').text()).toEqual('foo');
        expect(wrapper.find('.option-description').props('text')).toEqual('bar');
    });

    it('renders collapsers if sectionName is set', () => {
        const wrapper = shallowMount(DialogOptions, {
            propsData: {
                options: [{
                    sectionName: 'hello',
                    fields: [{
                        name: 'foo',
                        description: 'bar'
                    }, {
                        name: 'baz',
                        description: 'qux'
                    }]
                }, {
                    sectionName: 'world',
                    fields: [{
                        name: 'bla',
                        description: 'quux'
                    }]
                }]
            }
        });
        expect(wrapper.findAll(Collapser).length).toEqual(2);
        expect(wrapper.findAll('.option-field-name').at(0).text()).toEqual('foo');
        expect(wrapper.findAll('.option-field-name').at(1).text()).toEqual('baz');
        expect(wrapper.findAll('.option-field-name').at(2).text()).toEqual('bla');
        expect(wrapper.findAll('.option-description').at(0).props('text')).toEqual('bar');
        expect(wrapper.findAll('.option-description').at(1).props('text')).toEqual('qux');
        expect(wrapper.findAll('.option-description').at(2).props('text')).toEqual('quux');
    });

    it('renders section description if only section description is set', () => {
        const wrapper = shallowMount(DialogOptions, {
            propsData: {
                options: [{
                    sectionDescription: 'bar'
                }]
            }
        });
        expect(wrapper.find('.section-description').props('text')).toEqual('bar');
    });

    it('renders section description if section description and fields are set', () => {
        const wrapper = shallowMount(DialogOptions, {
            propsData: {
                options: [{
                    sectionDescription: 'bar',
                    fields: [{
                        name: 'foo',
                        description: 'banana'
                    }]
                }]
            }
        });
        expect(wrapper.find('.section-description').props('text')).toEqual('bar');
    });

    it('does not render Collapser if section description and fields are missing', () => {
        const wrapper = shallowMount(DialogOptions, {
            propsData: {
                options: [{
                    fields: []
                }]
            }
        });
        expect(wrapper.find('.options').exists()).toBeFalsy();
    });

    it('should sanitize content', () => {
        const dangerousContent = `</li><span>HELLO WORLD!</span>`;
        const expectedContent = '&lt;/li&gt;&lt;span&gt;HELLO WORLD!&lt;/span&gt;';
        const wrapper = mount(DialogOptions, {
            propsData: {
                sanitizeContent: true,
                options: [{
                    sectionDescription: dangerousContent,
                    fields: [{
                        name: '',
                        description: dangerousContent
                    }]
                }]
            }
        });

        const sectionDescription = wrapper.find('.section-description');
        const optionDescription = wrapper.find('.option-description');

        expect(sectionDescription.element.innerHTML).toMatch(expectedContent);
        expect(optionDescription.element.innerHTML).toMatch(expectedContent);
    });
});

