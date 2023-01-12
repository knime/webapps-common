import { shallowMount } from '@vue/test-utils';
import MockComponent from './mockComponent.vue';
import isSettingsVisibleMixin from '../../../../../src/components/mixins/isSettingsVisibleMixin';

describe('isSettingsVisibleMixin.js', () => {
    let propsData;

    beforeEach(() => {
        propsData = {
            control: {
                visible: true,
                uischema: {
                    options: {
                        isAdvanced: false
                    }
                },
                rootSchema: {
                    showAdvancedSettings: false
                }
            }
        };
    });

    it('shows settings that are not advanced', () => {
        const wrapper = shallowMount(MockComponent, {
            propsData,
            mixins: [isSettingsVisibleMixin]
        });
        expect(wrapper.vm.isVisible).toEqual(true);
    });

    it('shows settings that are advanced and advanced options are to be shown', () => {
        propsData.control.uischema.options.isAdvanced = true;
        propsData.control.rootSchema.showAdvancedSettings = true;
        const wrapper = shallowMount(MockComponent, {
            propsData,
            mixins: [isSettingsVisibleMixin]
        });
        expect(wrapper.vm.isVisible).toEqual(true);
    });

    it('does not show settings that are advanced and advanced options are not to be shown', () => {
        propsData.control.uischema.options.isAdvanced = true;
        propsData.control.rootSchema.showAdvancedSettings = false;
        const wrapper = shallowMount(MockComponent, {
            propsData,
            mixins: [isSettingsVisibleMixin]
        });
        expect(wrapper.vm.isVisible).toEqual(false);
    });

    it('does not show advanced settings if visible is false from control element', () => {
        propsData.control.uischema.options.isAdvanced = true;
        propsData.control.visible = false;
        const wrapper = shallowMount(MockComponent, {
            propsData,
            mixins: [isSettingsVisibleMixin]
        });
        expect(wrapper.vm.isVisible).toEqual(false);
    });
});
