import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createStore } from 'vuex';
import { shallowMount } from '@vue/test-utils';
import { JsonForms } from '@jsonforms/vue';
import { JsonDataService } from '@knime/ui-extension-service';
import { dialogInitialData } from '@@/test-setup/mocks/dialogInitialData';

import NodeDialog from '../NodeDialog.vue';
import flushPromises from 'flush-promises';

window.closeCEFWindow = () => {};

describe('NodeDialog.vue', () => {
    const getOptions = ({ setApplySettingsMock, dirtySettingsMock, cleanSettingsMock } = {}) => {
        const dialogStoreOptions = {
            actions: {
                setApplySettings: setApplySettingsMock || vi.fn(),
                dirtySettings: dirtySettingsMock || vi.fn(),
                cleanSettings: cleanSettingsMock || vi.fn()
            },
            namespaced: true
        };
        return {
            global: {
                provide: {
                    getKnimeService: () => ({
                        extensionConfig: {},
                        callService: vi.fn().mockResolvedValue({}),
                        registerDataGetter: vi.fn(),
                        addEventCallback: vi.fn()
                    })
                },
                mocks: {
                    $store: createStore({
                        modules: {
                            'pagebuilder/dialog': dialogStoreOptions
                        }
                    })
                }
            },
            props: {
                dialogSettings: {
                    nodeId: 'test'
                }
            }
        };
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(JsonDataService.prototype, 'initialData').mockResolvedValue({ ...dialogInitialData });
        vi.spyOn(JsonDataService.prototype, 'applyData').mockResolvedValue();
        vi.spyOn(JsonDataService.prototype, 'publishData').mockResolvedValue();
    });

    it('renders empty wrapper', async () => {
        const setApplySettingsMock = vi.fn();
        const wrapper = shallowMount(NodeDialog, getOptions({ setApplySettingsMock }));
        await flushPromises();

        expect(wrapper.getComponent(NodeDialog).exists()).toBe(true);
        expect(setApplySettingsMock).toHaveBeenCalled();
    });

    it('passes props to jsonform', async () => {
        const wrapper = shallowMount(NodeDialog, getOptions());
        await flushPromises();

        const jsonformsStub = wrapper.getComponent(JsonForms);

        expect(jsonformsStub.props('data')).toStrictEqual(dialogInitialData.data);
        expect(jsonformsStub.props('schema')).toStrictEqual(dialogInitialData.schema);
        expect(jsonformsStub.props('uischema')).toStrictEqual(dialogInitialData.ui_schema);
    });

    it('returns current values on getData', async () => {
        const wrapper = shallowMount(NodeDialog, getOptions());
        await flushPromises();

        expect(wrapper.vm.getData()).toStrictEqual(dialogInitialData.data);
    });

    describe('onSettingsChanged', () => {
        let wrapper, onSettingsChangedSpy, publishDataSpy, jsonformsStub, dirtySettingsMock, cleanSettingsMock;

        beforeEach(async () => {
            dirtySettingsMock = vi.fn();
            cleanSettingsMock = vi.fn();
            wrapper = shallowMount(NodeDialog, getOptions({ dirtySettingsMock, cleanSettingsMock }));
            onSettingsChangedSpy = vi.spyOn(wrapper.vm, 'onSettingsChanged');
            publishDataSpy = vi.spyOn(wrapper.vm.jsonDataService, 'publishData');

            await flushPromises();

            jsonformsStub = wrapper.getComponent(JsonForms);
        });

        it('sets new values', () => {
            jsonformsStub.vm.$emit('change', {
                data: { ...dialogInitialData.data, yAxisScale: 'NEW_VALUE' }
            });

            expect(onSettingsChangedSpy).toHaveBeenCalledWith({
                data: { ...dialogInitialData.data, yAxisScale: 'NEW_VALUE' }
            });

            const expectedData = {
                ...dialogInitialData.data,
                yAxisScale: 'NEW_VALUE'
            };

            expect(wrapper.vm.settings.data).toStrictEqual(expectedData);
            expect(publishDataSpy).toHaveBeenCalledWith({ ...dialogInitialData, data: expectedData });
            expect(dirtySettingsMock).toHaveBeenCalledTimes(1);
        });

        it('cleans settings if new data match original data', () => {
            const payload = { data: dialogInitialData.data };
            jsonformsStub.vm.$emit('change', payload);

            expect(onSettingsChangedSpy).toHaveBeenCalledWith(payload);

            expect(wrapper.vm.settings.data).toStrictEqual(dialogInitialData.data);
            expect(wrapper.vm.originalSettingsData).toStrictEqual(JSON.stringify(dialogInitialData.data));
            expect(publishDataSpy).toHaveBeenCalledWith(wrapper.vm.settings);
            expect(cleanSettingsMock).toHaveBeenCalledTimes(1);
            expect(dirtySettingsMock).toHaveBeenCalledTimes(0);
        });

        it('does not set new value if data is not provided', () => {
            jsonformsStub.vm.$emit('change', {});

            expect(wrapper.vm.settings.data).toStrictEqual({
                ...dialogInitialData.data
            });
            expect(publishDataSpy).not.toHaveBeenCalled();
            expect(dirtySettingsMock).toHaveBeenCalledTimes(0);
        });
    });

    describe('applySettings', () => {
        it('calls apply data and closes window', async () => {
            const wrapper = shallowMount(NodeDialog, getOptions());
            const closeDialogSpy = vi.spyOn(wrapper.vm, 'closeDialog');
            const applyDataSpy = vi.spyOn(wrapper.vm.jsonDataService, 'applyData').mockReturnValue({});
            await flushPromises();

            await wrapper.vm.applySettingsCloseDialog();

            expect(applyDataSpy).toHaveBeenCalled();
            expect(closeDialogSpy).toHaveBeenCalled();
        });

        it('calls apply data and does not close window if settings are invalid', async () => {
            const wrapper = shallowMount(NodeDialog, getOptions());
            const closeDialogSpy = vi.spyOn(wrapper.vm, 'closeDialog');
            const applyDataSpy = vi.spyOn(wrapper.vm.jsonDataService, 'applyData').mockReturnValue({
                result: 'test'
            });
            await flushPromises();

            await wrapper.vm.applySettingsCloseDialog();

            expect(applyDataSpy).toHaveBeenCalled();
            expect(closeDialogSpy).not.toHaveBeenCalled();
        });

        it('logs error that apply data been thrown', async () => {
            vi.spyOn(JsonDataService.prototype, 'applyData').mockRejectedValue(new Error());
            const wrapper = shallowMount(NodeDialog, getOptions());
            await flushPromises();

            expect(wrapper.vm.applySettingsCloseDialog()).rejects.toThrowError();
        });
    });

    it('calls window.closeCEFWindow in closeDialog', () => {
        const wrapper = shallowMount(NodeDialog, getOptions());
        const spy = vi.spyOn(window, 'closeCEFWindow');

        wrapper.vm.closeDialog();

        expect(spy).toHaveBeenCalledWith();
    });

    describe('registerWatcher', () => {
        it('provides registerWatcher method', () => {
            const wrapper = shallowMount(NodeDialog, getOptions());
            // this.registerWatcher is undefined in the test setup, so we just check for the key.
            expect(Object.getOwnPropertyNames(wrapper.vm.$options.provide())).toContain('registerWatcher');
        });


        it('calls registered callbacks on data update', async () => {
            const wrapper = shallowMount(NodeDialog, getOptions());
            await flushPromises();
            const callbacks = [vi.fn(), vi.fn(), vi.fn()];
            callbacks.forEach(c => {
                wrapper.vm.registerWatcher(c);
            });
            const jsonformsStub = wrapper.getComponent(JsonForms);
            const data = { ...dialogInitialData.data, yAxisScale: 'NEW_VALUE' };
            jsonformsStub.vm.$emit('change', { data });
            callbacks.forEach(c => expect(c).toHaveBeenCalledWith(dialogInitialData.data, data));
        });
    });
});
