import { mount } from '@vue/test-utils';

import Twinlist from '~/ui/components/forms/Twinlist';
import MultiselectListBox from '~/ui/components/forms/MultiselectListBox';

describe('Twinlist.vue', () => {
    it('renders', () => {
        let propsData = {
            possibleValues: [{
                id: 'test1',
                text: 'test1'
            }, {
                id: 'test2',
                text: 'test2'
            }, {
                id: 'test3',
                text: 'test3'
            }],
            value: ['test3'],
            labelLeft: 'Choose',
            labelRight: 'The value'
        };
        const wrapper = mount(Twinlist, {
            propsData
        });
        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.isVisible()).toBeTruthy();
        expect(wrapper.vm.hasSelection()).toBe(true);
        expect(wrapper.findAll(MultiselectListBox).length).toBe(2);
        expect(wrapper.findAll(MultiselectListBox).at(0).vm.$props.possibleValues.length).toBe(2);
        expect(wrapper.findAll(MultiselectListBox).at(1).vm.$props.possibleValues).toStrictEqual(
            [{
                id: 'test3',
                text: 'test3'
            }]
        );
    });

    it('isValid causes invalid style on left box', () => {
        let propsData = {
            possibleValues: [{
                id: 'test1',
                text: 'test1'
            }],
            value: [],
            labelLeft: 'Choose',
            labelRight: 'The value',
            isValid: false
        };
        const wrapper = mount(Twinlist, {
            propsData
        });
        let left = wrapper.find({ ref: 'left' });
        expect(left.vm.isValid).toBe(false);
        wrapper.setProps({ isValid: true });
        expect(left.vm.isValid).toBe(true);
    });

    describe('doubleclick', () => {
        let propsData;
        beforeEach(() => {
            propsData = {
                possibleValues: [{
                    id: 'test1',
                    text: 'test1'
                }, {
                    id: 'test2',
                    text: 'test2'
                }, {
                    id: 'test3',
                    text: 'test3'
                }],
                value: ['test3'],
                labelLeft: 'Choose',
                labelRight: 'The value'
            };
        });

        it('adds to value on double click in left box', async () => {
            const wrapper = mount(Twinlist, {
                propsData
            });

            let boxes = wrapper.findAll(MultiselectListBox);
            let left = boxes.at(0);
            let right = boxes.at(1);
            left.vm.$emit('doubleClickOnItem', 'test2', 1);
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted().input[0][0]).toStrictEqual(['test2', 'test3']);
            expect(right.vm.$props.possibleValues).toStrictEqual([
                propsData.possibleValues[1], propsData.possibleValues[2]
            ]);
        });

        it('adds values on shift double click in left box', async () => {
            const wrapper = mount(Twinlist, {
                propsData
            });

            let boxes = wrapper.findAll(MultiselectListBox);
            let left = boxes.at(0);
            let right = boxes.at(1);
            left.vm.$emit('doubleClickShift', ['test1', 'test2']);
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted().input[0][0]).toStrictEqual(['test1', 'test2', 'test3']);
            expect(right.vm.$props.possibleValues).toStrictEqual([
                propsData.possibleValues[0], propsData.possibleValues[1], propsData.possibleValues[2]
            ]);
        });

        it('removes from value on double click in right box', async () => {
            propsData.value = ['test2', 'test3'];
            const wrapper = mount(Twinlist, {
                propsData
            });

            let boxes = wrapper.findAll(MultiselectListBox);
            let left = boxes.at(0);
            let right = boxes.at(1);
            right.vm.$emit('doubleClickOnItem', 'test2', 1);
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted().input[0][0]).toStrictEqual(['test3']);
            expect(left.vm.$props.possibleValues).toStrictEqual([
                propsData.possibleValues[0], propsData.possibleValues[1]
            ]);
        });

        it('removes from values on shift double click in right box', async () => {
            propsData.value = ['test1', 'test2', 'test3'];
            const wrapper = mount(Twinlist, {
                propsData
            });

            let boxes = wrapper.findAll(MultiselectListBox);
            let left = boxes.at(0);
            let right = boxes.at(1);
            right.vm.$emit('doubleClickShift', ['test1', 'test2']);
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted().input[0][0]).toStrictEqual(['test3']);
            expect(left.vm.$props.possibleValues).toStrictEqual([
                propsData.possibleValues[0], propsData.possibleValues[1]
            ]);
        });
    });

    it('moves selected values to right on right arrow key', async () => {
        let propsData = {
            possibleValues: [{
                id: 'test1',
                text: 'test1'
            }, {
                id: 'test2',
                text: 'test2'
            }, {
                id: 'test3',
                text: 'test3'
            }],
            value: [],
            labelLeft: 'Choose',
            labelRight: 'The value'
        };
        const wrapper = mount(Twinlist, {
            propsData
        });

        let boxes = wrapper.findAll(MultiselectListBox);
        let left = boxes.at(0);
        let right = boxes.at(1);
        left.vm.setSelected(['test2', 'test3']);
        left.vm.$emit('keyArrowRight');
        await wrapper.vm.$nextTick();
        expect(wrapper.emitted().input[0][0]).toStrictEqual(['test2', 'test3']);
        expect(right.vm.$props.possibleValues).toStrictEqual([
            propsData.possibleValues[1], propsData.possibleValues[2]
        ]);
    });

    it('moves selected values to left on left arrow key', async () => {
        let propsData = {
            possibleValues: [{
                id: 'test1',
                text: 'test1'
            }, {
                id: 'test2',
                text: 'test2'
            }, {
                id: 'test3',
                text: 'test3'
            }],
            value: ['test2', 'test3'],
            labelLeft: 'Choose',
            labelRight: 'The value'
        };
        const wrapper = mount(Twinlist, {
            propsData
        });

        let boxes = wrapper.findAll(MultiselectListBox);
        let left = boxes.at(0);
        let right = boxes.at(1);
        right.vm.setSelected(['test2', 'test3']);
        right.vm.$emit('keyArrowLeft');
        await wrapper.vm.$nextTick();
        expect(wrapper.emitted().input[0][0]).toStrictEqual([]);
        expect(left.vm.$props.possibleValues).toStrictEqual(propsData.possibleValues);
    });

    it('moves selected values to right on move button click', async () => {
        let propsData = {
            possibleValues: [{
                id: 'test1',
                text: 'test1'
            }, {
                id: 'test2',
                text: 'test2'
            }, {
                id: 'test3',
                text: 'test3'
            }],
            value: [],
            labelLeft: 'Choose',
            labelRight: 'The value'
        };
        const wrapper = mount(Twinlist, {
            propsData
        });

        let boxes = wrapper.findAll(MultiselectListBox);
        let left = boxes.at(0);
        let right = boxes.at(1);
        left.vm.setSelected(['test2', 'test3']);
        wrapper.find({ ref: 'moveRight' }).trigger('click');
        await wrapper.vm.$nextTick();
        expect(wrapper.emitted().input[0][0]).toStrictEqual(['test2', 'test3']);
        expect(right.vm.$props.possibleValues).toStrictEqual([
            propsData.possibleValues[1], propsData.possibleValues[2]
        ]);
    });

    describe('controls', () => {
        it('moves selected values to left on move button click', async () => {
            let propsData = {
                possibleValues: [{
                    id: 'test1',
                    text: 'test1'
                }, {
                    id: 'test2',
                    text: 'test2'
                }, {
                    id: 'test3',
                    text: 'test3'
                }],
                value: ['test2', 'test3'],
                labelLeft: 'Choose',
                labelRight: 'The value'
            };
            const wrapper = mount(Twinlist, {
                propsData
            });

            let boxes = wrapper.findAll(MultiselectListBox);
            let left = boxes.at(0);
            let right = boxes.at(1);
            right.vm.setSelected(['test2', 'test3']);
            wrapper.find({ ref: 'moveLeft' }).trigger('click');
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted().input[0][0]).toStrictEqual([]);
            expect(left.vm.$props.possibleValues).toStrictEqual(propsData.possibleValues);
        });

        it('move all values to right on all button click', async () => {
            let propsData = {
                possibleValues: [{
                    id: 'test1',
                    text: 'test1'
                }, {
                    id: 'test2',
                    text: 'test2'
                }, {
                    id: 'test3',
                    text: 'test3'
                }],
                value: [],
                labelLeft: 'Choose',
                labelRight: 'The value'
            };
            const wrapper = mount(Twinlist, {
                propsData
            });

            let boxes = wrapper.findAll(MultiselectListBox);
            let right = boxes.at(1);
            wrapper.find({ ref: 'moveAllRight' }).trigger('click');
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted().input[0][0]).toStrictEqual(['test1', 'test2', 'test3']);
            expect(right.vm.$props.possibleValues).toStrictEqual(propsData.possibleValues);
        });

        it('move all values to left on all button click', async () => {
            let propsData = {
                possibleValues: [{
                    id: 'test1',
                    text: 'test1'
                }, {
                    id: 'test2',
                    text: 'test2'
                }, {
                    id: 'test3',
                    text: 'test3'
                }],
                value: ['test2', 'test3'],
                labelLeft: 'Choose',
                labelRight: 'The value'
            };
            const wrapper = mount(Twinlist, {
                propsData
            });

            let boxes = wrapper.findAll(MultiselectListBox);
            let left = boxes.at(0);
            wrapper.find({ ref: 'moveAllLeft' }).trigger('click');
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted().input[0][0]).toStrictEqual([]);
            expect(left.vm.$props.possibleValues).toStrictEqual(propsData.possibleValues);
        });

        it('moves selected values to right on move button enter', async () => {
            let propsData = {
                possibleValues: [{
                    id: 'test1',
                    text: 'test1'
                }, {
                    id: 'test2',
                    text: 'test2'
                }, {
                    id: 'test3',
                    text: 'test3'
                }],
                value: [],
                labelLeft: 'Choose',
                labelRight: 'The value'
            };
            const wrapper = mount(Twinlist, {
                propsData
            });

            let boxes = wrapper.findAll(MultiselectListBox);
            let left = boxes.at(0);
            let right = boxes.at(1);
            left.vm.setSelected(['test2', 'test3']);
            wrapper.find({ ref: 'moveRight' }).trigger('keydown.enter');
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted().input[0][0]).toStrictEqual(['test2', 'test3']);
            expect(right.vm.$props.possibleValues).toStrictEqual([
                propsData.possibleValues[1], propsData.possibleValues[2]
            ]);
        });

        it('moves selected values to left on move button enter', async () => {
            let propsData = {
                possibleValues: [{
                    id: 'test1',
                    text: 'test1'
                }, {
                    id: 'test2',
                    text: 'test2'
                }, {
                    id: 'test3',
                    text: 'test3'
                }],
                value: ['test2', 'test3'],
                labelLeft: 'Choose',
                labelRight: 'The value'
            };
            const wrapper = mount(Twinlist, {
                propsData
            });

            let boxes = wrapper.findAll(MultiselectListBox);
            let left = boxes.at(0);
            let right = boxes.at(1);
            right.vm.setSelected(['test2', 'test3']);
            wrapper.find({ ref: 'moveLeft' }).trigger('keydown.enter');
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted().input[0][0]).toStrictEqual([]);
            expect(left.vm.$props.possibleValues).toStrictEqual(propsData.possibleValues);
        });

        it('move all values to right on all button enter', async () => {
            let propsData = {
                possibleValues: [{
                    id: 'test1',
                    text: 'test1'
                }, {
                    id: 'test2',
                    text: 'test2'
                }, {
                    id: 'test3',
                    text: 'test3'
                }],
                value: [],
                labelLeft: 'Choose',
                labelRight: 'The value'
            };
            const wrapper = mount(Twinlist, {
                propsData
            });

            let boxes = wrapper.findAll(MultiselectListBox);
            let right = boxes.at(1);
            wrapper.find({ ref: 'moveAllRight' }).trigger('keydown.enter');
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted().input[0][0]).toStrictEqual(['test1', 'test2', 'test3']);
            expect(right.vm.$props.possibleValues).toStrictEqual(propsData.possibleValues);
        });

        it('move all values to left on all button enter', async () => {
            let propsData = {
                possibleValues: [{
                    id: 'test1',
                    text: 'test1'
                }, {
                    id: 'test2',
                    text: 'test2'
                }, {
                    id: 'test3',
                    text: 'test3'
                }],
                value: ['test2', 'test3'],
                labelLeft: 'Choose',
                labelRight: 'The value'
            };
            const wrapper = mount(Twinlist, {
                propsData
            });

            let boxes = wrapper.findAll(MultiselectListBox);
            let left = boxes.at(0);
            wrapper.find({ ref: 'moveAllLeft' }).trigger('keydown.enter');
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted().input[0][0]).toStrictEqual([]);
            expect(left.vm.$props.possibleValues).toStrictEqual(propsData.possibleValues);
        });
    });
});
