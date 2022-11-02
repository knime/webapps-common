// TODO verify it works & add tests for loadAsyncComponent
import { loadComponentLibrary } from '~/ui/util/loadComponentLibrary';

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

describe('loadComponentLibrary', () => {
    afterEach(() => {
        window[mockComponentId] = null;
        jest.clearAllMocks();
        mockVueInstance.clearAllRegistered();
    });

    it('Resolves when the component is added to the window object', async () => {
        jest
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
        jest
            .spyOn(HTMLScriptElement.prototype, 'addEventListener')
            .mockImplementation((event, handler) => {
                if (event === 'load') {
                    window[mockComponentId] = mockComponent;
                    handler();
                }
            });

        const onLoad = jest.fn();
        
        await loadComponentLibrary({
            window,
            vueInstance: mockVueInstance,
            resourceLocation: mockResourceLocation,
            componentName: mockComponentId,
            onLoad
        });
        
        expect(onLoad).toHaveBeenCalledWith({ component: mockComponent });
    });

    it('Throws if component is not added to window', async () => {
        jest
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

    it('Throws if script load fails', async () => {
        jest
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
