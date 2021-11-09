import { UI_EXT_POST_MESSAGE_PREFIX } from 'src/constants';
import { ExtensionConfig } from 'src/types';

interface IFrameKnimeServiceAdapterOptions {
    iFrameWindow: Window;
    extensionConfig: ExtensionConfig;
}

export class IFrameKnimeServiceAdapter {
    iFrameWindow: Window;

    extensionConfig: ExtensionConfig;

    boundOnMessageFromIFrame: any;

    constructor({ iFrameWindow, extensionConfig }: IFrameKnimeServiceAdapterOptions) {
        this.iFrameWindow = iFrameWindow;
        this.extensionConfig = extensionConfig;

        this.boundOnMessageFromIFrame = this.onMessageFromIFrame.bind(this);
        window.addEventListener('message', this.boundOnMessageFromIFrame);
    }

    checkMessageSource(event: MessageEvent) {
        return event.source !== this.iFrameWindow;
    }

    onMessageFromIFrame(event: MessageEvent) {
        if (this.checkMessageSource(event)) {
            return;
        }
        const { data } = event;

        // TODO: fix global rule for switches?
        /* eslint indent: [2, 4, {"SwitchCase": 1}] */
        switch (data.type) {
            case `${UI_EXT_POST_MESSAGE_PREFIX}:ready`:
                this.iFrameWindow.postMessage(
                    {
                        type: `${UI_EXT_POST_MESSAGE_PREFIX}:init`,
                        payload: this.extensionConfig,
                    },
                    '*',
                );
                break;
            case `${UI_EXT_POST_MESSAGE_PREFIX}:jsonrpcRequest`:
                {
                    const { payload } = event.data;
                    // TODO: NXT-732 this won't work in WebPortal
                    const response = window.jsonrpc(JSON.stringify(payload));
                    this.iFrameWindow.postMessage(
                        {
                            type: `${UI_EXT_POST_MESSAGE_PREFIX}:jsonrpcResponse`,
                            payload: response,
                        },
                        '*',
                    );
                }
                break;

            default:
                break;
        }
    }

    destroy() {
        window.removeEventListener('message', this.boundOnMessageFromIFrame);
    }
}
