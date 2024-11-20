import { beforeAll, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";

import CodeRenderer, { type CodeRendererProps } from "../CodeRenderer.vue";

describe("CodeRenderer.vue", () => {
  const props: CodeRendererProps = { content: "", language: "json" };

  beforeAll(() => {
    Object.defineProperty(document, "fonts", {
      value: { load: vi.fn() },
    });
  });

  it("renders the json file format", () => {
    props.content = '{\n  "key": "<button>Click</Button>"\n}';
    props.language = "json";
    const wrapper = mount(CodeRenderer, { props });
    expect(wrapper.findComponent(CodeRenderer).find("code").html()).toContain(
      '<span class="hljs-punctuation">{</span>' +
        '\n  <span class="hljs-attr">"key"</span><span class="hljs-punctuation">:</span>' +
        ' <span class="hljs-string">"&lt;button&gt;Click&lt;/Button&gt;"</span>' +
        '\n<span class="hljs-punctuation">}</span>',
    );
  });

  it("renders the xml file format", () => {
    props.content = "<note>\n  <to>User</to>\n  <from>Admin</from>\n</note>";
    props.language = "xml";
    const wrapper = mount(CodeRenderer, { props });
    expect(wrapper.findComponent(CodeRenderer).find("code").html()).toContain(
      '<span class="hljs-tag">&lt;<span class="hljs-name">note</span>&gt;</span>' +
        '\n  <span class="hljs-tag">&lt;<span class="hljs-name">to</span>&gt;</span>' +
        'User<span class="hljs-tag">&lt;/<span class="hljs-name">to</span>&gt;</span>' +
        '\n  <span class="hljs-tag">&lt;<span class="hljs-name">from</span>&gt;</span>' +
        'Admin<span class="hljs-tag">&lt;/<span class="hljs-name">from</span>&gt;</span>' +
        '\n<span class="hljs-tag">&lt;/<span class="hljs-name">note</span>&gt;</span>',
    );
  });
});
