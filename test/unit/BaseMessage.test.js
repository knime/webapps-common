import BaseMessage from '~/ui/components/BaseMessage.vue';
import { mount } from '@vue/test-utils';

describe('BaseMessage.vue', () => {
    let wrapper;

    it('renders default', () => {
        wrapper = mount(BaseMessage, {
            slots: {
                default: 'I am a button, am I?'
            }
        });

        expect(wrapper.classes()).toEqual(['info']);
        expect(wrapper.html()).toContain('I am a button, am I?');
    });

    it('renders success', () => {
        wrapper = mount(BaseMessage, {
            propsData: {
                type: 'success'
            }
        });

        expect(wrapper.classes()).toEqual(['success']);
    });

    it('renders error', () => {
        wrapper = mount(BaseMessage, {
            propsData: {
                type: 'error'
            }
        });

        expect(wrapper.classes()).toEqual(['error']);
    });
});
