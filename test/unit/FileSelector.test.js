import { mount, shallowMount } from '@vue/test-utils';
import FileSelector from '../../ui/components/FileSelector.vue';
import Button from "../../ui/components/Button.vue";
import LensIcon from "../../ui/assets/img/icons/lens.svg";

const event = {
    target: {
      files: [
        {
            name: "README.md",
            size: 9681,
            type:"text/markdown",
        },
      ],
    },
  }

describe('FileSelector.vue', () => {
  it('renders correctly with no selected file',  () => {
    const wrapper =  mount(FileSelector, {
        propsData: {
          label: 'Select file',
          acceptedFileTypes: '*',
          multiple: false,
        },
      });    
      debugger;

      expect(wrapper.find(Button).exists()).toBeTruthy();
      expect(wrapper.find(LensIcon).exists()).toBeTruthy();
      expect(wrapper.find('label').exists()).toBeTruthy();
    expect(wrapper.find('.filename').text()).toContain('No file selected');
  });
});


//   it('opens file chooser on button click', () => {
//     const wrapper = mount(FileSelector, {
//       propsData: {
//         label: 'Select file',
//         acceptedFileTypes: '*',
//         multiple: false,
//       },
//     });

//     wrapper.find('Button').trigger('click');
//     expect(wrapper.vm.$refs.fileChooser.click).toHaveBeenCalled();
//   });

//   it('updates displayed filename on file selection', async () => {
//     const wrapper = mount(FileSelector, {
//       propsData: {
//         label: 'Select file',
//         acceptedFileTypes: '*',
//         multiple: false,
//       },
//     });
//     debugger
//     const fileInput = wrapper.find('input[type="file"]');
//     //   await fileInput.trigger('change', {
//     //   target: { files: FILES_MOCK }
//     // });
//     expect(wrapper.find('.filename').text()).toContain('fakefile.png');
//   });

