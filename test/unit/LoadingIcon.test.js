import { shallowMount } from '@vue/test-utils';
import LoadingIcon from '~/ui/components/LoadingIcon.vue';
import ReloadIcon from '../../ui/assets/img/icons/reload.svg';

describe('LoadingIcon.vue', () => {
    it('renders', () => {
        const wrapper = shallowMount(LoadingIcon,{
             stubs: {
                ReloadIcon 
            }
        });

        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.isVisible()).toBeTruthy();
        expect(wrapper.find(ReloadIcon).exists()).toBeTruthy();
    });
});
