import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';

import CloseIcon from '../../../assets/img/icons/close.svg';
import LensIcon from '../../../assets/img/icons/lens.svg';
import FunctionButton from '../../FunctionButton.vue';

import SearchInput from '../SearchInput.vue';
import InputField from '../InputField.vue';

describe('SearchInput', () => {
    let doMount, wrapper, props;

    beforeEach(() => {
        wrapper = null;

        doMount = () => {
            wrapper = mount(SearchInput, { props });
        };
    });

    it('renders', () => {
        doMount();

        expect(wrapper.findComponent(LensIcon).exists()).toBe(true);
        expect(wrapper.findComponent(FunctionButton).findComponent(CloseIcon).exists()).toBe(true);
        expect(wrapper.findComponent(SearchInput).exists()).toBe(true);
        expect(wrapper.findComponent(InputField).exists()).toBe(true);
    });

    it('sets placeholder', () => {
        props = {
            placeholder: 'type something'
        };
        doMount();

        expect(wrapper.find('input').attributes('placeholder')).toBe('type something');
    });

    it('can be focused via public method', () => {
        doMount();

        let focusMock = vi.fn();
        wrapper.find('input').element.focus = focusMock;
        wrapper.vm.focus();

        expect(focusMock).toHaveBeenCalled();
    });

    describe('searching event', () => {
        it('searches on input in search box', async () => {
            doMount();

            const input = wrapper.find('input');
            await input.setValue('some node');

            expect(wrapper.emitted('update:modelValue')).toStrictEqual([['some node']]);
        });

        it('clears on clear button click', async () => {
            doMount();

            const closeButton = wrapper.findComponent(FunctionButton);
            await closeButton.vm.$emit('click');
            expect(wrapper.emitted('update:modelValue')).toStrictEqual([['']]);
            expect(wrapper.emitted('clear')).toBeTruthy();
        });
    });
});
