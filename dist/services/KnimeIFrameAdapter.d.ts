import { ExtensionConfig } from "../index-efc413bb";
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
