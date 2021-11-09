import { UI_EXT_POST_MESSAGE_PREFIX } from 'src/constants';
import { ExtensionConfig } from 'src/types';

interface IFrameKnimeServiceAdapterOptions {
    childIframe: Window;
    extensionConfig: ExtensionConfig;
}

export class IFrameKnimeServiceAdapter {
    childIframe: Window;

    extensionConfig: ExtensionConfig;

    boundOnMessageFromIFrame: any;

    constructor({ childIframe, extensionConfig }: IFrameKnimeServiceAdapterOptions) {
        this.childIframe = childIframe;
        this.extensionConfig = extensionConfig;

        this.boundOnMessageFromIFrame = this.onMessageFromIFrame.bind(this);
        window.addEventListener('message', this.boundOnMessageFromIFrame);
    }

    checkMessageSource(event) {
        return event.source !== this.childIframe;
    }

    onMessageFromIFrame(event) {
        if (this.checkMessageSource(event)) {
            return;
        }
        const { data } = event;

        // TODO: fix global rule for switches?
        /* eslint indent: [2, 4, {"SwitchCase": 1}] */
        switch (data.type) {
            case `${UI_EXT_POST_MESSAGE_PREFIX}:ready`:
                this.childIframe.postMessage(
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
                    const response = window.jsonrpc(payload); // TODO this won't work in WebPortal
                    this.childIframe.postMessage(
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
