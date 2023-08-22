require('consola');
import { vi } from 'vitest';

import * as Vue from 'vue';
window.Vue = Vue;

window.alert = vi.fn();

vi.mock('@knime/ui-extension-service');
vi.mock('@jsonforms/vue', async () => {
    const original = await vi.importActual('@jsonforms/vue');
    return {
        ...original,
        rendererProps: vi.fn().mockReturnValue({
            control: null,
            schema: {},
            uischema: {},
            layout: null,
            path: ''
        }),
        useJsonFormsControl: vi.fn(() => ({
            handleChange: vi.fn()
        })),
        useJsonFormsLayout: vi.fn(),
        useJsonFormsArrayControl: vi.fn(() => ({
            addItem: vi.fn(() => vi.fn()),
            moveUp: vi.fn(() => vi.fn()),
            moveDown: vi.fn(() => vi.fn()),
            removeItems: vi.fn(() => vi.fn())
        }))
    };
}, { virtual: false });
vi.mock('@jsonforms/core', async () => {
    const original = await vi.importActual('@jsonforms/core');
    return {
        ...original,
        createDefaultValue: vi.fn(),
        composePaths: vi.fn((a, b) => `composedPath(${a}, ${b})`)
    };
}, { virtual: false });
