import{C as u}from"./CodeExample-w4OHw7Vv.js";import{_ as h,D as m,r as a,o as v,c as x,b as e,d as i,w as l,e as t,t as c,p as f,f as g}from"./index-sjtTwBE-.js";const b=`<script>
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
    class="html-description"
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

  & :deep(a[href^="http"]) {
    &::after {
      content: "";
      mask: url("../assets/img/icons/link-external.svg?data") no-repeat 50% 50%;
      mask-size: cover;
      background: var(--theme-text-link-foreground-color);
      width: 16px;
      height: 16px;
      display: inline-block;
      margin-left: 4px;
      vertical-align: -2px;
    }

    &:hover {
      &::after {
        background-color: var(
          --theme-text-link-foreground-color-hover
        ); /* defines icon color */
      }
    }
  }

  & :deep(a) {
    color: var(--theme-text-link-foreground-color);
    background: var(--theme-text-link-background-color);

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
    @mixin rich-text-editor-table;

    font-size: var(--description-font-size, 18px);
  }
}
</style>
`,k={components:{Description:m,CodeExample:u},data(){return{codeExample:`<Description>Text with <b>HTML code</b> via slot.</Description>

<Description :text="htmlString" renderAsHtml />`,descriptionWithHtmlText:`<h4>This is a description without a slot, rendering an html string</h4>
      <p>It uses the same styles as the RichTextEditor component<br>
        <hr>
        <strong>strong</strong> <br>
        <i>italics</i> <br>
        <ul><li>one</li><li>two</li></ul>
        <pre><code>this is a code block</code></pre>
        <a href="https://www.knime.com">This is an external link</a><br>
        <a href="/">This is an internal link</a> 
        <table>
            <tbody>
              <tr>
                <th>level0</th>
                <th>level1</th>
                <th>level2</th>
                <th>value</th>
              </tr>
              <tr>
                <td>Carnivora</td>
                <td>Felidae</td>
                <td>Panthera</td>
                <td>10</td>
              </tr>
              <tr>
                <td>Carnivora</td>
                <td>Mustelidae</td>
                <td>Mephitis</td>
                <td>6</td>
              </tr>
              <tr>
                <td>Carnivora</td>
                <td>Mustelidae</td>
                <td>Lutra</td>
                <td>7</td>
              </tr>
              <tr>
                <td>Carnivora</td>
                <td>Canidae</td>
                <td>?</td>
                <td>14</td>
              </tr>
            </tbody>
          </table>
      </p><br>`,useRichTextEditorStyles:!1}},computed:{code(){return b}}},n=o=>(f("data-v-1a16abb9"),o=o(),g(),o),_=n(()=>e("section",null,[e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null," The Description component provides styling for rich-text markup (see component code for details)… ")])])],-1)),w={class:"demo"},y={class:"grid-container"},S=n(()=>e("h5",null,"Links",-1)),C=n(()=>e("p",null,[e("a",{href:"/"},"Internal link"),t(" or "),e("a",{href:"https://www.knime.com/"},"External link")],-1)),E=n(()=>e("h5",null,"Lists",-1)),T=n(()=>e("ol",null,[e("li",null,"Aggregation method (count, summary, average)"),e("li",null,"Pie size"),e("li",null,"Show missing value section"),e("li",null,"Show pie section outline")],-1)),D=n(()=>e("ul",null,[e("li",null,[e("b",null,"Replace outlier values:"),t(' Allows to replace outliers based on the selected "Replacement strategy" ')]),e("li",null,[e("b",null,"Remove outlier rows:"),t(" Removes all rows from the input data that contain in any of the selected columns at least one outlier ")]),e("li",null,[e("b",null,"Remove non-outlier rows:"),t(" Retains only those rows of the input data that contain at least one outlier in any of the selected columns ")])],-1)),M=n(()=>e("h5",null,"Table",-1)),N=n(()=>e("table",null,[e("tbody",null,[e("tr",null,[e("th",null,"level0"),e("th",null,"level1"),e("th",null,"level2"),e("th",null,"value")]),e("tr",null,[e("td",null,"Carnivora"),e("td",null,"Felidae"),e("td",null,"Panthera"),e("td",null,"10")]),e("tr",null,[e("td",null,"Carnivora"),e("td",null,"Mustelidae"),e("td",null,"Mephitis"),e("td",null,"6")]),e("tr",null,[e("td",null,"Carnivora"),e("td",null,"Mustelidae"),e("td",null,"Lutra"),e("td",null,"7")]),e("tr",null,[e("td",null,"Carnivora"),e("td",null,"Canidae"),e("td",null,"?"),e("td",null,"14")])])],-1)),z=n(()=>e("h5",null,"Code & Pre",-1)),I=n(()=>e("pre",null,`var svgElement = document.getElementById("mySVG");
knimeService.inlineSvgStyles(svgElement);
return (new XMLSerializer()).serializeToString(svgElement);`,-1)),R=n(()=>e("p",null,[t("or "),e("code",null,"inline code")],-1)),H=n(()=>e("h5",null,"Definition list",-1)),L=n(()=>e("dl",null,[e("dt",null,"knimeNode:"),e("dd",null,"The knimeNode must have the correct namespace."),e("dt",null,"views:"),e("dd",null,"Explains what is displayed in the view.")],-1)),A={class:"grid-container"},B={class:"grid-container"},P={class:"grid-item-12"};function $(o,V,F,K,r,p){const d=a("Description",!0),s=a("CodeExample");return v(),x("div",null,[_,e("section",w,[e("div",y,[i(d,{class:"description grid-item-12"},{default:l(()=>[S,C,E,T,D,M,N,z,I,R,H,L]),_:1})]),e("div",A,[i(d,{class:"grid-item-12",text:r.descriptionWithHtmlText,"render-as-html":!0},null,8,["text"])])]),e("section",null,[e("div",B,[e("div",P,[i(s,{summary:"Show usage example"},{default:l(()=>[t(c(r.codeExample),1)]),_:1}),i(s,{summary:"Show Description.vue source code"},{default:l(()=>[t(c(p.code),1)]),_:1})])])])])}const G=h(k,[["render",$],["__scopeId","data-v-1a16abb9"]]);export{G as default};
