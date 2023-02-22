import { describe, it, expect, afterEach, vi } from 'vitest';

// TODO verify it works & add tests for loadAsyncComponent
import { loadComponentLibrary } from '../loadComponentLibrary';

const mockComponentId = 'mock-component';
const mockComponent = { template: '<div/>' };
const mockResourceLocation = 'http://example.com/';

const getMockVueInstance = () => {
    const registeredComponents = new Map();
    return {
        component: (componentName, component) => {
            if (componentName && !component) {
                return registeredComponents.has(componentName);
            }

            if (componentName && component) {
                registeredComponents.set(componentName, component);
                return component;
            }

            return null;
        },
        clearAllRegistered: () => {
            registeredComponents.clear();
        }
    };
};

const mockVueInstance = getMockVueInstance();

describe.skip('loadComponentLibrary', () => {
    afterEach(() => {
        window[mockComponentId] = null;
        vi.clearAllMocks();
        mockVueInstance.clearAllRegistered();
    });

    it('resolves when the component is added to the window object', async () => {
        vi
            .spyOn(HTMLScriptElement.prototype, 'addEventListener')
            .mockImplementation((event, handler) => {
                if (event === 'load') {
                    window[mockComponentId] = mockComponent;
                    handler();
                }
            });
        
        await loadComponentLibrary({
            window,
            vueInstance: mockVueInstance,
            resourceLocation: mockResourceLocation,
            componentName: mockComponentId
        });
        
        const scriptEl = window.document.head.querySelector('script');
        expect(scriptEl).not.toBeNull();
        expect(scriptEl.async).toBe(true);
        expect(scriptEl.src).toBe(mockResourceLocation);
    });

    it('should call onLoad callback', async () => {
        vi
            .spyOn(HTMLScriptElement.prototype, 'addEventListener')
            .mockImplementation((event, handler) => {
                if (event === 'load') {
                    window[mockComponentId] = mockComponent;
                    handler();
                }
            });

        const onLoad = vi.fn();
        
        await loadComponentLibrary({
            window,
            vueInstance: mockVueInstance,
            resourceLocation: mockResourceLocation,
            componentName: mockComponentId,
            onLoad
        });
        
        expect(onLoad).toHaveBeenCalledWith({ component: mockComponent });
    });

    it('throws if component is not added to window', async () => {
        vi
            .spyOn(HTMLScriptElement.prototype, 'addEventListener')
            .mockImplementation((event, handler) => {
                if (event === 'load') {
                    handler();
                }
            });
        
        await expect(
            loadComponentLibrary({
                window,
                vueInstance: mockVueInstance,
                resourceLocation: mockResourceLocation,
                componentName: mockComponentId
            })
        )
            .rejects
            .toThrow(`Component "${mockComponentId}" loading failed. Script invalid.`);
    });

    it('throws if script load fails', async () => {
        vi
            .spyOn(HTMLScriptElement.prototype, 'addEventListener')
            .mockImplementation((event, handler) => {
                if (event === 'error') {
                    handler();
                }
            });
        
        await expect(loadComponentLibrary({
            window,
            vueInstance: mockVueInstance,
            resourceLocation: mockResourceLocation,
            componentName: mockComponentId
        }))
            .rejects
            .toThrow(`Script loading of "${mockResourceLocation}" failed`);
    });
});
