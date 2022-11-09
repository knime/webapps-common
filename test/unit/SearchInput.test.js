import { mount } from '@vue/test-utils';

import CloseIcon from '~/ui/assets/img/icons/close.svg';
import LensIcon from '~/ui/assets/img/icons/lens.svg';
import InverseSearchIcon from '~/ui/assets/img/icons/arrows-order-left-right.svg';
import UpperLowerCaseIcon from '~/ui/assets/img/icons/upper-lower-case.svg';
import FunctionButton from '~/ui/components/FunctionButton.vue';

import SearchInput from '~/ui/components/forms/SearchInput.vue';
import InputField from '~/ui/components/forms/InputField.vue';

describe('SearchInput', () => {
    let doShallowMount, wrapper, propsData;

    beforeEach(() => {
        wrapper = null;

        doShallowMount = () => {
            wrapper = mount(SearchInput, { propsData });
        };
    });

    it('renders', () => {
        doShallowMount();

        expect(wrapper.find(LensIcon).exists()).toBe(true);
        expect(wrapper.find(FunctionButton).find(CloseIcon).exists()).toBe(true);
        expect(wrapper.find(SearchInput).exists()).toBe(true);
        expect(wrapper.find(InputField).exists()).toBe(true);
        expect(wrapper.find(UpperLowerCaseIcon).exists()).toBeFalsy();
        expect(wrapper.find(InverseSearchIcon).exists()).toBeFalsy();
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

    it('emits focus event', () => {
        doShallowMount();

        wrapper.find(InputField).vm.$emit('focus');

        expect(wrapper.emitted().focus).toBeTruthy();
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

    describe('search options', () => {
        it('can show a case-sensitive button and inverse button', () => {
            propsData = {
                showCaseSensitiveSearchButton: true,
                showInverseSearchButton: true
            };

            doShallowMount();

            expect(wrapper.find(UpperLowerCaseIcon).exists()).toBeTruthy();
            expect(wrapper.find(InverseSearchIcon).exists()).toBeTruthy();
        });

        it('sets case-sensitive on case-sensitive button click', () => {
            propsData = {
                showCaseSensitiveSearchButton: true
            };

            doShallowMount();

            const caseSensitiveButton = wrapper.findAll(FunctionButton).at(1);
            expect(caseSensitiveButton.find(UpperLowerCaseIcon).exists()).toBeTruthy();
            expect(wrapper.vm.caseSensitiveSearch).toBeFalsy();

            caseSensitiveButton.vm.$emit('click');
            expect(wrapper.emitted('toggle-case-sensitive-search')).toStrictEqual([[true]]);
            expect(wrapper.vm.caseSensitiveSearch).toBeTruthy();
        });

        it('sets inverse search on inverse search button click', () => {
            propsData = {
                showInverseSearchButton: true
            };

            doShallowMount();

            const inverseSearchButton = wrapper.findAll(FunctionButton).at(1);
            expect(inverseSearchButton.find(InverseSearchIcon).exists()).toBeTruthy();
            expect(wrapper.vm.inverseSearchSearch).toBeFalsy();

            inverseSearchButton.vm.$emit('click');
            expect(wrapper.emitted('toggle-inverse-search')).toStrictEqual([[true]]);
            expect(wrapper.vm.inverseSearch).toBeTruthy();
        });
    });
});
