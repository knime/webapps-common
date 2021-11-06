import { ExtensionConfig } from "../index-0a8c878e";
interface IFrameKnimeServiceAdapterOptions {
    childIframe: Window;
    extensionConfig: ExtensionConfig;
}
declare class IFrameKnimeServiceAdapter {
    childIframe: Window;
    extensionConfig: ExtensionConfig;
    constructor({ childIframe, extensionConfig }: IFrameKnimeServiceAdapterOptions);
    onMessageFromIFrame(event: any): void;
    destroy(): void;
}
export { IFrameKnimeServiceAdapter };
