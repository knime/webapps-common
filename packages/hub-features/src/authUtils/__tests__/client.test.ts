import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { navigateToLogin, navigateToLogout } from "../client";
import { buildLoginPath, buildLogoutPath } from "../shared";

describe("client-side auth utils", () => {
  const originalWindowLocation = window.location;
  const wdywtg = "current/page";

  beforeEach(() => {
    delete (global.window as any).location;
    global.window = Object.create(window);
    (global.window as any).location = {
      href: "http://dummy.com",
      toString: () => {
        return global.window.location.href;
      },
    };
  });

  afterEach(() => {
    // @ts-expect-error
    global.window.location = originalWindowLocation;
  });

  it("assigns path to window.location", () => {
    const path = buildLoginPath({ wdywtg });
    navigateToLogin({ wdywtg });
    expect(window.location.href).toEqual(path);
  });

  it("assigns logout path to window.location", () => {
    const path = buildLogoutPath({ wdywtg });
    navigateToLogout({ wdywtg });
    expect(window.location.href).toEqual(path);
  });
});
