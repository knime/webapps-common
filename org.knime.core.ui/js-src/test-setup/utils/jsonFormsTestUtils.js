/* The methods exported by this test utility file can be used for testing components that are supposed to be used
 * within a JSONForms context.
 * A component can be mounted using composition API and the correct initialization of JSONForms can be verified on a
 * given vue test utils wrapper. */
import { expect, vi } from 'vitest';

import { mount } from '@vue/test-utils';
import { createStore } from 'vuex';

import { useJsonFormsLayout, useJsonFormsArrayControl } from '@jsonforms/vue';

import * as jsonFormsControlWithUpdateModule from '@/nodeDialog/uiComponents/composables/jsonFormsControlWithUpdate';

const mountJsonFormsComponentWithStoreAndCallbacks = (
    component, props, modules, showAdvanced = false
) => {
    const useJsonFormsControlSpy = vi.spyOn(jsonFormsControlWithUpdateModule, 'useJsonFormsControlWithUpdate');
    const callbacks = [];
    const updateData = vi.fn((handleChange, path, value) => handleChange(path, value));
    const wrapper = mount(
        component,
        {
            props,
            global: {
                provide: {
                    getKnimeService: () => ({
                        extensionConfig: {
                            nodeId: 'nodeId'
                        },
                        callService: vi.fn().mockResolvedValue({}),
                        registerDataGetter: vi.fn(),
                        addEventCallback: vi.fn(),
                        createAlert: vi.fn(),
                        sendWarning: vi.fn()
                    }),
                    registerWatcher: (
                        { transformSettings, init, dependencies }
                    ) => callbacks.push({ transformSettings, init, dependencies }),
                    updateData
                },
                stubs: {
                    DispatchRenderer: true
                },
                mocks: {
                    $store: createStore({ modules })
                }
            },
            provide: {
                jsonforms: {
                    core: {
                        schema: {
                            showAdvancedSettings: showAdvanced
                        }
                    }
                }
            }
        }
    );
    return { wrapper, callbacks, updateData, useJsonFormsControlSpy };
};

export const mountJsonFormsComponentWithStore = (
    component, props, modules, showAdvanced = false
) => mountJsonFormsComponentWithStoreAndCallbacks(
    component, props, modules, showAdvanced
);

export const mountJsonFormsComponentWithCallbacks = (
    component, { props }, modules = null
) => mountJsonFormsComponentWithStoreAndCallbacks(
    component, props, modules, false
);

// eslint-disable-next-line arrow-body-style
export const mountJsonFormsComponent = (component, propsData, showAdvanced) => {
    return mountJsonFormsComponentWithStore(component, propsData, null, showAdvanced);
};

const hasBasicProps = (props) => {
    expect(props.hasOwnProperty('schema')).toBe(true);
    expect(props.hasOwnProperty('uischema')).toBe(true);
    expect(props.hasOwnProperty('path')).toBe(true);
};

export const initializesJsonFormsControl = ({ wrapper, useJsonFormsControlSpy }) => {
    const props = wrapper.props();
    hasBasicProps(props);
    expect(props.hasOwnProperty('control')).toBe(true);
    expect(props.control.schema).toBeDefined();
    expect(props.control.uischema).toBeDefined();
    expect(useJsonFormsControlSpy).toHaveBeenCalled();
};

export const initializesJsonFormsLayout = (wrapper) => {
    const props = wrapper.props();
    hasBasicProps(props);
    expect(props.hasOwnProperty('layout')).toBe(true);
    expect(props.layout.schema).toBeDefined();
    expect(props.layout.uischema).toBeDefined();
    expect(useJsonFormsLayout).toHaveBeenCalled();
};

export const initializesJsonFormsArrayControl = (wrapper) => {
    const props = wrapper.props();
    hasBasicProps(props);
    expect(props.hasOwnProperty('control')).toBe(true);
    expect(props.control.schema).toBeDefined();
    expect(props.control.uischema).toBeDefined();
    expect(useJsonFormsArrayControl).toHaveBeenCalled();
};
