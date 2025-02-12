import{C as k}from"./CodeExample-C6jvhOF9.js";import{_ as x,o as n,c,b as o,l as y,s as b,e as s,t as a,m as d,r as p,d as i,w as h}from"./index-CYHcwofQ.js";import{i as z,p as u}from"./fileTypeIcons-D7UUlj7a.js";import"./file-text-CZTEE8Dx.js";const S={name:"FileLink",components:{...z},props:{text:{type:String,required:!0},href:{type:String,required:!0},fileExt:{type:String,default:""},mimeType:{type:String,default:"application/octet-stream"},size:{type:Number,default:0}},computed:{icon(){let e=`${this.fileExt}Icon`;return this.fileExt&&this.$options.components[e]?e:"fileIcon"},humanFileSizeObject(){return u({output:"object",standard:"jedec",base:2})(this.size)},humanFileSizeUnitFull(){return u({output:"object",standard:"jedec",base:2,fullform:!0})(this.size).symbol},hasFileInfo(){return this.size||this.fileExt},fileInfoText(){let e="";return this.hasFileInfo&&(this.fileExt&&(e+=this.fileExt),this.size&&(e+=`, ${this.humanFileSizeObject.value} `)),e},linkHtmlTitle(){let e=this.text;return this.fileInfoText&&(e+=` (${this.fileInfoText}${this.size?this.humanFileSizeObject.symbol:""})`),e}}},w={class:"file-link"},L=["href","title","type"],E={key:0},T=["title"];function g(e,_,l,F,f,t){return n(),c("figure",w,[o("a",{href:l.href,download:"",title:t.linkHtmlTitle,type:l.mimeType},[(n(),y(b(t.icon))),s(a(l.text||"Download File"),1)],8,L),t.hasFileInfo?(n(),c("figcaption",E,[s(" ("+a(t.fileInfoText),1),l.size?(n(),c("abbr",{key:0,title:t.humanFileSizeUnitFull},a(t.humanFileSizeObject.symbol),9,T)):d("",!0),s(") ")])):d("",!0)])}const C=x(S,[["render",g],["__scopeId","data-v-2c093e44"]]),I="",j=`
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
`,v={components:{FileLink:C,CodeExample:k},data(){return{fileLinkCode:I,codeExample:j}}},$={class:"grid-container"},D={class:"grid-item-12"},N=o("p",null," The file link is a regular link with support for file icons and size display. ",-1);function B(e,_,l,F,f,t){const r=p("FileLink",!0),m=p("CodeExample");return n(),c("section",null,[o("div",$,[o("div",D,[N,o("div",null,[i(r,{href:"https://example.com/file.pdf","file-ext":"pdf","mime-type":"application/pdf",size:250,text:"SomeFile"}),i(r,{href:"https://example.com/x.docx","file-ext":"docx",text:"WordFile"}),i(r,{href:"https://example.com/0342as","file-ext":"bin",text:"Download Me","file-name":"firmware.bin"}),i(r,{href:"https://example.com/unkown.file",text:"Another File"})]),i(m,{summary:"Show usage example"},{default:h(()=>[s(a(f.codeExample),1)]),_:1}),i(m,{summary:"Show FileLink.vue source code"},{default:h(()=>[s(a(f.fileLinkCode),1)]),_:1})])])])}const H=x(v,[["render",B]]);export{H as default};
