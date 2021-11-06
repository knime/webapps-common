import { UI_EXT_POST_MESSAGE_PREFIX } from '../constants/index.js';

class IFrameKnimeServiceAdapter {
    constructor({ childIframe, extensionConfig }) {
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
                this.childIframe.postMessage({
                    type: `${UI_EXT_POST_MESSAGE_PREFIX}:init`,
                    payload: this.extensionConfig,
                }, '*');
                break;
            case `${UI_EXT_POST_MESSAGE_PREFIX}:jsonrpcRequest`:
                {
                    const { request } = event.data;
                    const response = window.jsonrpc(request); // TODO this won't work in WebPortal
                    this.childIframe.postMessage({
                        type: `${UI_EXT_POST_MESSAGE_PREFIX}:jsonrpcResponse`,
                        payload: response,
                    }, '*');
                }
                break;
        }
    }
    destroy() {
        window.removeEventListener('message', this.onMessageFromIFrame);
    }
}

export { IFrameKnimeServiceAdapter };
