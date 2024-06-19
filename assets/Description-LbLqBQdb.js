import{C as x}from"./CodeExample-Ny8umjhX.js";import{_ as v,D as f,r as s,o as g,c as b,b as e,d as i,w as r,e as t,t as p,p as k,f as _}from"./index-Plvkd8dc.js";import{C as w}from"./Checkbox-rYacmRVE.js";const y=`<script>
export default {
  props: {
    /**
     * the text to be shown
     */
    text: {
      type: String,
      default: null,
    },
    /**
     * whether the provided \`text\` should be rendered as HTML or plain text
     */
    renderAsHtml: {
      type: Boolean,
      default: false,
    },
    useRichTextEditorStyles: {
      type: Boolean,
      default: false,
    },
  },
};
<\/script>

<template>
  <div v-if="$slots.default" class="description">
    <!-- @slot if content is provided via slot, the \`text\` and \`renderAsHtml\` props will be ignored -->
    <slot />
  </div>
  <!-- eslint-disable vue/no-v-html -->
  <div
    v-else-if="!$slots.default && renderAsHtml"
    v-bind="{ ...$attrs }"
    :class="{
      'html-description': useRichTextEditorStyles,
      description: !useRichTextEditorStyles,
    }"
    v-html="text"
  />
  <div v-else class="description plain" v-text="text" />
</template>

<style lang="postcss" scoped>
@import url("./forms/RichTextEditor/styles.css");

.description {
  font-size: 18px;
  line-height: 26px;
  overflow-wrap: anywhere;
  word-break: break-word; /* Safari needs this */

  /* stylelint-disable max-line-length */

  /*
    possible markup in Node description: a,b,br,h3,h4,hr,i,li,ol,p,pre,sub,sup,table,td,th,tr,tt,u,ul
    see https://bitbucket.org/KNIME/knime-core/src/3207ad3e20e242550d4c775e1af6d69cd521d9fd/org.knime.core/src/eclipse/org/knime/core/node/Node_v3.6.xsd#lines-334
    possible markup in Port description: a,b,br,hr,i,ol,p,pre,sub,sup,tt,u,ul
    see https://bitbucket.org/KNIME/knime-core/src/3207ad3e20e242550d4c775e1af6d69cd521d9fd/org.knime.core/src/eclipse/org/knime/core/node/Node_v3.6.xsd#lines-316
  */

  /* stylelint-enable max-line-length */
  & :deep(p) {
    margin: 0 0 20px;
  }

  & :deep(a) {
    color: var(--theme-text-link-foreground-color);
    background: var(--theme-text-link-background-color);

    @supports (mask: url("") no-repeat 50% 50%) {
      &[href^="http"]::after {
        content: "";
        mask: url("../assets/img/icons/link-external.svg?data") no-repeat 50%
          50%;
        mask-size: cover;
        background-color: var(--knime-masala); /* defines icon color */
        width: 16px;
        height: 16px;
        display: inline-block;
        margin-left: 4px;
        vertical-align: -2px;
      }
    }

    &:hover {
      outline: none;
      color: var(--theme-text-link-foreground-color-hover);
      background-color: var(--theme-text-link-background-color-hover);
      text-decoration: none;

      &::after {
        background-color: var(
          --theme-text-link-foreground-color-hover
        ); /* defines icon color */
      }
    }

    &:focus,
    &:active {
      outline: none;
      color: var(--theme-text-link-foreground-color-focus);
      background-color: var(--theme-text-link-background-color-focus);
      text-decoration: none;

      &::after {
        background-color: var(
          --theme-text-link-foreground-color-focus
        ); /* defines icon color */
      }
    }
  }

  & :deep(pre),
  & :deep(code), /* in case it will be used in the future since <tt> is deprecated */
  & :deep(tt) {
    background-color: var(--knime-white);
    border: 1px solid var(--knime-silver-sand);
    padding: 0 5px;
    font-size: 17px;
  }

  & :deep(pre) {
    padding: 3px 8px;
    white-space: pre-wrap;
    overflow: hidden; /* for nicer floating around node icon */
  }

  & :deep(hr) {
    border: 0;
    border-top: 1px solid var(--knime-silver-sand);
  }

  & :deep(ul),
  & :deep(ol) {
    overflow: hidden; /* for nicer floating around node icon */
  }

  & :deep(table) {
    border-spacing: 15px 0;
    width: calc(100% + 2 * 15px);
    text-align: left;
    margin: 20px 0;
    position: relative;
    left: -15px;

    & th {
      font-weight: 500;
      font-family: var(--theme-text-medium-font-family);
      color: var(--theme-text-medium-color);
      border-bottom: solid 2px var(--knime-masala);
    }

    & th,
    & td {
      padding: 4px 8px;
    }

    & td {
      border-bottom: solid 1px var(--knime-masala);
    }

    & colgroup {
      font-size: 16px;
      font-weight: 700;
      border-bottom: solid 3px var(--knime-masala);
    }
  }

  & :deep(dt),
  & :deep(b) {
    font-weight: bold;
  }

  & :deep(dd) {
    margin-left: 15px;
  }
}

.plain {
  white-space: pre-line;
}

/* use rich text editor styles for rendering html descriptions */
.html-description {
  line-height: 26px;
  overflow-wrap: anywhere;
  word-break: break-word; /* Safari needs this */

  &:deep() {
    @mixin rich-text-editor-base;
    @mixin rich-text-editor-hr;
    @mixin rich-text-editor-p;
    @mixin rich-text-editor-blockquote;
    @mixin rich-text-editor-code;
    @mixin rich-text-editor-lists;
    @mixin rich-text-editor-links;

    font-size: var(--description-font-size, 18px);
  }
}
</style>
`,S={components:{Description:f,CodeExample:x,Checkbox:w},data(){return{codeExample:`<Description>Text with <b>HTML code</b> via slot.</Description>

<Description :text="htmlString" renderAsHtml />`,descriptionWithHtmlText:`<h4>This is a description without a slot, rendering an html string</h4>
      <p>It can be configured to use the same styles as the RichTextEditor component using the checkbox below<br>
        <hr>
        <strong>strong</strong> <br>
        <i>italics</i> <br>
        <ul><li>one</li><li>two</li></ul>
        <pre><code>this is a code block</code></pre>
        <a href="www.knime.com">This is a link</a>
      </p><br>`,useRichTextEditorStyles:!1}},computed:{code(){return y}}},n=l=>(k("data-v-d6873612"),l=l(),_(),l),E=n(()=>e("section",null,[e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null," The Description component provides styling for rich-text markup (see component code for details)… ")])])],-1)),T={class:"demo"},C={class:"grid-container"},R=n(()=>e("h5",null,"Links",-1)),D=n(()=>e("p",null,[e("a",{href:"/"},"Internal link"),t(" or "),e("a",{href:"https://www.knime.com/"},"External link")],-1)),N=n(()=>e("h5",null,"Lists",-1)),z=n(()=>e("ol",null,[e("li",null,"Aggregation method (count, summary, average)"),e("li",null,"Pie size"),e("li",null,"Show missing value section"),e("li",null,"Show pie section outline")],-1)),I=n(()=>e("ul",null,[e("li",null,[e("b",null,"Replace outlier values:"),t(' Allows to replace outliers based on the selected "Replacement strategy" ')]),e("li",null,[e("b",null,"Remove outlier rows:"),t(" Removes all rows from the input data that contain in any of the selected columns at least one outlier ")]),e("li",null,[e("b",null,"Remove non-outlier rows:"),t(" Retains only those rows of the input data that contain at least one outlier in any of the selected columns ")])],-1)),H=n(()=>e("h5",null,"Table",-1)),M=n(()=>e("table",null,[e("tbody",null,[e("tr",null,[e("th",null,"level0"),e("th",null,"level1"),e("th",null,"level2"),e("th",null,"value")]),e("tr",null,[e("td",null,"Carnivora"),e("td",null,"Felidae"),e("td",null,"Panthera"),e("td",null,"10")]),e("tr",null,[e("td",null,"Carnivora"),e("td",null,"Mustelidae"),e("td",null,"Mephitis"),e("td",null,"6")]),e("tr",null,[e("td",null,"Carnivora"),e("td",null,"Mustelidae"),e("td",null,"Lutra"),e("td",null,"7")]),e("tr",null,[e("td",null,"Carnivora"),e("td",null,"Canidae"),e("td",null,"?"),e("td",null,"14")])])],-1)),V=n(()=>e("h5",null,"Code & Pre",-1)),A=n(()=>e("pre",null,`var svgElement = document.getElementById("mySVG");
knimeService.inlineSvgStyles(svgElement);
return (new XMLSerializer()).serializeToString(svgElement);`,-1)),B=n(()=>e("p",null,[t("or "),e("code",null,"inline code")],-1)),L=n(()=>e("h5",null,"Definition list",-1)),P=n(()=>e("dl",null,[e("dt",null,"knimeNode:"),e("dd",null,"The knimeNode must have the correct namespace."),e("dt",null,"views:"),e("dd",null,"Explains what is displayed in the view.")],-1)),K={class:"grid-container"},U={class:"grid-container"},W={class:"grid-container"},$={class:"grid-item-12"};function q(l,d,F,G,o,u){const a=s("Description",!0),h=s("Checkbox"),c=s("CodeExample");return g(),b("div",null,[E,e("section",T,[e("div",C,[i(a,{class:"description grid-item-12"},{default:r(()=>[R,D,N,z,I,H,M,V,A,B,L,P]),_:1})]),e("div",K,[i(a,{class:"grid-item-12",text:o.descriptionWithHtmlText,"render-as-html":!0,"use-rich-text-editor-styles":o.useRichTextEditorStyles},null,8,["text","use-rich-text-editor-styles"])]),e("div",U,[i(h,{modelValue:o.useRichTextEditorStyles,"onUpdate:modelValue":d[0]||(d[0]=m=>o.useRichTextEditorStyles=m),class:"grid-item-12"},{default:r(()=>[t("Use RichTextEditor styles")]),_:1},8,["modelValue"])])]),e("section",null,[e("div",W,[e("div",$,[i(c,{summary:"Show usage example"},{default:r(()=>[t(p(o.codeExample),1)]),_:1}),i(c,{summary:"Show Description.vue source code"},{default:r(()=>[t(p(u.code),1)]),_:1})])])])])}const O=v(S,[["render",q],["__scopeId","data-v-d6873612"]]);export{O as default};
