import{C as h}from"./CodeExample-YOZfKAVw.js";import{_ as p,D as m,r as a,o as _,c as v,b as t,d as o,w as i,e as l,t as c,p as g,f}from"./index-P7WMaXAv.js";const w="",x={components:{Description:m,CodeExample:h},data(){return{codeExample:`<Description>Text with <b>HTML code</b> via slot.</Description>

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
      </p><br>`,useRichTextEditorStyles:!1}},computed:{code(){return w}}},e=n=>(g("data-v-ac18621f"),n=n(),f(),n),b=e(()=>t("section",null,[t("div",{class:"grid-container"},[t("div",{class:"grid-item-12"},[t("p",null," The Description component provides styling for rich-text markup (see component code for details)… ")])])],-1)),y={class:"demo"},C={class:"grid-container"},S=e(()=>t("h5",null,"Links",-1)),k=e(()=>t("p",null,[t("a",{href:"/"},"Internal link"),l(" or "),t("a",{href:"https://www.knime.com/"},"External link")],-1)),E=e(()=>t("h5",null,"Lists",-1)),T=e(()=>t("ol",null,[t("li",null,"Aggregation method (count, summary, average)"),t("li",null,"Pie size"),t("li",null,"Show missing value section"),t("li",null,"Show pie section outline")],-1)),D=e(()=>t("ul",null,[t("li",null,[t("b",null,"Replace outlier values:"),l(' Allows to replace outliers based on the selected "Replacement strategy" ')]),t("li",null,[t("b",null,"Remove outlier rows:"),l(" Removes all rows from the input data that contain in any of the selected columns at least one outlier ")]),t("li",null,[t("b",null,"Remove non-outlier rows:"),l(" Retains only those rows of the input data that contain at least one outlier in any of the selected columns ")])],-1)),M=e(()=>t("h5",null,"Table",-1)),R=e(()=>t("table",null,[t("tbody",null,[t("tr",null,[t("th",null,"level0"),t("th",null,"level1"),t("th",null,"level2"),t("th",null,"value")]),t("tr",null,[t("td",null,"Carnivora"),t("td",null,"Felidae"),t("td",null,"Panthera"),t("td",null,"10")]),t("tr",null,[t("td",null,"Carnivora"),t("td",null,"Mustelidae"),t("td",null,"Mephitis"),t("td",null,"6")]),t("tr",null,[t("td",null,"Carnivora"),t("td",null,"Mustelidae"),t("td",null,"Lutra"),t("td",null,"7")]),t("tr",null,[t("td",null,"Carnivora"),t("td",null,"Canidae"),t("td",null,"?"),t("td",null,"14")])])],-1)),I=e(()=>t("h5",null,"Code & Pre",-1)),L=e(()=>t("pre",null,`var svgElement = document.getElementById("mySVG");
knimeService.inlineSvgStyles(svgElement);
return (new XMLSerializer()).serializeToString(svgElement);`,-1)),N=e(()=>t("p",null,[l("or "),t("code",null,"inline code")],-1)),B=e(()=>t("h5",null,"Definition list",-1)),H=e(()=>t("dl",null,[t("dt",null,"knimeNode:"),t("dd",null,"The knimeNode must have the correct namespace."),t("dt",null,"views:"),t("dd",null,"Explains what is displayed in the view.")],-1)),P={class:"grid-container"},V={class:"grid-container"},z={class:"grid-item-12"};function A(n,F,W,$,s,u){const d=a("Description",!0),r=a("CodeExample");return _(),v("div",null,[b,t("section",y,[t("div",C,[o(d,{class:"description grid-item-12"},{default:i(()=>[S,k,E,T,D,M,R,I,L,N,B,H]),_:1})]),t("div",P,[o(d,{class:"grid-item-12",text:s.descriptionWithHtmlText,"render-as-html":!0},null,8,["text"])])]),t("section",null,[t("div",V,[t("div",z,[o(r,{summary:"Show usage example"},{default:i(()=>[l(c(s.codeExample),1)]),_:1}),o(r,{summary:"Show Description.vue source code"},{default:i(()=>[l(c(u.code),1)]),_:1})])])])])}const j=p(x,[["render",A],["__scopeId","data-v-ac18621f"]]);export{j as default};
