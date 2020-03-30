import { mount } from '@vue/test-utils';

import Twinlist from '~/ui/components/forms/Twinlist';
import MultiselectListBox from '~/ui/components/forms/MultiselectListBox';

describe('Twinlist.vue', () => {

    let defaultPossibleValues;
    beforeEach(() => {
        defaultPossibleValues = [{
            id: 'test1',
            text: 'Text 1'
        }, {
            id: 'test2',
            text: 'Text 2'
        }, {
            id: 'test3',
            text: 'Text 3'
        }];
    });

    it('renders', () => {
        let propsData = {
            possibleValues: defaultPossibleValues,
            value: ['test3'],
            labelLeft: 'Choose',
            labelRight: 'The value',
            size: 3
        };
        const wrapper = mount(Twinlist, {
            propsData
        });
        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.isVisible()).toBeTruthy();
        expect(wrapper.findAll(MultiselectListBox).length).toBe(2);
        expect(wrapper.findAll(MultiselectListBox).at(0).vm.$props.possibleValues.length).toBe(2);
        expect(wrapper.findAll(MultiselectListBox).at(1).vm.$props.possibleValues).toStrictEqual(
            [defaultPossibleValues[2]]
        );
    });

    it('actual list sizes must be 5 or bigger', () => {
        let propsData = {
            possibleValues: defaultPossibleValues,
            value: ['test1'],
            labelLeft: 'Choose',
            labelRight: 'The value',
            size: 3
        };
        const wrapper = mount(Twinlist, {
            propsData
        });

        // defaults to 5 (see Twinlist)
        expect(wrapper.findAll(MultiselectListBox).at(0).vm.$props.size).toBe(5);
        expect(wrapper.findAll(MultiselectListBox).at(1).vm.$props.size).toBe(5);

        const bigSize = 12;
        wrapper.setProps({ size: bigSize });

        expect(wrapper.findAll(MultiselectListBox).at(0).vm.$props.size).toBe(bigSize);
        expect(wrapper.findAll(MultiselectListBox).at(1).vm.$props.size).toBe(bigSize);
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

    it('provides a valid hasSelection method', () => {
        const wrapper = mount(Twinlist, {
            propsData: {
                possibleValues: defaultPossibleValues,
                labelLeft: 'Choose',
                labelRight: 'The value'
            }
        });
        expect(wrapper.vm.hasSelection()).toBe(false);

        wrapper.setProps({ value: ['test1'] });
        expect(wrapper.vm.hasSelection()).toBe(true);
    });

    describe('double click', () => {
        let propsData;
        beforeEach(() => {
            propsData = {
                possibleValues: defaultPossibleValues,
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
            possibleValues: defaultPossibleValues,
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
            possibleValues: defaultPossibleValues,
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

    describe('controls', () => {
        it('moves selected values to right on move button click', async () => {
            let propsData = {
                possibleValues: defaultPossibleValues,
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

        it('moves selected values to left on move button click', async () => {
            let propsData = {
                possibleValues: defaultPossibleValues,
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

        it('moves all values to right on all button click', async () => {
            let propsData = {
                possibleValues: defaultPossibleValues,
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

        it('moves all values to left on all button click', async () => {
            let propsData = {
                possibleValues: defaultPossibleValues,
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
                possibleValues: defaultPossibleValues,
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
                possibleValues: defaultPossibleValues,
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

        it('moves all values to right on all button enter', async () => {
            let propsData = {
                possibleValues: defaultPossibleValues,
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

        it('moves all values to left on all button enter', async () => {
            let propsData = {
                possibleValues: defaultPossibleValues,
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
