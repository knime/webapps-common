import { describe, expect, it, vi } from "vitest";

import { type UIExtensionService } from "@knime/ui-extension-renderer/api";
import { setUpIframeEmbedderService } from "@knime/ui-extension-renderer/testing";

import { getInitializedBaseServiceProxy } from "../../services/AbstractService";

type Configurable = { getConfig: () => unknown };
type APILayer<T = any> = T & Configurable;

type InjectedScript<T> = (param: {
  service: UIExtensionService<APILayer<T>>;
}) => void;

async function setupEmbedder<T>(apiLayer: APILayer<T>) {
  const iframe = document.createElement("iframe");
  document.body.appendChild(iframe);
  // @ts-expect-error the parent window of the HTMLIFrameElement is not properly loaded/attached so we explicitly need to set it
  iframe.contentWindow.parent = window;

  // @ts-expect-error Property 'getInitializedBaseService' does not exist on type 'Window & typeof globalThis'
  window.getInitializedBaseService = getInitializedBaseServiceProxy;

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

  const { dispatchPushEvent } = await (() => {
    const promise = setUpIframeEmbedderService(
      apiLayer as any,
      iframe.contentWindow!,
    );

    window.postMessage({ type: "UIExtensionReady" }, "*");

    return promise;
  })();

  const cleanUp = () => document.body.removeChild(iframe);

  const injectScript = (injectedScript: InjectedScript<T>) => {
    const stringLines = injectedScript.toString().split("\n");
    if (!stringLines[0].trim().startsWith("({ service })")) {
      throw Error(
        `injected script "${stringLines[0].trim()}..." needs to make use of the "service" parameter`,
      );
    }
    stringLines.shift();
    stringLines.pop();
    const injectedScriptBodyText = stringLines.join("\n");
    iframe.contentDocument!.open();
    iframe.contentDocument!.write(`<!doctype html>
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
    iframe.contentDocument!.close();
  };

  return {
    iframe,
    dispatchPushEvent,
    injectScript,
    cleanUp,
  };
}

describe("iframe UIExtension embedding", () => {
  it("enables proxying method calls to parent window and back", async () => {
    const expectedResult = "myResult";
    const myMethod: (param: string) => Promise<string> = vi.fn(() =>
      Promise.resolve(expectedResult),
    );

    const { injectScript, cleanUp } = await setupEmbedder({
      myMethod,
      getConfig: () => ({}),
    });

    return new Promise<void>((resolve) => {
      window.addEventListener("message", (event: MessageEvent) => {
        if (event.data.type !== "myMethodResult") {
          return;
        }
        expect(myMethod).toHaveBeenCalledWith("foo");
        expect(event.data.result).toBe(expectedResult);
        resolve();
        cleanUp();
      });

      injectScript(({ service }) => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        service
          .myMethod("foo")
          .then((result) =>
            window.parent.postMessage({ type: "myMethodResult", result }, "*"),
          );
      });
    });
  });

  it("enables adding push event listeners", async () => {
    const { injectScript, cleanUp, dispatchPushEvent } = await setupEmbedder({
      getConfig: () => ({}),
    });

    const payload = "myPayload";
    return new Promise<void>((resolve) => {
      window.addEventListener("message", (event: MessageEvent) => {
        if (event.data.type === "UIExtensionReady") {
          dispatchPushEvent({ eventType: "my-push-event", payload });
        }
        if (event.data.type !== "pushEventListenerCalled") {
          return;
        }
        expect(event.data.payload).toStrictEqual(payload);
        resolve();
        cleanUp();
      });

      injectScript(({ service }) => {
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

  it("initially loads the extensionConfig to have it availably synchronously later", async () => {
    const extensionConfig = { nodeId: "123" };

    const { injectScript, cleanUp } = await setupEmbedder({
      getConfig: () => extensionConfig,
    });

    return new Promise<void>((resolve) => {
      window.addEventListener("message", (event: MessageEvent) => {
        if (event.data.type !== "extensionConfigEvent") {
          return;
        }
        expect(event.data.extensionConfig).toStrictEqual(extensionConfig);
        resolve();
        cleanUp();
      });

      injectScript(({ service }) => {
        const extensionConfig = service.getConfig();
        window.parent.postMessage(
          { type: "extensionConfigEvent", extensionConfig },
          "*",
        );
      });
    });
  });
});
