import { ExtensionConfig } from "../index-af6571f7";
interface IFrameKnimeServiceAdapterOptions {
    iFrameWindow: Window;
    extensionConfig: ExtensionConfig;
}
declare class IFrameKnimeServiceAdapter {
    iFrameWindow: Window;
    extensionConfig: ExtensionConfig;
    boundOnMessageFromIFrame: any;
    constructor({ iFrameWindow, extensionConfig }: IFrameKnimeServiceAdapterOptions);
    checkMessageSource(event: MessageEvent): boolean;
    onMessageFromIFrame(event: MessageEvent): void;
    destroy(): void;
}
export { IFrameKnimeServiceAdapter };
