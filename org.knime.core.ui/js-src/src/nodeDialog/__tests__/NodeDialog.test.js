import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { createStore } from 'vuex';
import { shallowMount } from '@vue/test-utils';
import { JsonForms } from '@jsonforms/vue';
import { JsonDataService } from '@knime/ui-extension-service';
import { dialogInitialData } from '@@/test-setup/mocks/dialogInitialData';

import NodeDialog from '@/nodeDialog/NodeDialog.vue';

window.closeCEFWindow = () => {};

describe('NodeDialog.vue', () => {
    const getOptions = ({ setApplySettingsMock, dirtySettingsMock, cleanSettingsMock } = {}) => ({
        global: {
            provide: {
                getKnimeService: () => ({
                    extensionConfig: {},
                    callService: vi.fn().mockResolvedValue({}),
                    registerDataGetter: vi.fn(),
                    addNotificationCallback: vi.fn()
                })
            },
            mocks: {
                $store: createStore({
                    modules: {
                        pagebuilder: {
                            modules: {
                                dialog: {
                                    actions: {
                                        setApplySettings: setApplySettingsMock || vi.fn(),
                                        dirtySettings: dirtySettingsMock || vi.fn(),
                                        cleanSettings: cleanSettingsMock || vi.fn()
                                    },
                                    namespaced: true
                                }
                            },
                            namespaced: true
                        }
                    }
                })
            }
        },
        props: {
            dialogSettings: {
                nodeId: 'test'
            }
        }
    });

    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(JsonDataService.prototype, 'initialData').mockResolvedValue({ ...dialogInitialData });
        vi.spyOn(JsonDataService.prototype, 'applyData').mockResolvedValue();
        vi.spyOn(JsonDataService.prototype, 'publishData').mockResolvedValue();
    });

    it('renders empty wrapper', async () => {
        const setApplySettingsMock = vi.fn();
        const wrapper = await shallowMount(NodeDialog, getOptions({ setApplySettingsMock }));
        await nextTick();
        await nextTick();
        await nextTick();

        expect(wrapper.getComponent(NodeDialog).exists()).toBe(true);
        expect(setApplySettingsMock).toHaveBeenCalled();
    });

    it('passes props to jsonform', async () => {
        const wrapper = await shallowMount(NodeDialog, getOptions());
        await nextTick();
        await nextTick();
        await nextTick();
        await nextTick();

        const jsonformsStub = wrapper.getComponent(JsonForms);

        expect(jsonformsStub.props('data')).toStrictEqual(dialogInitialData.data);
        expect(jsonformsStub.props('schema')).toStrictEqual(dialogInitialData.schema);
        expect(jsonformsStub.props('uischema')).toStrictEqual(dialogInitialData.ui_schema);
    });

    it('returns current values on getData', async () => {
        const wrapper = await shallowMount(NodeDialog, getOptions());
        await nextTick();
        await nextTick();
        await nextTick();

        expect(wrapper.vm.getData()).toStrictEqual(dialogInitialData.data);
    });

    describe('onSettingsChanged', () => {
        let wrapper, onSettingsChangedSpy, publishDataSpy, jsonformsStub, dirtySettingsMock, cleanSettingsMock;

        beforeEach(async () => {
            dirtySettingsMock = vi.fn();
            cleanSettingsMock = vi.fn();
            wrapper = await shallowMount(NodeDialog, getOptions({ dirtySettingsMock, cleanSettingsMock }));
            onSettingsChangedSpy = vi.spyOn(wrapper.vm, 'onSettingsChanged');
            publishDataSpy = vi.spyOn(wrapper.vm.jsonDataService, 'publishData');

            await nextTick();
            await nextTick();
            await nextTick();
            await nextTick();

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
            const wrapper = await shallowMount(NodeDialog, getOptions());
            const closeDialogSpy = vi.spyOn(wrapper.vm, 'closeDialog');
            const applyDataSpy = vi.spyOn(wrapper.vm.jsonDataService, 'applyData').mockReturnValue({});
            // Needed twice to make sure that the async mounted method is resolved first
            await nextTick();
            await nextTick();
            await nextTick();

            await wrapper.vm.applySettingsCloseDialog();

            expect(applyDataSpy).toHaveBeenCalled();
            expect(closeDialogSpy).toHaveBeenCalled();
        });

        it('calls apply data and does not close window if settings are invalid', async () => {
            const wrapper = await shallowMount(NodeDialog, getOptions());
            const closeDialogSpy = vi.spyOn(wrapper.vm, 'closeDialog');
            const applyDataSpy = vi.spyOn(wrapper.vm.jsonDataService, 'applyData').mockReturnValue({
                result: 'test'
            });
            // Needed to make sure that the async mounted method is resolved first
            await nextTick();
            await nextTick();
            await nextTick();

            await wrapper.vm.applySettingsCloseDialog();

            expect(applyDataSpy).toHaveBeenCalled();
            expect(closeDialogSpy).not.toHaveBeenCalled();
        });

        it('logs error that apply data been thrown', async () => {
            vi.spyOn(JsonDataService.prototype, 'applyData').mockRejectedValue(new Error());
            const wrapper = await shallowMount(NodeDialog, getOptions());
            await nextTick();

            expect(wrapper.vm.applySettingsCloseDialog()).rejects.toThrowError();
        });
    });

    it('calls window.closeCEFWindow in closeDialog', () => {
        const wrapper = shallowMount(NodeDialog, getOptions());
        const spy = vi.spyOn(window, 'closeCEFWindow');

        wrapper.vm.closeDialog();

        expect(spy).toHaveBeenCalledWith();
    });
});
