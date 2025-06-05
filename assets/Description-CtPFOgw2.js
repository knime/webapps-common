import{C as c}from"./CodeExample-D1e1qLOf.js";import{_ as h,D as m,r as a,o as p,c as v,b as t,d as n,w as i,e,t as d}from"./index-CJ8JrX-F.js";const g="",w={components:{Description:m,CodeExample:c},data(){return{codeExample:`<Description>Text with <b>HTML code</b> via slot.</Description>

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
      </p><br>`,useRichTextEditorStyles:!1}},computed:{code(){return g}}},_={class:"demo"},f={class:"grid-container"},x={class:"grid-container"},b={class:"grid-container"},y={class:"grid-item-12"};function C(k,l,E,T,o,u){const r=a("Description",!0),s=a("CodeExample");return p(),v("div",null,[l[1]||(l[1]=t("section",null,[t("div",{class:"grid-container"},[t("div",{class:"grid-item-12"},[t("p",null," The Description component provides styling for rich-text markup (see component code for details)… ")])])],-1)),t("section",_,[t("div",f,[n(r,{class:"description grid-item-12"},{default:i(()=>l[0]||(l[0]=[t("h5",null,"Links",-1),t("p",null,[t("a",{href:"/"},"Internal link"),e(" or "),t("a",{href:"https://www.knime.com/"},"External link")],-1),t("h5",null,"Lists",-1),t("ol",null,[t("li",null,"Aggregation method (count, summary, average)"),t("li",null,"Pie size"),t("li",null,"Show missing value section"),t("li",null,"Show pie section outline")],-1),t("ul",null,[t("li",null,[t("b",null,"Replace outlier values:"),e(' Allows to replace outliers based on the selected "Replacement strategy" ')]),t("li",null,[t("b",null,"Remove outlier rows:"),e(" Removes all rows from the input data that contain in any of the selected columns at least one outlier ")]),t("li",null,[t("b",null,"Remove non-outlier rows:"),e(" Retains only those rows of the input data that contain at least one outlier in any of the selected columns ")])],-1),t("h5",null,"Table",-1),t("table",null,[t("tbody",null,[t("tr",null,[t("th",null,"level0"),t("th",null,"level1"),t("th",null,"level2"),t("th",null,"value")]),t("tr",null,[t("td",null,"Carnivora"),t("td",null,"Felidae"),t("td",null,"Panthera"),t("td",null,"10")]),t("tr",null,[t("td",null,"Carnivora"),t("td",null,"Mustelidae"),t("td",null,"Mephitis"),t("td",null,"6")]),t("tr",null,[t("td",null,"Carnivora"),t("td",null,"Mustelidae"),t("td",null,"Lutra"),t("td",null,"7")]),t("tr",null,[t("td",null,"Carnivora"),t("td",null,"Canidae"),t("td",null,"?"),t("td",null,"14")])])],-1),t("h5",null,"Code & Pre",-1),t("pre",null,`var svgElement = document.getElementById("mySVG");
knimeService.inlineSvgStyles(svgElement);
return (new XMLSerializer()).serializeToString(svgElement);`,-1),t("p",null,[e("or "),t("code",null,"inline code")],-1),t("h5",null,"Definition list",-1),t("dl",null,[t("dt",null,"knimeNode:"),t("dd",null,"The knimeNode must have the correct namespace."),t("dt",null,"views:"),t("dd",null,"Explains what is displayed in the view.")],-1)])),_:1})]),t("div",x,[n(r,{class:"grid-item-12",text:o.descriptionWithHtmlText,"render-as-html":!0},null,8,["text"])])]),t("section",null,[t("div",b,[t("div",y,[n(s,{summary:"Show usage example"},{default:i(()=>[e(d(o.codeExample),1)]),_:1}),n(s,{summary:"Show Description.vue source code"},{default:i(()=>[e(d(u.code),1)]),_:1})])])])])}const M=h(w,[["render",C],["__scopeId","data-v-ac18621f"]]);export{M as default};
