import { mount, createLocalVue } from '@vue/test-utils';
import { isUndefined, cloneDeep } from 'lodash';

jest.mock('vue-clickaway2', () => ({
    mixin: {}
}), { virtual: true });

const localVue = createLocalVue();
localVue.directive('onClickaway', () => {});

import Dropdown from '~/ui/components/forms/Dropdown.vue';
jest.useFakeTimers();

const POSSIBLE_VALUES_MOCK = [{
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
}];
const ARIA_LABEL_MOCK = 'Test Label';
const POSSIBLE_SLOTTED_VALUES_MOCK = [{
    id: 'test1',
    text: 'Text 1',
    slotData: {
        a: 1,
        b: 2,
        c: 3
    }
}, {
    id: 'test2',
    text: 'Text 2',
    slotData: {
        a: 1,
        b: 2,
        c: 3
    }
}, {
    id: 'test3',
    text: 'Text 3',
    slotData: {
        a: 1,
        b: 2,
        c: 3
    }
}, {
    id: 'test4',
    text: 'Text 4',
    slotData: {
        a: 1,
        b: 2,
        c: 3
    }
}, {
    id: 'test5',
    text: 'Text 5',
    slotData: {
        a: 1,
        b: 2,
        c: 3
    }
}];
const SLOT_CONTENT_MOCK = `
<template slot-scope="slotProps">
{{ slotProps.slotData.a }} {{ slotProps.slotData.b }} {{ slotProps.slotData.c }}
</template>
`;

const doMount = ({
    name = null,
    value = null,
    placeholder = null,
    isValid,
    possibleValues = POSSIBLE_VALUES_MOCK,
    ariaLabel = ARIA_LABEL_MOCK,
    scopedSlots = null
} = {}) => {
    const propsData = {
        possibleValues,
        ariaLabel,
        value,
        placeholder,
        name,
        isValid: isUndefined(isValid) ? true : isValid
    };
    const wrapper = mount(Dropdown, {
        propsData,
        localVue,
        scopedSlots
    });

    return {
        wrapper
    };
};

