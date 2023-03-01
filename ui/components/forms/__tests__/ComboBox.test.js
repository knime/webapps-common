import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';

import Combobox from '../ComboBox.vue';
import Multiselect from '../Multiselect.vue';

const doMount = (dynamicProps, options) => mount(Combobox, {
    props: {
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
        ...dynamicProps
    },
    ...options
});

describe('ComboBox.vue', () => {
    it('renders', () => {
        const wrapper = doMount();
        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.isVisible()).toBeTruthy();
        expect(wrapper.classes()).toContain('multiselect');
        expect(wrapper.find('.summary-input-icon-wrapper')).toBeTruthy();
    });

    it('updates the selected ids and emits update:selectedIds when updateSelectedIds is called', () => {
        const wrapper = doMount({ initialSelectedIds: ['test1', 'test2', 'test3'] });
        wrapper.findAll('.remove-tag-button').at(1).trigger('click');
        const selectedIds = ['test1', 'test3'];
        expect(wrapper.vm.selectedIds).toEqual(selectedIds);
        expect(wrapper.emitted()).toHaveProperty('update:selectedIds');
        expect(wrapper.emitted()['update:selectedIds'][0]).toEqual([selectedIds]);
    });

    it('calls the child function to update focus options when ')

    describe('focussing', () => {
        it('has the search input as focus element when there are less than 2 options selected', () => {
            const wrapper = doMount();
            const searchInput = wrapper.find('.search-input').wrapperElement;
            expect(wrapper.vm.focusElements).toEqual([searchInput]);
        });

        it('has the search input/removeAllTags button as focus elements when there is more than one option selected',
            () => {
                const wrapper = doMount({ initialSelectedIds: ['test1', 'test2'] });
                const searchInput = wrapper.find('.search-input').wrapperElement;
                const removeAllTagsButton = wrapper.find('.remove-all-tags-button').wrapperElement;
                expect(wrapper.vm.focusElements).toEqual([searchInput, removeAllTagsButton]);
            });

        it('clears the search when the focus is outside the Combobox', async () => {
            const wrapper = doMount({}, { attachTo: document.body });
            await wrapper.find('.summary-input-wrapper').trigger('click');
            const input = wrapper.find({ ref: 'searchInput' });
            expect(input.wrapperElement).toBe(document.activeElement);
            expect(wrapper.vm.inputFocussed).toBeTruthy();

            wrapper.findComponent(Multiselect).vm.$emit('focusOutside');
            expect(wrapper.vm.inputFocussed).toBeFalsy();
            expect(wrapper.vm.searchValue).toBe('');
        });
    });

    describe('tag interactions', () => {
        it('removes a tag on click of removeTag button', () => {
            const wrapper = doMount({ initialSelectedIds: ['test2', 'test3'] });
            const updateSelectedIdsSpy = vi.spyOn(wrapper.vm, 'updateSelectedIds');
            wrapper.findAll('.remove-tag-button').at(0).trigger('click');
            expect(updateSelectedIdsSpy).toHaveBeenCalledWith(['test3']);
        });

        it('clears all selected values and focusses the input on click of removeAllTags button', () => {
            const wrapper = doMount({ initialSelectedIds: ['test2', 'test3'] });
            const focusInputSpy = vi.spyOn(wrapper.vm, 'focusInput');
            const updateSelectedIdsSpy = vi.spyOn(wrapper.vm, 'updateSelectedIds');
            
            wrapper.find('.remove-all-tags-button').trigger('click');
            expect(focusInputSpy).toHaveBeenCalled();
            expect(updateSelectedIdsSpy).toHaveBeenCalledWith([]);
        });
    });

    // expect(wrapper.vm.selectedIds).toEqual(['test2', 'test3']);
    // expect(wrapper.vm.selectedValues).toEqual([{ id: 'test2', text: 'test2' }, { id: 'test3', text: 'test3' }]);
    // expect(wrapper.vm.selectedIds).toHaveLength(0);
    //         expect(wrapper.vm.selectedValues).toHaveLength(0);
});
