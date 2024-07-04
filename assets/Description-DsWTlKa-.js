import{C as h}from"./CodeExample-Ujd6Yu0u.js";import{_ as p,D as m,r as a,o as v,c as _,b as t,d as i,w as s,e as n,t as c,p as x,f}from"./index-gPJumjSm.js";const w=`<script>
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
    class="description"
    v-html="text"
  />
  <div v-else class="description plain" v-text="text" />
</template>

<style lang="postcss" scoped>
@import url("./forms/RichTextEditor/styles.css");

.description {
  --rich-text-editor-font-size: var(--description-font-size, 18px);

  line-height: 26px;
  overflow-wrap: anywhere;
  word-break: break-word; /* Safari needs this */

  &.plain {
    white-space: pre-line;
  }

  &:deep() {
    @mixin rich-text-editor-styles;
  }
}
</style>
`,g={components:{Description:m,CodeExample:h},data(){return{codeExample:`<Description>Text with <b>HTML code</b> via slot.</Description>

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
      </p><br>`,useRichTextEditorStyles:!1}},computed:{code(){return w}}},e=l=>(x("data-v-1a16abb9"),l=l(),f(),l),b=e(()=>t("section",null,[t("div",{class:"grid-container"},[t("div",{class:"grid-item-12"},[t("p",null," The Description component provides styling for rich-text markup (see component code for details)… ")])])],-1)),y={class:"demo"},S={class:"grid-container"},C=e(()=>t("h5",null,"Links",-1)),k=e(()=>t("p",null,[t("a",{href:"/"},"Internal link"),n(" or "),t("a",{href:"https://www.knime.com/"},"External link")],-1)),T=e(()=>t("h5",null,"Lists",-1)),E=e(()=>t("ol",null,[t("li",null,"Aggregation method (count, summary, average)"),t("li",null,"Pie size"),t("li",null,"Show missing value section"),t("li",null,"Show pie section outline")],-1)),D=e(()=>t("ul",null,[t("li",null,[t("b",null,"Replace outlier values:"),n(' Allows to replace outliers based on the selected "Replacement strategy" ')]),t("li",null,[t("b",null,"Remove outlier rows:"),n(" Removes all rows from the input data that contain in any of the selected columns at least one outlier ")]),t("li",null,[t("b",null,"Remove non-outlier rows:"),n(" Retains only those rows of the input data that contain at least one outlier in any of the selected columns ")])],-1)),M=e(()=>t("h5",null,"Table",-1)),R=e(()=>t("table",null,[t("tbody",null,[t("tr",null,[t("th",null,"level0"),t("th",null,"level1"),t("th",null,"level2"),t("th",null,"value")]),t("tr",null,[t("td",null,"Carnivora"),t("td",null,"Felidae"),t("td",null,"Panthera"),t("td",null,"10")]),t("tr",null,[t("td",null,"Carnivora"),t("td",null,"Mustelidae"),t("td",null,"Mephitis"),t("td",null,"6")]),t("tr",null,[t("td",null,"Carnivora"),t("td",null,"Mustelidae"),t("td",null,"Lutra"),t("td",null,"7")]),t("tr",null,[t("td",null,"Carnivora"),t("td",null,"Canidae"),t("td",null,"?"),t("td",null,"14")])])],-1)),H=e(()=>t("h5",null,"Code & Pre",-1)),I=e(()=>t("pre",null,`var svgElement = document.getElementById("mySVG");
knimeService.inlineSvgStyles(svgElement);
return (new XMLSerializer()).serializeToString(svgElement);`,-1)),L=e(()=>t("p",null,[n("or "),t("code",null,"inline code")],-1)),A=e(()=>t("h5",null,"Definition list",-1)),z=e(()=>t("dl",null,[t("dt",null,"knimeNode:"),t("dd",null,"The knimeNode must have the correct namespace."),t("dt",null,"views:"),t("dd",null,"Explains what is displayed in the view.")],-1)),B={class:"grid-container"},N={class:"grid-container"},$={class:"grid-item-12"};function P(l,V,F,W,o,u){const r=a("Description",!0),d=a("CodeExample");return v(),_("div",null,[b,t("section",y,[t("div",S,[i(r,{class:"description grid-item-12"},{default:s(()=>[C,k,T,E,D,M,R,H,I,L,A,z]),_:1})]),t("div",B,[i(r,{class:"grid-item-12",text:o.descriptionWithHtmlText,"render-as-html":!0},null,8,["text"])])]),t("section",null,[t("div",N,[t("div",$,[i(d,{summary:"Show usage example"},{default:s(()=>[n(c(o.codeExample),1)]),_:1}),i(d,{summary:"Show Description.vue source code"},{default:s(()=>[n(c(u.code),1)]),_:1})])])])])}const j=p(g,[["render",P],["__scopeId","data-v-1a16abb9"]]);export{j as default};
