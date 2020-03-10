import { mount } from '@vue/test-utils';

import ListBox from '~/ui/components/forms/ListBox';

describe('ListBox.vue', () => {
    let propsData;

    beforeEach(() => {
        propsData = {
            possibleValues: [{
                id: 'test1',
                text: 'Text 1'
            }, {
                id: 'test2',
                text: 'Text 2'
            }, {
                id: 'test3',
                text: 'Text 3'
            }, {
                id: 'test4',
                text: 'Text 4'
            }, {
                id: 'test5',
                text: 'Text 5'
            }],
            ariaLabel: 'Test Label'
        };
    });

    it('renders', () => {
        const wrapper = mount(ListBox, {
            propsData
        });
        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.isVisible()).toBeTruthy();

        let options = wrapper.findAll('li[role=option]');
        expect(options.length).toBe(propsData.possibleValues.length);
        propsData.possibleValues.forEach((value, i) => {
            expect(options.at(i).text()).toContain(value.text);
        });
    });

    it('renders selected value', () => {
        let value = 'test3';
        const wrapper = mount(ListBox, {
            propsData: {
                ...propsData,
                value
            }
        });

        let options = wrapper.findAll('li[role=option]');
        propsData.possibleValues.forEach((option, i) => {
            let classes = options.at(i).classes();
            if (option.id === value) {
                expect(classes).toContain('focused');
            } else {
                expect(classes).not.toContain('focused');
            }
        });
    });

    it('sets the correct aria-* attributes', () => {
        const wrapper = mount(ListBox, {
            propsData
        });

        let ul = wrapper.find('ul');
        expect(ul.attributes('aria-label')).toBe(propsData.ariaLabel);
    });

    it('sets the invalid state if isValid is false', () => {
        const wrapper = mount(ListBox, {
            propsData: {
                ...propsData,
                isValid: false
            }
        });

        let root = wrapper.find('div');
        expect(root.classes()).toContain('invalid');
    });

    it('emits event for clicked value', () => {
        const wrapper = mount(ListBox, {
            propsData
        });
        let newValueIndex = 1;
        let input = wrapper.findAll('li[role=option]').at(newValueIndex);
        input.trigger('click');
        expect(wrapper.emitted().input[0][0]).toEqual(propsData.possibleValues[newValueIndex].id);
    });

    it('provides a valid hasSelection method', () => {
        const wrapper = mount(ListBox, {
            propsData
        });
        expect(wrapper.vm.hasSelection()).toBe(false);

        let newValueIndex = 1;
        let input = wrapper.findAll('li[role=option]').at(newValueIndex);
        input.trigger('click');
        expect(wrapper.vm.hasSelection()).toBe(true);
    });

    describe('keyboard navigation', () => {
        it('sets the values on keydown navigation', () => {
            const wrapper = mount(ListBox, {
                propsData: {
                    ...propsData,
                    value: 'test2' // defines start point
                }
            });

            let ul = wrapper.find('ul');
            ul.trigger('keydown.down',);
            expect(wrapper.emitted().input[0][0]).toEqual('test3');
        });

        it('sets the values on keyup navigation', () => {
            const wrapper = mount(ListBox, {
                propsData: {
                    ...propsData,
                    value: 'test2' // defines start point
                }
            });

            let ul = wrapper.find('ul');
            ul.trigger('keydown.up');
            expect(wrapper.emitted().input[0][0]).toEqual('test1');
        });

        it('sets no values on keyup navigation at the start', () => {
            const wrapper = mount(ListBox, {
                propsData: {
                    ...propsData,
                    value: 'test1' // defines start point
                }
            });

            let ul = wrapper.find('ul');
            ul.trigger('keydown.up');
            expect(wrapper.emitted().input).toBeFalsy();
        });


        it('sets no values on keydown navigation at the end', () => {
            const wrapper = mount(ListBox, {
                propsData: {
                    ...propsData,
                    value: 'test5' // defines start point
                }
            });

            let ul = wrapper.find('ul');
            ul.trigger('keydown.down');
            expect(wrapper.emitted().input).toBeFalsy();
        });

        it('sets the values to the first value on home key', () => {
            const wrapper = mount(ListBox, {
                propsData: {
                    ...propsData,
                    value: 'test3' // defines start point
                }
            });

            let ul = wrapper.find('ul');
            ul.trigger('keydown.home');
            expect(wrapper.emitted().input[0][0]).toBe('test1');
        });

        it('sets the values to the last value on end key', () => {
            const wrapper = mount(ListBox, {
                propsData: {
                    ...propsData,
                    value: 'test3' // defines start point
                }
            });

            let ul = wrapper.find('ul');
            ul.trigger('keydown.end');
            expect(wrapper.emitted().input[0][0]).toBe('test5');
        });
    });

});
