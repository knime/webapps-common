import { mount } from '@vue/test-utils';

import CloseIcon from '~/ui/assets/img/icons/close.svg';
import LensIcon from '~/ui/assets/img/icons/lens.svg';
import FunctionButton from '~/ui/components/FunctionButton.vue';

import SearchBar from '~/ui/components/forms/SearchBar.vue';

describe('SearchBar', () => {
    let doShallowMount, wrapper, propsData;

    beforeEach(() => {
        wrapper = null;

        doShallowMount = () => {
            wrapper = mount(SearchBar, { propsData });
        };
    });

    it('renders', () => {
        doShallowMount();

        expect(wrapper.find(LensIcon).exists()).toBe(true);
        expect(wrapper.find(FunctionButton).find(CloseIcon).exists()).toBe(true);
        expect(wrapper.find('input').exists()).toBe(true);
    });

    it('sets placeholder', () => {
        propsData = {
            placeholder: 'type something'
        };
        doShallowMount();

        expect(wrapper.find('input').attributes('placeholder')).toBe('type something');
    });

    it('can be focused via public method', () => {
        doShallowMount();

        let focusMock = jest.fn();
        wrapper.find('input').element.focus = focusMock;
        wrapper.vm.focus();

        expect(focusMock).toHaveBeenCalled();
    });

    describe('searching event', () => {
        it('searches on input in search box', () => {
            doShallowMount();

            const input = wrapper.find('input');
            input.setValue('some node');

            expect(wrapper.emitted('input')).toStrictEqual([['some node']]);
        });

        it('clears on clear button click', () => {
            doShallowMount();

            const closeButton = wrapper.find(FunctionButton);
            expect(closeButton.find(CloseIcon).exists()).toBe(true);

            closeButton.vm.$emit('click');
            expect(wrapper.emitted('input')).toStrictEqual([['']]);
            expect(wrapper.emitted('clear')).toBeTruthy();
        });
    });
});
