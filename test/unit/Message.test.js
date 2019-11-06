import Message from '~/ui/components/Message';
import { shallowMount } from '@vue/test-utils';
import InfoIcon from '../assets/img/icons/circle-info.svg?inline';
import WarnIcon from '../assets/img/icons/sign-warning.svg?inline';
import SuccessIcon from '../assets/img/icons/circle-check.svg?inline';

const collapserItemsData = {
    FOO_ERROR: {
        message: 'foo_error',
        type: 'errror'
    },
    TEST_ERROR: {
        message: 'test_error',
        type: 'error'
    }
};

describe('Message.vue', () => {
    let wrapper;

    it('renders default', () => {
        wrapper = shallowMount(Message);

        expect(wrapper.find('.type-icon').exists()).toBe(true);
        expect(wrapper.find(InfoIcon).exists()).toBe(true);
        expect(wrapper.find('.collapser').exists()).toBe(false);
    });

    it('renders success', () => {
        wrapper = shallowMount(Message, {
            propsData: {
                type: 'success'
            }
        });

        expect(wrapper.find('.type-icon').exists()).toBe(true);
        expect(wrapper.find(SuccessIcon).exists()).toBe(true);
        expect(wrapper.find('.collapser').exists()).toBe(false);
    });

    it('renders error', () => {
        wrapper = shallowMount(Message, {
            propsData: {
                type: 'error',
                collapserItems: collapserItemsData
            }
        });

        expect(wrapper.find('.type-icon').exists()).toBe(true);
        expect(wrapper.find(WarnIcon).exists()).toBe(true);
        expect(wrapper.find('.collapser').exists()).toBe(true);
        expect(wrapper.findAll('.collapser li').length).toBe(2);
        Object.keys(collapserItemsData).forEach((collapserKey, i) => {
            const element = wrapper.findAll('.collapser li').at(i);
            expect(element.text()).toEqual(`${collapserKey}: ${collapserItemsData[collapserKey].message}`);
        });
    });

    it('deletes message', () => {
        wrapper = shallowMount(Message, {
            propsData: {
                type: 'error',
                collapserItems: collapserItemsData
            }
        });

        expect(wrapper.find('section').exists()).toBe(true);
        wrapper.find('.close').trigger('click');
        expect(wrapper.find('section').exists()).toBe(false);
    });
});
