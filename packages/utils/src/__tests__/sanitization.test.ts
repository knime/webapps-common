import { describe, expect, it } from "vitest";

import { sanitization } from "../sanitization";

describe("sanitization", () => {
  const input1 = "<h1>Hello world &nbsp;</h1>";
  const input2 = "<div><span>hi</span><img src='http://example.com' /></div>";
  const input3 = '<div style="color: red">FooBar</div>';
  const input4 = '<a href="https://example.com">Link</a>';

  it("sanitizeHTML", () => {
    expect(sanitization.sanitizeHTML(input1)).toBe(
      "<h1>Hello world &nbsp;</h1>",
    );
    expect(sanitization.sanitizeHTML(input2)).toBe(
      "<div><span>hi</span></div>",
    );

    expect(
      sanitization.sanitizeHTML(input3, { allowStyleAttribute: true }),
    ).toBe('<div style="color: red">FooBar</div>');
    expect(sanitization.sanitizeHTML(input3)).toBe("<div>FooBar</div>");

    expect(sanitization.sanitizeHTML(input4, { allowHyperlinks: true })).toBe(
      '<a href="https://example.com">Link</a>',
    );
    expect(sanitization.sanitizeHTML(input4)).toBe("Link");
  });

  it("stripHTML", () => {
    expect(sanitization.stripHTML(input1)).toBe("Hello world &nbsp;");
    expect(sanitization.stripHTML(input2)).toBe("hi");
  });
});
