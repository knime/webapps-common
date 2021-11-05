import { UI_EXT_POST_MESSAGE_PREFIX } from '../constants/index.js';

class KnimeIFrameAdapter {
    constructor({ childIframe, extensionConfig }) {
        this.childIframe = childIframe;
        this.extensionConfig = extensionConfig;
        window.addEventListener('message', this.onMessageFromIFrame.bind(this));
    }
    onMessageFromIFrame(event) {
        if (event.source !== this.childIframe) {
            return;
        }
        if (event.data.type === `${UI_EXT_POST_MESSAGE_PREFIX}:ready`) {
            this.childIframe.postMessage({
                type: `${UI_EXT_POST_MESSAGE_PREFIX}:init`,
                payload: this.extensionConfig
            }, '*'); // TODO security
        }
        else if (event.data.type === `${UI_EXT_POST_MESSAGE_PREFIX}:jsonrpcRequest`) {
            const { request } = event.data;
            const response = window.jsonrpc(request); // TODO this won't work in WebPortal
            this.childIframe.postMessage({
                type: `${UI_EXT_POST_MESSAGE_PREFIX}:jsonrpcResponse`,
                payload: response
            }, '*'); // TODO security
        }
    }
    destroy() {
        window.removeEventListener('message', this.onMessageFromIFrame);
    }
}

export { KnimeIFrameAdapter };
