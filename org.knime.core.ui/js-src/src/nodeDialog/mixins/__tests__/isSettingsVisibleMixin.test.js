import { beforeEach, describe, expect, it } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import MockComponent from './mockComponent.vue';
import isSettingsVisibleMixin from '../isSettingsVisibleMixin';

describe('isSettingsVisibleMixin.js', () => {
    let props;

    beforeEach(() => {
        props = {
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
            props,
            mixins: [isSettingsVisibleMixin]
        });
        expect(wrapper.vm.isVisible).toBe(true);
    });

    it('shows settings that are advanced and advanced options are to be shown', () => {
        props.control.uischema.options.isAdvanced = true;
        props.control.rootSchema.showAdvancedSettings = true;
        const wrapper = shallowMount(MockComponent, {
            props,
            mixins: [isSettingsVisibleMixin]
        });
        expect(wrapper.vm.isVisible).toBe(true);
    });

    it('does not show settings that are advanced and advanced options are not to be shown', () => {
        props.control.uischema.options.isAdvanced = true;
        props.control.rootSchema.showAdvancedSettings = false;
        const wrapper = shallowMount(MockComponent, {
            props,
            mixins: [isSettingsVisibleMixin]
        });
        expect(wrapper.vm.isVisible).toBe(false);
    });

    it('does not show advanced settings if visible is false from control element', () => {
        props.control.uischema.options.isAdvanced = true;
        props.control.visible = false;
        const wrapper = shallowMount(MockComponent, {
            props,
            mixins: [isSettingsVisibleMixin]
        });
        expect(wrapper.vm.isVisible).toBe(false);
    });
});
