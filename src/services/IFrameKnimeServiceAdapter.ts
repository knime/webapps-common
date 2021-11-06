import { UI_EXT_POST_MESSAGE_PREFIX } from 'src/constants';
import { ExtensionConfig } from 'src/types';

interface IFrameKnimeServiceAdapterOptions {
    childIframe: Window;
    extensionConfig: ExtensionConfig;
}

export class IFrameKnimeServiceAdapter {
    childIframe: Window;

    extensionConfig: ExtensionConfig;

    constructor({ childIframe, extensionConfig }: IFrameKnimeServiceAdapterOptions) {
        this.childIframe = childIframe;
        this.extensionConfig = extensionConfig;

        window.addEventListener('message', this.onMessageFromIFrame.bind(this));
    }

    onMessageFromIFrame(event) {
        if (event.source !== this.childIframe) {
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
                    const { request } = event.data;
                    const response = window.jsonrpc(request); // TODO this won't work in WebPortal
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
        window.removeEventListener('message', this.onMessageFromIFrame);
    }
}