describe('Dropdown.vue', () => {
    it('renders', () => {
        const { wrapper } = doMount();
        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.isVisible()).toBeTruthy();
        expect(wrapper.findAll('[role=option]').length).toBe(POSSIBLE_VALUES_MOCK.length);
    });

    it('sets the correct aria-* attributes', () => {
        const { wrapper } = doMount();
        let button = wrapper.find('[role=button]');
        expect(button.attributes('aria-label')).toBe(ARIA_LABEL_MOCK);
    });

    it('renders value text or placeholder if no or empty value set', () => {
        const placeholder = 'my-placeholder';
        const value = 'test3';
        const { wrapper } = doMount({ placeholder, value });

        const button = wrapper.find('[role=button]');
        expect(button.text()).toBe('Text 3');
        expect(wrapper.vm.isMissing).toBeFalsy();

        wrapper.setProps({ value: null });
        expect(button.text()).toBe(placeholder);
        wrapper.setProps({ value: '' });
        expect(button.text()).toBe(placeholder);
    });

    it('renders a hidden input field to be able to read form data', () => {
        let placeholder = 'my-placeholder';
        const value = 'test66';
        const name = 'test-name';
        const { wrapper } = doMount({
            value, name, placeholder
        });
        expect(wrapper.find('input').exists()).toBe(true);
        expect(wrapper.find('input').element.value).toBe(value);
        expect(wrapper.find('input').attributes('name')).toBe(name);
    });

    it('renders invalid value if value is invalid', () => {
        const value = 'no';
        const { wrapper } = doMount({ value });
        let button = wrapper.find('[role=button]');
        expect(button.text()).toBe(`(MISSING) ${value}`);
    });

    it('detects that there is a missing value', () => {
        const value = 'no';
        const { wrapper } = doMount({ value });
        expect(wrapper.vm.isMissing).toBeTruthy();
    });

    it('renders invalid style', () => {
        const isValid = false;
        const { wrapper } = doMount({
            isValid
        });
        let root = wrapper.find('div');
        expect(root.classes()).toContain('invalid');
    });

    it('opens the listbox on click of button and emits event for clicked value', () => {
        const { wrapper } = doMount();
        let newValueIndex = 1;
        let listbox = wrapper.find('[role=listbox]');

        // open list
        wrapper.find('[role=button]').trigger('click');
        expect(listbox.isVisible()).toBe(true);

        let input = wrapper.findAll('li[role=option]').at(newValueIndex);
        input.trigger('click');

        expect(wrapper.emitted().input[0][0]).toEqual(POSSIBLE_VALUES_MOCK[newValueIndex].id);

        // listbox closed
        expect(listbox.isVisible()).toBe(false);
    });

    it('provides a valid hasSelection method', () => {
        const { wrapper } = doMount();
        expect(wrapper.vm.hasSelection()).toBe(false);
        wrapper.setProps({ value: 'test2' });
        expect(wrapper.vm.hasSelection()).toBe(true);
    });

    describe.each([
        {
            possibleValues: POSSIBLE_VALUES_MOCK,
            scopedSlots: null,
            type: 'dropdown'
        },
        { possibleValues: POSSIBLE_SLOTTED_VALUES_MOCK,
            scopedSlots: { option: SLOT_CONTENT_MOCK },
            type: 'slotted dropdown' }
    ])('keyboard navigation', ({ possibleValues, scopedSlots, type }) => {
        it(`opens and closes the listbox on enter/esc for a ${type}`, () => {
            const { wrapper } = doMount({ possibleValues, scopedSlots });
            const listbox = wrapper.find('[role=listbox]');

            // open list
            wrapper.find('[role=button]').trigger('keydown.enter');
            expect(listbox.isVisible()).toBe(true);

            // close listbox
            listbox.trigger('keydown.esc');
            expect(listbox.isVisible()).toBe(false);
        });

        it(`sets the values on keydown navigation for a ${type}`, () => {
            const value = possibleValues[1].id; // defines start point
            const { wrapper } = doMount({ possibleValues, value, scopedSlots });
            const ul = wrapper.find('ul');
            ul.trigger('keydown.down');
            expect(wrapper.emitted().input[0][0]).toEqual(possibleValues[2].id);
        });

        it(`sets the values on keyup navigation for a ${type}`, () => {
            const value = possibleValues[1].id; // defines start point
            const { wrapper } = doMount({ possibleValues, value, scopedSlots });
            const ul = wrapper.find('ul');
            ul.trigger('keydown.up');
            expect(wrapper.emitted().input[0][0]).toEqual(possibleValues[0].id);
        });

        it(`sets no values on keyup navigation at the start for a ${type}`, () => {
            const value = possibleValues[0].id; // defines start point
            const { wrapper } = doMount({ possibleValues, value, scopedSlots });
            const ul = wrapper.find('ul');
            ul.trigger('keydown.up');
            expect(wrapper.emitted().input).toBeFalsy();
        });

        it(`sets no values on keydown navigation at the end for a ${type}`, () => {
            const value = possibleValues[possibleValues.length - 1].id; // defines start point
            const { wrapper } = doMount({ possibleValues, value, scopedSlots });
            const ul = wrapper.find('ul');
            ul.trigger('keydown.down');
            expect(wrapper.emitted().input).toBeFalsy();
        });

        it(`sets the values to the first value on home key for a ${type}`, () => {
            const value = possibleValues[2].id; // defines start point
            const { wrapper } = doMount({ possibleValues, value, scopedSlots });
            const ul = wrapper.find('ul');
            ul.trigger('keydown.home');
            expect(wrapper.emitted().input[0][0]).toBe(possibleValues[0].id);
        });

        it(`sets the values to the last value on end key for a ${type}`, () => {
            const value = possibleValues[2].id; // defines start point
            const { wrapper } = doMount({ possibleValues, value, scopedSlots });
            const ul = wrapper.find('ul');
            ul.trigger('keydown.end');
            expect(wrapper.emitted().input[0][0]).toBe(possibleValues[possibleValues.length - 1].id);
        });
    });

    describe.each([
        {
            possibleValues: POSSIBLE_VALUES_MOCK,
            scopedSlots: null,
            type: 'dropdown'
        },
        { possibleValues: POSSIBLE_SLOTTED_VALUES_MOCK,
            scopedSlots: { option: SLOT_CONTENT_MOCK },
            type: 'slotted dropdown' }
    ])('keyboard search', ({ possibleValues, scopedSlots, type }) => {
        it(`finds the first matching item for a ${type}`, () => {
            const value = possibleValues[2].id; // defines start point
            const { wrapper } = doMount({ possibleValues, value, scopedSlots });
            const ul = wrapper.find('ul');

            ul.find('ul').trigger('keydown', {
                key: 't'
            });
            expect(wrapper.emitted().input[0][0]).toBe('test1');
        });

        it(`finds a more exact matching item for a ${type}`, () => {
            const value = possibleValues[2].id; // defines start point
            const { wrapper } = doMount({ possibleValues, value, scopedSlots });
            const ul = wrapper.find('ul');

            ul.trigger('keydown', { key: 't' });
            ul.trigger('keydown', { key: 'e' });
            ul.trigger('keydown', { key: 'x' });
            ul.trigger('keydown', { key: 't' });
            ul.trigger('keydown', { key: ' ' });
            ul.trigger('keydown', { key: '4' });

            expect(wrapper.emitted().input[5][0]).toBe('test4');
        });


        it(`resets after stop typing for a ${type}`, () => {
            const value = possibleValues[2].id; // defines start point
            const { wrapper } = doMount({ possibleValues, value, scopedSlots });
            const ul = wrapper.find('ul');

            ul.trigger('keydown', { key: 't' });
            expect(wrapper.emitted().input[0][0]).toBe('test1');

            // stopping typing
            jest.runAllTimers();

            ul.trigger('keydown', { key: 't' });
            ul.trigger('keydown', { key: 'e' });
            ul.trigger('keydown', { key: 'x' });
            ul.trigger('keydown', { key: 't' });
            ul.trigger('keydown', { key: ' ' });
            ul.trigger('keydown', { key: '3' });

            expect(wrapper.emitted().input[6][0]).toBe('test3');
        });
    });

    describe('Slotted Dropdown', () => {
        it('render slots if slotData is given', () => {
            const scopedSlots = { option: SLOT_CONTENT_MOCK };
            // use a single value to make look-up easier
            const possibleValues = [cloneDeep(POSSIBLE_SLOTTED_VALUES_MOCK[0])];
            const { wrapper } = doMount({ possibleValues, scopedSlots });
            const option = wrapper.find('li');
            expect(option.classes()).toContain('slotted');
            expect(option.text()).not.toBe(possibleValues[0].text);
            expect(option.text())
                .toBe(
                    `${possibleValues[0].slotData.a} ${possibleValues[0].slotData.b} ${possibleValues[0].slotData.c}`
                );
        });

        it('render text slots if slotData is not given', () => {
            const scopedSlots = { option: SLOT_CONTENT_MOCK };
            // use a single value to make look-up easier
            const possibleValues = [cloneDeep(POSSIBLE_SLOTTED_VALUES_MOCK[0])];
            delete possibleValues[0].slotData;
            const { wrapper } = doMount({ possibleValues, scopedSlots });
            const option = wrapper.find('li');
            expect(option.classes()).not.toContain('slotted');
            expect(option.text()).toBe(possibleValues[0].text);
        });
    });
});
