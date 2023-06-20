/* The methods exported by this test utility file can be used for testing components that are supposed to be used
 * within a JSONForms context.
 * A component can be mounted using composition API and the correct initialization of JSONForms can be verified on a
 * given vue test utils wrapper. */
import { expect, vi } from 'vitest';

import { mount } from '@vue/test-utils';
import { createStore } from 'vuex';

import { useJsonFormsControl, useJsonFormsLayout, useJsonFormsArrayControl } from '@jsonforms/vue';

export const mountJsonFormsComponentWithStore = (component, props, modules, showAdvanced = false) => mount(
    component,
    {
        props,
        global: {
            provide: {
                getKnimeService: () => ({
                    extensionConfig: {},
                    callService: vi.fn().mockResolvedValue({}),
                    registerDataGetter: vi.fn(),
                    addEventCallback: vi.fn()
                })
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

// eslint-disable-next-line arrow-body-style
export const mountJsonFormsComponent = (component, propsData, showAdvanced) => {
    return mountJsonFormsComponentWithStore(component, propsData, null, showAdvanced);
};

const hasBasicProps = (props) => {
    expect(props.hasOwnProperty('schema')).toBe(true);
    expect(props.hasOwnProperty('uischema')).toBe(true);
    expect(props.hasOwnProperty('path')).toBe(true);
};

export const initializesJsonFormsControl = (wrapper) => {
    const props = wrapper.props();
    hasBasicProps(props);
    expect(props.hasOwnProperty('control')).toBe(true);
    expect(props.control.schema).toBeDefined();
    expect(props.control.uischema).toBeDefined();
    expect(useJsonFormsControl).toHaveBeenCalled();
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
