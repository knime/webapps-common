import type { VueWrapper } from "@vue/test-utils";
type IntersectionObserverMockType = {
    (callback: (...args: any[]) => any): any;
    __trigger__: (isIntersecting: boolean) => void;
};
export declare const MockIntersectionObserver: IntersectionObserverMockType;
export declare const createSlottedChildComponent: (params: {
    slottedComponentTemplate: string;
    slottedComponentData?: any;
}) => {
    getSlottedChildComponent: (wrapper: VueWrapper<any>) => VueWrapper<any, any>;
    mockComponentInSlot: {
        name: string;
        template: string;
        props: {
            scope: {
                type: ObjectConstructor;
                required: boolean;
            };
        };
        data(): any;
    };
    getSlottedStubProp: ({ wrapper, propName, }: {
        wrapper: VueWrapper<any>;
        propName: string;
    }) => any;
    renderSlot: (props: any) => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>;
};
export {};
