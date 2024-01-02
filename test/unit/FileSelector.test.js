import { mount, shallowMount } from '@vue/test-utils';
import FileSelector from '../../ui/components/FileSelector.vue';
import Button from '../../ui/components/Button.vue';
import LensIcon from '../../ui/assets/img/icons/lens.svg';

describe('FileSelector.vue', () => {
    it('renders correctly with no selected file', () => {
        const wrapper = mount(FileSelector, {
            propsData: {
                label: 'Select file',
                acceptedFileTypes: '*',
                multiple: false
            }
        });

        expect(wrapper.find(Button).exists()).toBeTruthy();
        expect(wrapper.find(LensIcon).exists()).toBeTruthy();
        expect(wrapper.find('label').exists()).toBeTruthy();
        expect(wrapper.find('.filename').text()).toContain('No file selected');
    });
});

it('opens file chooser on button click', async () => {
    const wrapper = mount(FileSelector, {
        propsData: {
            label: 'Select file',
            acceptedFileTypes: '*',
            multiple: false
        }
    });
    const fileChooserClickspy = jest.spyOn(wrapper.vm.$refs.fileChooser, 'click');

    await wrapper.find(Button).trigger('click');
    expect(fileChooserClickspy).toHaveBeenCalled();
});

it('updates displayed filename on file selection', () => {
    const wrapper = shallowMount(FileSelector, {
        propsData: {
            label: 'Select file',
            acceptedFileTypes: '*',
            multiple: true
        }
    });

    const file = new File(['test file'], 'test-file.txt', {
        type: 'text/plain'
    });

    wrapper.vm.onSelect({
        target: {
            files: [file]
        }
    });
    expect(wrapper.emitted().input).toBeTruthy();
    expect(wrapper.find('.filename').text()).toContain('test-file.txt');
});
