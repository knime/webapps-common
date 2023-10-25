<script>
import { h } from "vue";
import Prism from "prismjs";

export default {
  props: {
    summary: {
      type: String,
      default: "Code example",
    },
    language: {
      type: String,
      default: "html",
    },
  },

  render() {
    const slotsData =
      (this.$slots && this.$slots.default && this.$slots.default()) || [];
    const code = slotsData.length > 0 ? slotsData[0].children : "";
    const prismLanguage = Prism.languages[this.language];
    const className = `language-${this.language}`;

    const prismOutput = Prism.highlight(code, prismLanguage);

    /**
     * HTML:
     * <details>
     *  <summary></summary>
     *  <pre><code>{{ PrismOutput }}</code></pre>
     * </details>
     */
    const summaryEl = h("summary", this.summary);
    const preEl = h(
      "pre",
      { ...this.$attrs, class: [this.$attrs.class, className] },
      [h("code", { class: className, innerHTML: prismOutput })],
    );
    return h("details", [summaryEl, preEl]);
  },
};
</script>

<style lang="postcss" scoped>
details {
  margin: 0.5em 0 1em;
}

summary {
  outline: none !important;
  font-weight: 500;
  cursor: pointer;
}
</style>
