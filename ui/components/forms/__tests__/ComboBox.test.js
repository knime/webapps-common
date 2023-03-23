import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';

import ComboBox from '../ComboBox.vue';
import Multiselect from '../Multiselect.vue';

const doMount = (dynamicProps, options) => mount(ComboBox, {
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

    it('updates the selected ids and emits update:selectedIds when updateSelectedIds is called', async () => {
        const wrapper = doMount({ initialSelectedIds: ['test1', 'test2', 'test3'] });
        await wrapper.findAll('.remove-tag-button').at(1).trigger('click');
        const selectedIds = ['test1', 'test3'];
        expect(wrapper.vm.selectedIds).toEqual(selectedIds);
        expect(wrapper.emitted()).toHaveProperty('update:selectedIds');
        expect(wrapper.emitted()['update:selectedIds'][0]).toEqual([selectedIds]);
    });

    it('calls the child function to update focus options when the searchInput changes', async () => {
        const wrapper = doMount();
        const updateFocusSpy = vi.spyOn(wrapper.findComponent(Multiselect).vm, 'updateFocusOptions');
        await wrapper.find({ ref: 'searchInput' }).setValue('te');
        expect(updateFocusSpy).toHaveBeenCalled();
    });

    it('sets the size of visible options at maximum to the length of the filtered values', async () => {
        const sizeVisibleOptions = 3;
        const wrapper = doMount({ sizeVisibleOptions });
        const searchInput = wrapper.find({ ref: 'searchInput' });
        await searchInput.setValue('test2');
        expect(wrapper.vm.sizeVisibleOptions).toBe(sizeVisibleOptions);
        expect(wrapper.vm.filteredValues).toHaveLength(1);
        expect(wrapper.vm.maxSizeVisibleOptions).toBe(1);
    });

    describe('focussing', () => {
        it('opens the multiselect when the input gets focussed and updates focus options', async () => {
            const wrapper = doMount({}, { attachTo: document.body });
            const toggleSpy = vi.spyOn(wrapper.findComponent(Multiselect).vm, 'toggle');
            const updateFocusSpy = vi.spyOn(wrapper.findComponent(Multiselect).vm, 'updateFocusOptions');
            await wrapper.find({ ref: 'searchInput' }).trigger('focus');
            expect(toggleSpy).toHaveBeenCalled();
            expect(updateFocusSpy).toHaveBeenCalled();
            expect(wrapper.vm.inputFocussed).toBeTruthy();
        });

        it('has the search input as focus element when there is no option selected', () => {
            const wrapper = doMount();
            const searchInput = wrapper.find('.search-input').wrapperElement;
            expect(wrapper.vm.focusElements).toEqual([searchInput]);
        });

        it('has the search input/removeAllTags button as focus elements when there is at least one option selected',
            async () => {
                const wrapper = doMount({ initialSelectedIds: [] });
                const searchInput = wrapper.find('.search-input').wrapperElement;
                const removeAllTagsButton = wrapper.find('.remove-all-tags-button').wrapperElement;
                expect(wrapper.vm.focusElements).toEqual([searchInput]);
                wrapper.vm.updateSelectedIds(['test1']);
                await wrapper.vm.$nextTick();
                expect(wrapper.vm.focusElements).toEqual([searchInput, removeAllTagsButton]);
            });

        it('clears the search when the focus is outside the ComboBox', async () => {
            const wrapper = doMount({}, { attachTo: document.body });
            await wrapper.find('.summary-input-wrapper').trigger('click');
            const input = wrapper.find({ ref: 'searchInput' });
            expect(input.wrapperElement).toBe(document.activeElement);
            expect(wrapper.vm.inputFocussed).toBeTruthy();

            wrapper.findComponent(Multiselect).vm.$emit('focusOutside');
            expect(wrapper.vm.inputFocussed).toBeFalsy();
            expect(wrapper.vm.searchValue).toBe('');
        });

        it('refocusses the listbox when pressing esc on the dropdown', async () => {
            vi.useFakeTimers();
            const wrapper = doMount({}, { attachTo: document.body });
            wrapper.vm.focusInput();
            wrapper.vm.onDown();
            await wrapper.find('.multiselect').trigger('keydown.esc');
            vi.runAllTimers();
            expect(wrapper.find('.summary-input-icon-wrapper').wrapperElement).toBe(document.activeElement);
        });
    });

    describe('tag interactions', () => {
        it('removes a tag on click of removeTag button', async () => {
            const wrapper = doMount({ initialSelectedIds: ['test2', 'test3'] });
            const updateSelectedIdsSpy = vi.spyOn(wrapper.vm, 'updateSelectedIds');
            await wrapper.findAll('.remove-tag-button').at(0).trigger('click');
            expect(updateSelectedIdsSpy).toHaveBeenCalledWith(['test3']);
        });

        it('clears all selected values and focusses the input on click of removeAllTags button', async () => {
            const wrapper = doMount({ initialSelectedIds: ['test2', 'test3'] });
            const focusInputSpy = vi.spyOn(wrapper.vm, 'focusInput');
            const updateSelectedIdsSpy = vi.spyOn(wrapper.vm, 'updateSelectedIds');
            
            await wrapper.find('.remove-all-tags-button').trigger('click');
            expect(focusInputSpy).toHaveBeenCalled();
            expect(updateSelectedIdsSpy).toHaveBeenCalledWith([]);
        });
    });

    describe('keyboard navigation', () => {
        it('calls onDown on keydown.down on the input', async () => {
            const wrapper = doMount();
            const onDownSpy = vi.spyOn(wrapper.findComponent(Multiselect).vm, 'onDown');
            await wrapper.find({ ref: 'searchInput' }).trigger('keydown.down');
            expect(onDownSpy).toHaveBeenCalled();
        });

        it('focusses the wrapper element on keydown.esc on the input', async () => {
            const wrapper = doMount({}, { attachTo: document.body });
            await wrapper.find({ ref: 'searchInput' }).trigger('keydown.esc');
            const summaryWrapper = wrapper.find({ ref: 'listBox' });
            expect(summaryWrapper.wrapperElement).toBe(document.activeElement);
        });
    });
});
