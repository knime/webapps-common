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
    const getOptions = ({ setApplySettingsMock } = {}) => {
        const dialogStoreOptions = {
            actions: {
                setApplySettings: setApplySettingsMock || vi.fn()
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
        let wrapper, onSettingsChangedSpy, publishDataSpy, jsonformsStub;

        beforeEach(async () => {
            wrapper = shallowMount(NodeDialog, getOptions());
            onSettingsChangedSpy = vi.spyOn(wrapper.vm, 'onSettingsChanged');
            publishDataSpy = vi.spyOn(wrapper.vm.jsonDataService, 'publishData');

            await flushPromises();

            jsonformsStub = wrapper.getComponent(JsonForms);
        });

        it('sets new values', () => {
            jsonformsStub.vm.$emit('change', {
                data: { ...dialogInitialData.data, model: { yAxisScale: 'NEW_VALUE' } }
            });

            expect(onSettingsChangedSpy).toHaveBeenCalledWith({
                data: { ...dialogInitialData.data, model: { yAxisScale: 'NEW_VALUE' } }
            });

            const expectedData = {
                ...dialogInitialData.data,
                model: { yAxisScale: 'NEW_VALUE' }
            };

            expect(wrapper.vm.settings.data).toStrictEqual(expectedData);
            expect(publishDataSpy).toHaveBeenCalledWith({ ...dialogInitialData, data: expectedData });
        });

        it('does not set new value if data is not provided', () => {
            jsonformsStub.vm.$emit('change', {});

            expect(wrapper.vm.settings.data).toStrictEqual({
                ...dialogInitialData.data
            });
            expect(publishDataSpy).not.toHaveBeenCalled();
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

        it('creates watcher when calling registerWatcher', async () => {
            const wrapper = shallowMount(NodeDialog, getOptions());
            await flushPromises();
            wrapper.setData({ settings: {
                data: {
                    test: 'test',
                    test2: 'test',
                    otherTest: 'test'
                }
            } });

            const callback = vi.fn();
            const dependencies = ['#/properties/test', '#/properties/test2'];

            wrapper.vm.registerWatcher(callback, dependencies);
            expect(callback).toHaveBeenCalledWith({
                test: 'test',
                test2: 'test'
            });
            callback.mockClear();
            
            await wrapper.setData({ settings: {
                data: {
                    test: 'test2',
                    test2: 'test',
                    otherTest: 'test'
                }
            } });
            expect(callback).toHaveBeenCalledWith({
                test: 'test2',
                test2: 'test'
            });
            callback.mockClear();

            await wrapper.setData({ settings: {
                data: {
                    test: 'test2',
                    test2: 'test',
                    otherTest: 'test2'
                }
            } });

            expect(callback).not.toHaveBeenCalled();


            await wrapper.setData({ settings: {
                data: {
                    test: 'test2',
                    test2: 'test2',
                    otherTest: 'test2'
                }
            } });

            expect(callback).toHaveBeenCalledWith({
                test: 'test2',
                test2: 'test2'
            });
        });
    });
});
