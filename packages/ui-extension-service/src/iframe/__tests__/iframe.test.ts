import { afterEach, describe, expect, it, vi } from "vitest";

import {
  type UIExtensionPushEvents,
  type UIExtensionService,
} from "@knime/ui-extension-renderer/api";
import { setUpIframeEmbedderService } from "@knime/ui-extension-renderer/testing";

import { getInitializedBaseServiceProxy } from "../../services/AbstractService";

class Embedder<APILayer extends { getConfig: () => unknown }> {
  iframe: HTMLIFrameElement;
  dispatchPushEvent: (event: UIExtensionPushEvents.PushEvent<any>) => void;

  constructor(apiLayer: APILayer) {
    // @ts-expect-error Property 'getInitializedBaseService' does not exist on type 'Window & typeof globalThis'
    window.getInitializedBaseService = getInitializedBaseServiceProxy;
    const iframe = document.createElement("iframe");
    document.body.appendChild(iframe);

    // @ts-expect-error the parent window of the HTMLIFrameElement is not properly loaded/attached so we explicitly need to set it
    iframe.contentWindow.parent = window;
    const { dispatchPushEvent } = setUpIframeEmbedderService(
      apiLayer as any,
      iframe.contentWindow!,
    );
    this.dispatchPushEvent = dispatchPushEvent;
    this.iframe = iframe;
    // Tests fail without this wrapper, since event.source is null in this constructed test setup.
    window.postMessage = (
      message: any,
      targetOrigin: string | WindowPostMessageOptions | undefined,
    ) => {
      expect(targetOrigin).toBe("*");
      const event = new MessageEvent("message", {
        data: message,
        source: iframe.contentWindow,
      });
      window.dispatchEvent(event);
    };
  }

  injectScript(
    injectedScript: (param: { service: UIExtensionService<APILayer> }) => void,
  ) {
    const stringLines = injectedScript.toString().split("\n");
    if (!stringLines[0].trim().startsWith("({ service })")) {
      throw Error(
        `injected script "${stringLines[0].trim()}..." needs to make use of the "service" parameter`,
      );
    }
    stringLines.shift();
    stringLines.pop();
    const injectedScriptBodyText = stringLines.join("\n");
    this.iframe.contentDocument!.open();
    this.iframe.contentDocument!.write(`<!doctype html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>IFrame test content</title>
      </head>
      <body>
        <div id="iframe-content"></div>
        <script>
          window.parent.getInitializedBaseService(window).then(({serviceProxy: service}) => {
            ${injectedScriptBodyText}
          });
        </script>
      </body>
    </html>
    `);
    this.iframe.contentDocument!.close();
  }

  cleanUp() {
    document.body.removeChild(this.iframe);
  }
}

describe("iframe UIExtension embedding", () => {
  let toBeCleanedUp: Embedder<any>;

  afterEach(() => {
    toBeCleanedUp.cleanUp();
  });

  it("enables proxying method calls to parent window and back", () => {
    const expectedResult = "myResult";
    const myMethod: (param: string) => Promise<string> = vi.fn(() =>
      Promise.resolve(expectedResult),
    );
    const embedder = new Embedder({ myMethod, getConfig: () => ({}) });
    toBeCleanedUp = embedder;
    return new Promise<void>((resolve) => {
      window.addEventListener("message", (event: MessageEvent) => {
        if (event.data.type !== "myMethodResult") {
          return;
        }
        expect(myMethod).toHaveBeenCalledWith("foo");
        expect(event.data.result).toBe(expectedResult);
        resolve();
      });
      embedder.injectScript(({ service }) => {
        service
          .myMethod("foo")
          .then((result) =>
            window.parent.postMessage({ type: "myMethodResult", result }, "*"),
          );
      });
    });
  });

  it("enables adding push event listeners", () => {
    const embedder = new Embedder({ getConfig: () => ({}) });
    toBeCleanedUp = embedder;
    const payload = "myPayload";
    return new Promise<void>((resolve) => {
      window.addEventListener("message", (event: MessageEvent) => {
        if (event.data === "ready") {
          embedder.dispatchPushEvent({ eventType: "my-push-event", payload });
        }
        if (event.data.type !== "pushEventListenerCalled") {
          return;
        }
        expect(event.data.payload).toStrictEqual(payload);
        resolve();
      });
      embedder.injectScript(({ service }) => {
        service.addPushEventListener("my-push-event", (payload) =>
          window.parent.postMessage(
            { type: "pushEventListenerCalled", payload },
            "*",
          ),
        );
        window.parent.postMessage("ready", "*");
      });
    });
  });

  it("initially loads the extensionConfig to have it availably synchronously later", () => {
    const extensionConfig = { nodeId: "123" };
    const embedder = new Embedder({ getConfig: () => extensionConfig });
    toBeCleanedUp = embedder;
    return new Promise<void>((resolve) => {
      window.addEventListener("message", (event: MessageEvent) => {
        if (event.data.type !== "extensionConfigEvent") {
          return;
        }
        expect(event.data.extensionConfig).toStrictEqual(extensionConfig);
        resolve();
      });
      embedder.injectScript(({ service }) => {
        const extensionConfig = service.getConfig();
        window.parent.postMessage(
          { type: "extensionConfigEvent", extensionConfig },
          "*",
        );
      });
    });
  });
});
