import { ExtensionConfig } from "../index-0a8c878e";
interface KnimeIFrameAdapterOptions {
    childIframe: Window;
    extensionConfig: ExtensionConfig;
}
declare class KnimeIFrameAdapter {
    childIframe: Window;
    extensionConfig: ExtensionConfig;
    constructor({ childIframe, extensionConfig }: KnimeIFrameAdapterOptions);
    onMessageFromIFrame(event: any): void;
    destroy(): void;
}
export { KnimeIFrameAdapter };
