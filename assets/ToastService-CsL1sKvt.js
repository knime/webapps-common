var B=Object.defineProperty;var N=(n,l,e)=>l in n?B(n,l,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[l]=e;var E=(n,l,e)=>N(n,typeof l!="symbol"?l+"":l,e);import{o as p,c as m,b as s,h as F,aT as O,i as M,R as A,t as u,l as f,F as $,e as a,f as H,d as r,w as d,u as o,a8 as L,C as v,_ as V,a9 as z,aU as W,a as R,aV as Y}from"./index-7x0lt_p4.js";import{C as w}from"./CodeExample-ytjrgJ7P.js";const X={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"};function G(n,l){return p(),m("svg",X,l[0]||(l[0]=[s("path",{d:"M11.672 7.407h17.312V29.5H11.672zm8.656 0V2.5H3.016v22.093h8.656V7.407z"},null,-1)]))}const J={render:G},K={class:"wrapper"},Q={class:"title"},Z={key:1,class:"additional-info"},_={key:0,class:"details"},tt={key:1,class:"details-list"},et={key:1},ot={key:2},st={key:3},at={key:4},it={key:5,class:"copy-button-wrapper"},nt=F({__name:"RFCErrorToastTemplate",props:{headline:{},title:{},status:{default:void 0},date:{default:void 0},details:{default:()=>[]},requestId:{default:void 0},errorId:{default:void 0},canCopyToClipboard:{type:Boolean,default:!0}},emits:["showMore"],setup(n,{emit:l}){const e=n,y=l,{copy:b,copied:I}=O({copiedDuring:3e3}),T=M(!1),P={year:"numeric",month:"short",day:"numeric",hour:"numeric",minute:"numeric",second:"numeric",hour12:!0},S=A(()=>new Intl.DateTimeFormat(void 0,P).format(e.date)),x=A(()=>{var g;let c="";(g=e.details)!=null&&g.length&&(e.details.length>1?c=`
${e.details.map(k=>`• ${k}`).join(`
`)}`:c=e.details[0]);let i=`${e.headline}

`;return i+=`${e.title}

`,i+=c?`Details: ${c}

`:"",e.status!==void 0&&(i+=`Status: ${e.status}
`),e.date&&(i+=`Date: ${S.value}
`),e.requestId&&(i+=`Request Id: ${e.requestId}
`),e.errorId&&(i+=e.errorId?`Error Id: ${e.errorId}
`:""),i}),j=()=>{b(x.value).catch(c=>{consola.error("Failed to copy to clipboard",{error:c})})},q=()=>{T.value=!0,y("showMore")};return(c,i)=>{var g;return p(),m("div",K,[s("div",Q,u(e.title),1),T.value?f("",!0):(p(),m("button",{key:0,class:"show-more",onClick:q}," Show details ")),T.value?(p(),m("div",Z,[(g=e.details)!=null&&g.length?(p(),m("div",_,[i[0]||(i[0]=s("strong",null,"Details: ",-1)),e.details.length==1?(p(),m($,{key:0},[a(u(e.details[0]),1)],64)):(p(),m("ul",tt,[(p(!0),m($,null,H(c.details,(C,k)=>(p(),m("li",{key:k},u(C),1))),128))]))])):f("",!0),c.status!==void 0?(p(),m("div",et,[i[1]||(i[1]=s("strong",null,"Status: ",-1)),a(u(c.status),1)])):f("",!0),c.date?(p(),m("div",ot,[i[2]||(i[2]=s("strong",null,"Date: ",-1)),a(u(S.value),1)])):f("",!0),c.requestId?(p(),m("div",st,[i[3]||(i[3]=s("strong",null,"Request id: ",-1)),a(u(c.requestId),1)])):f("",!0),c.errorId?(p(),m("div",at,[i[4]||(i[4]=s("strong",null,"Error id: ",-1)),a(u(c.errorId),1)])):f("",!0),c.canCopyToClipboard?(p(),m("div",it,[r(o(v),{onClick:j},{default:d(()=>[o(I)?(p(),m($,{key:0},[r(o(L),{class:"copy-icon"}),i[5]||(i[5]=a("Error was copied "))],64)):(p(),m($,{key:1},[r(o(J),{class:"copy-icon"}),i[6]||(i[6]=a("Copy error to clipboard "))],64))]),_:1})])):f("",!0)])):f("",!0)])}}}),rt=V(nt,[["__scopeId","data-v-6063afec"]]);class U extends Error{constructor(e){super(e.title);E(this,"data");this.data=e}}const dt=({headline:n,rfcError:l,canCopyToClipboard:e=!0})=>{const{data:y}=l,b=z(rt,{headline:n,...y,canCopyToClipboard:e});return{type:"error",headline:n,component:b,autoRemove:!1}},lt=n=>{if(!n.response)return n;const l=n.response.headers.get("date")?new Date(n.response.headers.get("date")):void 0,e={title:n.data.title,details:n.data.details,status:n.statusCode,date:l,requestId:n.response.headers.get("x-request-id")??void 0,errorId:n.response.headers.get("x-error-id")??void 0};return new U(e)},D={toToast:dt,tryParse:lt,RFCError:U},ct={class:"grid-container"},pt={class:"grid-item-12"},mt={class:"grid-container"},ut={class:"wrapper"},vt={class:"grid-container"},ht={class:"wrapper"},ft={class:"grid-container"},gt={class:"wrapper"},wt={class:"grid-container"},yt={class:"grid-item-12"},bt="",Tt="",kt=`
  // App.vue (root component of a Vue 3-based project)
  <script setup lang="ts">
  import { ToastStack, ToastServiceProvider } from "@knime/components";

  // Instantiate the service provider and call the composable method
  const toastServiceProvider = new ToastServiceProvider();
  toastServiceProvider.useToastService();
  <\/script>

  <template>
    <!-- place the ToastStack component where you want toasts to be rendered -->
    <ToastStack />
    <!-- the rest of the <template> -->
  </template>


  ------------------------------------
  // SomeChildComponent.vue
  <script setup lang="ts">
  import { useToasts, type Toast } from "@knime/components";

  // Inject the service properties that the component needs
  const { show } = useToasts();

  // Define the Toast object (or simply pass it to "show" as an anonymous object)
  const toast: Toast = {
    type: "info",
    message: "The train station is closing in 30 minutes."
  }

  // Display the toast using the "show" function injected earlier
  show(toast)
  <\/script>

  <template>
    <!-- use the 'show' function anywhere in the component -->
    <button @click="show(toast)">Click me</button>
    <!-- the rest of the <template> -->
  </template>
`,St=`
  // main.ts (root script of a Vue 3-based project)
  import { ToastServiceProvider } from "@knime/components";

  // Instantiate the service provider and get the plugin object
  const toastServiceProvider = new ToastServiceProvider();
  const toastPlugin = toastServiceProvider.getToastServicePlugin();

  // Register the plugin with the app
  // (it will be available under the $toast property by default)
  const app = createApp(App);
  app.use(toastPlugin);
  app.mount("#app");
  <\/script>


  ------------------------------------
  // App.vue (root component of the same project)
  <script setup lang="ts">
  import { ToastStack } from "@knime/components";
  <\/script>

  <template>
    <!-- place the ToastStack component where you want toasts to be rendered -->
    <ToastStack />
    <!-- the rest of the <template> -->
  </template>


  ------------------------------------
  // SomeChildComponent.vue
  <script lang="ts">
  import type { Toast } from "@knime/components";

  export default {
    data() {
      const toast: Toast = {
        type: "info",
        message: "The train station is closing in 30 minutes."
      }
      return tost;
    },
    mounted() {
      this.$toast.show(this.toast);
    },
  };
  <\/script>

  <template>
    <!-- use the toast service via the global "this" anywhere in the component -->
    <button @click="this.$toast.show(this.toast)">Click me</button>
    <!-- the rest of the <template> -->
  </template>
`,Ct=`
  // main.ts (root script of a Vue 3-based project)
  import { ToastServiceProvider } from "@knime/components";

  // Instantiate the service provider and get the toast service object directly
  const toastServiceProvider = new ToastServiceProvider();
  const toastService = toastServiceProvider.getToastServiceObject();

  // Register the service object with the store
  const app = createApp(App);
  const store = createStore({
    modules: {
      toast: toastService,
    },
  });
  app.use(store);
  app.mount("#app");
  <\/script>


  ------------------------------------
  // App.vue (root component of the same project)
  <script setup lang="ts">
  import { ToastStack } from "@knime/components";
  <\/script>

  <template>
    <!-- place the ToastStack component where you want toasts to be rendered -->
    <ToastStack />
    <!-- the rest of the <template> -->
  </template>


  ------------------------------------
  // myStore.js
  export const actions = {
    myCoolAction({ commit }, coolParameter) {
      // action code
      this.$toast.show({
          type: "info",
          message: "Hello there!",
        });
    }
  };
`,$t=`
  // someConfigFile.ts
  export const customSymbol = Symbol("customToastService");


  ------------------------------------
  // SomeComponent.vue
  <script setup lang="ts">
  import { customSymbol } from "./someConfigFile";
  import { ToastStack, ToastServiceProvider } from "@knime/components";

  // Instantiate the service provider
  const toastServiceProvider = new ToastServiceProvider();

  // Call the composable with the custom symbol
  toastServiceProvider.useToastService({
    serviceSymbol: customSymbol
  });
  <\/script>

  <template>
    <!-- pass the symbol to the ToastStack as well -->
    <ToastStack :service-symbol="customSymbol" />
    <!-- the rest of the <template> -->
  </template>


  ------------------------------------
  // Repeat the above with a **new** instance of the ToastServiceProvider and
  // a different symbol.


  ------------------------------------
  // SomeChildComponent.vue
  <script setup lang="ts">
  import { customSymbol } from "./someConfigFile";
  import { useToasts, type Toast } from "@knime/components";

  // Inject the service bound to the custom symbol
  const { show } = useToasts({
    serviceSymbol: customSymbol
  });

  const toast: Toast = {
    type: "info",
    message: "The train station is closing in 30 minutes."
  }

  // This toast will be rendered by the ToastStack component bound to the custom symbol
  show(toast)
  <\/script>
`,It=`
  // main.ts
  import { ToastServiceProvider } from "@knime/components";

  // Instantiate the service provider and get the plugin object
  const toastServiceProvider = new ToastServiceProvider();
  const toastPlugin = toastServiceProvider.getToastServicePlugin();

  // Register the plugin with the app under a custom property name
  const app = createApp(App);
  app.use(toastPlugin, {
    propertyName: "$kombucha"
  })
  app.mount("#app");
  <\/script>


  ------------------------------------
  // SomeComponent.vue
  <script setup lang="ts">
  import { ToastStack } from "@knime/components";
  <\/script>

  <template>
    <!-- pass the custom property name to the ToastStack -->
    <ToastStack :property-name:"$kombucha" />
    <!-- the rest of the <template> -->
  </template>


  ------------------------------------
  // SomeOtherComponent.vue
  <script lang="ts">
  import type { Toast } from "@knime/components";

  export default {
    data() {
      const toast: Toast = {
        type: "info",
        message: "The train station is closing in 30 minutes."
      }
      return tost;
    },
    mounted() {
      this.$kombucha.show(this.toast);
    },
  };
  <\/script>
`,Pt=F({__name:"ToastService",setup(n){const{toasts:l,show:e,autoRemove:y,removeAll:b}=W(),I={type:"info",message:"This is an info toast."},T={type:"error",message:"This is an error toast."},P={type:"warning",message:"This is a warning toast."},S={type:"success",message:"This is a success toast."},x={type:"success",message:"This is a super massive toast with lots of text. ".repeat(10)},j={type:"success",message:"This is a persistent toast that needs to be manually dismissed.",autoRemove:!1},q={type:"success",headline:"This toast has no message"},c={type:"info",message:"This toast has a link as a button.",buttons:[{text:"Click me",href:"https://www.example.com"}]},i={type:"success",headline:"Secret toast",message:"Congratulations, you found me!"},g={type:"warning",message:"This toast has a callback as a button.",buttons:[{text:"Click me",callback:()=>e(i),icon:Y}]},C=new D.RFCError({title:"Could not load the workflow from the deployment. Check if the workflow version for this deployment is still available.",details:['Could not load workflow "/Users/some team/some space/workflowname" for deployment "cdf0fc54a-fasd123123-asd1234123-adfa123"','Something else happend with workflow "/Users/some team/some space/workflowname" for deployment "cdf0fc54a-fasd123123-asd1234123-adfa123"'],status:123,date:new Date,requestId:"134123212413412321241341",errorId:"abcdefg"}),k=D.toToast({headline:"Deployment could not be created",rfcError:C});return(xt,t)=>(p(),m("div",null,[t[30]||(t[30]=R('<section data-v-417ed56d><div class="grid-container" data-v-417ed56d><div class="grid-item-12" data-v-417ed56d><p data-v-417ed56d> This framework provides a simple and versatile API that enables the use of toast-style notifications. It&#39;s Vuex/Pinia-agnostic, Nuxt 3-ready, and supports both Composition API and Options API approaches. Multiple toast services can be used in the same project. A toast service is a combination of a reactive array of toast objects and methods for mutating the array. </p><p data-v-417ed56d> You are able to import all of the public-facing components of the framework, including types, from <code data-v-417ed56d>@knime/components</code>. </p><p data-v-417ed56d> To use the toast service in your project, follow these steps (see the example section below for detailed coverage of various use-cases): </p><ol data-v-417ed56d><li data-v-417ed56d> Import and instantiate the <code data-v-417ed56d>ToastServiceProvider</code> class in the <code data-v-417ed56d>setup</code> section of the root component of your project (e.g. <code data-v-417ed56d>App.vue</code>). The class instance will create a new toast service. </li><li data-v-417ed56d> In the same <code data-v-417ed56d>setup</code> section, provide the toast service to the downstream components of the application by calling the <code data-v-417ed56d>toastServiceProvider.useToastService()</code> method. </li><li data-v-417ed56d> Either in the root component, or in a downstream component, import the <code data-v-417ed56d>ToastStack</code> component and place it in the <code data-v-417ed56d>template</code> section. Currently, the stack is bound to the bottom left corner of its parent and the position is not adjustable. </li><li data-v-417ed56d> Whenever a component needs to e.g. display a toast notification, import the <code data-v-417ed56d>useToasts</code> composable, which returns the toast service object containing the <code data-v-417ed56d>show</code> function. Make sure to call the composable in the <code data-v-417ed56d>setup</code> section of the component. </li><li data-v-417ed56d> Use the retrieved service properties, e.g. <code data-v-417ed56d>show</code>, anywhere in the component to modify the toast stack. </li></ol></div></div></section>',1)),s("section",null,[s("div",ct,[s("div",pt,[t[24]||(t[24]=s("h4",null,"Interactive demo",-1)),t[25]||(t[25]=s("p",null," This application has a toast service integrated. You can see it in action by spawning toast notifications using the buttons below. ",-1)),s("p",null,[s("b",null,"Current number of toasts in the stack: "+u(o(l).length),1)]),t[26]||(t[26]=s("h5",null,"Basic examples",-1)),s("div",mt,[s("div",ut,[r(o(v),{"with-border":"",compact:"",onClick:t[0]||(t[0]=h=>o(e)(I))},{default:d(()=>t[12]||(t[12]=[a("Info toast")])),_:1}),r(o(v),{"with-border":"",compact:"",onClick:t[1]||(t[1]=h=>o(e)(T))},{default:d(()=>t[13]||(t[13]=[a("Error toast")])),_:1}),r(o(v),{"with-border":"",compact:"",onClick:t[2]||(t[2]=h=>o(e)(P))},{default:d(()=>t[14]||(t[14]=[a("Warning toast")])),_:1}),r(o(v),{"with-border":"",compact:"",onClick:t[3]||(t[3]=h=>o(e)(S))},{default:d(()=>t[15]||(t[15]=[a("Success toast")])),_:1})])]),t[27]||(t[27]=s("h5",null,"Additional features",-1)),s("div",vt,[s("div",ht,[r(o(v),{"with-border":"",compact:"",onClick:t[4]||(t[4]=h=>o(e)(x))},{default:d(()=>t[16]||(t[16]=[a("Toast with a truncated message")])),_:1}),r(o(v),{"with-border":"",compact:"",onClick:t[5]||(t[5]=h=>o(e)(j))},{default:d(()=>t[17]||(t[17]=[a("Persistent toast")])),_:1}),r(o(v),{"with-border":"",compact:"",onClick:t[6]||(t[6]=h=>o(e)(q))},{default:d(()=>t[18]||(t[18]=[a("Toast with only a headline")])),_:1}),r(o(v),{"with-border":"",compact:"",onClick:t[7]||(t[7]=h=>o(e)(c))},{default:d(()=>t[19]||(t[19]=[a("Toast with a hyperlink")])),_:1}),r(o(v),{"with-border":"",compact:"",onClick:t[8]||(t[8]=h=>o(e)(g))},{default:d(()=>t[20]||(t[20]=[a("Toast with a callback")])),_:1}),r(o(v),{"with-border":"",compact:"",onClick:t[9]||(t[9]=h=>o(e)(o(k)))},{default:d(()=>t[21]||(t[21]=[a("Toast with an api error")])),_:1})])]),t[28]||(t[28]=s("h5",null,"Stack control",-1)),s("div",ft,[s("div",gt,[r(o(v),{"with-border":"",compact:"",onClick:t[10]||(t[10]=h=>o(y)())},{default:d(()=>t[22]||(t[22]=[a("Remove toasts with timer")])),_:1}),r(o(v),{"with-border":"",compact:"",onClick:t[11]||(t[11]=h=>o(b)())},{default:d(()=>t[23]||(t[23]=[a("Remove all toasts")])),_:1})])])])])]),t[31]||(t[31]=R('<section data-v-417ed56d><div class="grid-container" data-v-417ed56d><div class="grid-item-12" data-v-417ed56d><h4 data-v-417ed56d>Usage guidelines</h4><p data-v-417ed56d> To make the UX consistent, please try to adhere to the following usage guidelines: </p><ul data-v-417ed56d><li data-v-417ed56d> Omit periods from <code data-v-417ed56d>headlines</code>, e.g. &quot;Action performed.&quot; -&gt; &quot;Action performed&quot;. </li><li data-v-417ed56d>Ensure <code data-v-417ed56d>messages</code> end with a period.</li><li data-v-417ed56d> Use the <code data-v-417ed56d>type</code> of the toast to convey success/error information, instead of explicitly stating it in the <code data-v-417ed56d>headline</code>, e.g. &quot;Successfully created space&quot; -&gt; &quot;Space created&quot;. </li><li data-v-417ed56d> Refrain from using &quot;was&quot; when referring to completed actions, e.g. &quot;Space was created&quot; -&gt; &quot;Space created&quot;. </li><li data-v-417ed56d> Toasts with important information should be persistent, i.e. <code data-v-417ed56d>autoRemove</code> set to <code data-v-417ed56d>false</code>. </li></ul></div></div></section>',1)),s("section",null,[s("div",wt,[s("div",yt,[t[29]||(t[29]=s("h4",null,"Usage examples",-1)),r(w,{summary:"Show example of using via composables"},{default:d(()=>[a(u(kt))]),_:1}),r(w,{summary:"Show example of using as plugin"},{default:d(()=>[a(u(St))]),_:1}),r(w,{summary:"Show example of using from a store"},{default:d(()=>[a(u(Ct))]),_:1}),r(w,{summary:"Show example of using multiple services via composables"},{default:d(()=>[a(u($t))]),_:1}),r(w,{summary:"Show example of using multiple services as plugin"},{default:d(()=>[a(u(It))]),_:1}),r(w,{summary:"Show toast-service.ts source code"},{default:d(()=>[a(u(bt))]),_:1}),r(w,{summary:"Show types.ts source code"},{default:d(()=>[a(u(Tt))]),_:1})])])])]))}}),At=V(Pt,[["__scopeId","data-v-417ed56d"]]);export{At as default};
