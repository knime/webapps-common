import{C as k}from"./CodeExample-nhhIQv7B.js";import{_,c,o,b as s,l as d,k as y,e as a,p as b,t as r,r as h,d as i,w as u}from"./index-jB5fMxCO.js";import{i as z,p as x}from"./fileTypeIcons-Cn5gMXSG.js";import"./file-text-ChuZ0cnA.js";const S={name:"FileLink",components:{...z},props:{text:{type:String,required:!0},href:{type:String,required:!0},fileExt:{type:String,default:""},mimeType:{type:String,default:"application/octet-stream"},size:{type:Number,default:0}},computed:{icon(){const e=`${this.fileExt}Icon`;return this.fileExt&&this.$options.components[e]?e:"fileIcon"},humanFileSizeObject(){return x({output:"object",standard:"jedec",base:2})(this.size)},humanFileSizeUnitFull(){return x({output:"object",standard:"jedec",base:2,fullform:!0})(this.size).symbol},hasFileInfo(){return this.size||this.fileExt},fileInfoText(){let e="";return this.hasFileInfo&&(this.fileExt&&(e+=this.fileExt),this.size&&(e+=`, ${this.humanFileSizeObject.value} `)),e},linkHtmlTitle(){let e=this.text;return this.fileInfoText&&(e+=` (${this.fileInfoText}${this.size?this.humanFileSizeObject.symbol:""})`),e}}},w={class:"file-link"},L=["href","title","type"],E={key:0},T=["title"];function g(e,l,n,F,m,t){return o(),c("figure",w,[s("a",{href:n.href,download:"",title:t.linkHtmlTitle,type:n.mimeType},[(o(),y(b(t.icon))),a(r(n.text||"Download File"),1)],8,L),t.hasFileInfo?(o(),c("figcaption",E,[a(" ("+r(t.fileInfoText),1),n.size?(o(),c("abbr",{key:0,title:t.humanFileSizeUnitFull},r(t.humanFileSizeObject.symbol),9,T)):d("",!0),l[0]||(l[0]=a(") ",-1))])):d("",!0)])}const C=_(S,[["render",g],["__scopeId","data-v-c7427a4a"]]),I="",j=`
<FileLink
  href="https://example.com/file.pdf"
  file-ext="pdf"
  mime-type="application/pdf"
  :size="250"
  text="SomeFile"
/>

<FileLink
  href="https://example.com/x.docx"
  file-ext="docx"
  text="WordFile"
/>

<FileLink
  href="https://example.com/0342as"
  file-ext="bin"
  text="Download Me"
  file-name="firmware.bin"
/>

<FileLink
  href="https://example.com/unkown.file"
  text="Another File"
/>
`,v={components:{FileLink:C,CodeExample:k},data(){return{fileLinkCode:I,codeExample:j}}},$={class:"grid-container"},D={class:"grid-item-12"};function N(e,l,n,F,m,t){const f=h("FileLink",!0),p=h("CodeExample");return o(),c("section",null,[s("div",$,[s("div",D,[l[0]||(l[0]=s("p",null," The file link is a regular link with support for file icons and size display. ",-1)),s("div",null,[i(f,{href:"https://example.com/file.pdf","file-ext":"pdf","mime-type":"application/pdf",size:250,text:"SomeFile"}),i(f,{href:"https://example.com/x.docx","file-ext":"docx",text:"WordFile"}),i(f,{href:"https://example.com/0342as","file-ext":"bin",text:"Download Me","file-name":"firmware.bin"}),i(f,{href:"https://example.com/unkown.file",text:"Another File"})]),i(p,{summary:"Show usage example"},{default:u(()=>[a(r(m.codeExample),1)]),_:1}),i(p,{summary:"Show FileLink.vue source code"},{default:u(()=>[a(r(m.fileLinkCode),1)]),_:1})])])])}const A=_(v,[["render",N]]);export{A as default};
