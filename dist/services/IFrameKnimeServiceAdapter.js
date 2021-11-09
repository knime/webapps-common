import { UI_EXT_POST_MESSAGE_PREFIX } from '../constants/index.js';

class IFrameKnimeServiceAdapter {
    constructor({ iFrameWindow, extensionConfig }) {
        this.iFrameWindow = iFrameWindow;
        this.extensionConfig = extensionConfig;
        this.boundOnMessageFromIFrame = this.onMessageFromIFrame.bind(this);
        window.addEventListener('message', this.boundOnMessageFromIFrame);
    }
    checkMessageSource(event) {
        return event.source !== this.iFrameWindow;
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
                this.iFrameWindow.postMessage({
                    type: `${UI_EXT_POST_MESSAGE_PREFIX}:init`,
                    payload: this.extensionConfig,
                }, '*');
                break;
            case `${UI_EXT_POST_MESSAGE_PREFIX}:jsonrpcRequest`:
                {
                    const { payload } = event.data;
                    // TODO: NXT-732 this won't work in WebPortal
                    const response = window.jsonrpc(JSON.stringify(payload));
                    this.iFrameWindow.postMessage({
                        type: `${UI_EXT_POST_MESSAGE_PREFIX}:jsonrpcResponse`,
                        payload: response,
                    }, '*');
                }
                break;
        }
    }
    destroy() {
        window.removeEventListener('message', this.boundOnMessageFromIFrame);
    }
}

export { IFrameKnimeServiceAdapter };
