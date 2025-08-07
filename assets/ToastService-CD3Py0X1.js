var B=Object.defineProperty;var N=(n,l,e)=>l in n?B(n,l,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[l]=e;var E=(n,l,e)=>N(n,typeof l!="symbol"?l+"":l,e);import{o as p,c as m,b as a,h as F,aT as O,i as M,R as A,t as u,l as f,F as $,e as i,f as z,d as r,w as d,u as o,a8 as H,C as v,_ as V,a9 as L,aU as W,a as R,aV as Y}from"./index-BVMwdkus.js";import{C as w}from"./CodeExample-Bs47VSD6.js";const X={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"};function G(n,l){return p(),m("svg",X,l[0]||(l[0]=[a("path",{d:"M11.672 7.407h17.312V29.5H11.672zm8.656 0V2.5H3.016v22.093h8.656V7.407z"},null,-1)]))}const J={render:G},K={class:"wrapper"},Q={class:"title"},Z={key:1,class:"additional-info"},_={key:0,class:"details"},tt={key:1,class:"details-list"},et={key:1},ot={key:2},st={key:3},at={key:4},it={key:5},nt={key:6,class:"copy-button-wrapper"},rt=F({__name:"RFCErrorToastTemplate",props:{headline:{},canCopyToClipboard:{type:Boolean,default:!0},title:{},status:{default:void 0},date:{default:void 0},details:{default:()=>[]},requestId:{default:void 0},errorId:{default:void 0},stacktrace:{}},emits:["showMore"],setup(n,{emit:l}){const e=n,y=l,{copy:b,copied:P}=O({copiedDuring:3e3}),T=M(!1),I={year:"numeric",month:"short",day:"numeric",hour:"numeric",minute:"numeric",second:"numeric",hour12:!0},S=A(()=>new Intl.DateTimeFormat(void 0,I).format(e.date)),x=A(()=>{var g;let c="";(g=e.details)!=null&&g.length&&(e.details.length>1?c=`
${e.details.map(k=>`• ${k}`).join(`
`)}`:c=e.details[0]);let s=`${e.headline}

`;return s+=`${e.title}

`,s+=c?`Details: ${c}

`:"",e.status!==void 0&&(s+=`Status: ${e.status}
`),e.date&&(s+=`Date: ${S.value}
`),e.requestId&&(s+=`Request Id: ${e.requestId}
`),e.errorId&&(s+=`Error Id: ${e.errorId}
`),e.stacktrace&&(s+=`------
`,s+=`Stacktrace:

${e.stacktrace}
`),s}),j=()=>{b(x.value).catch(c=>{consola.error("Failed to copy to clipboard",{error:c})})},q=()=>{T.value=!0,y("showMore")};return(c,s)=>{var g;return p(),m("div",K,[a("div",Q,u(e.title),1),T.value?f("",!0):(p(),m("button",{key:0,class:"show-more",onClick:q}," Show details ")),T.value?(p(),m("div",Z,[(g=e.details)!=null&&g.length?(p(),m("div",_,[s[0]||(s[0]=a("strong",null,"Details: ",-1)),e.details.length==1?(p(),m($,{key:0},[i(u(e.details[0]),1)],64)):(p(),m("ul",tt,[(p(!0),m($,null,z(c.details,(C,k)=>(p(),m("li",{key:k},u(C),1))),128))]))])):f("",!0),c.status!==void 0?(p(),m("div",et,[s[1]||(s[1]=a("strong",null,"Status: ",-1)),i(u(c.status),1)])):f("",!0),c.date?(p(),m("div",ot,[s[2]||(s[2]=a("strong",null,"Date: ",-1)),i(u(S.value),1)])):f("",!0),c.requestId?(p(),m("div",st,[s[3]||(s[3]=a("strong",null,"Request id: ",-1)),i(u(c.requestId),1)])):f("",!0),c.errorId?(p(),m("div",at,[s[4]||(s[4]=a("strong",null,"Error id: ",-1)),i(u(c.errorId),1)])):f("",!0),c.stacktrace?(p(),m("div",it,s[5]||(s[5]=[a("strong",null,"Stacktrace: ",-1),i("Part of clipboard text ")]))):f("",!0),c.canCopyToClipboard?(p(),m("div",nt,[r(o(v),{onClick:j},{default:d(()=>[o(P)?(p(),m($,{key:0},[r(o(H),{class:"copy-icon"}),s[6]||(s[6]=i("Error was copied "))],64)):(p(),m($,{key:1},[r(o(J),{class:"copy-icon"}),s[7]||(s[7]=i("Copy error to clipboard "))],64))]),_:1})])):f("",!0)])):f("",!0)])}}}),ct=V(rt,[["__scopeId","data-v-0158aea8"]]);class U extends Error{constructor(e){super(e.title);E(this,"data");this.data=e}}const dt=({headline:n,rfcError:l,canCopyToClipboard:e=!0})=>{const{data:y}=l,b=L(ct,{headline:n,...y,canCopyToClipboard:e});return{type:"error",headline:n,component:b,autoRemove:!1}},lt=n=>{if(!n.response)return n;const l=n.response.headers.get("date")?new Date(n.response.headers.get("date")):void 0,e={title:n.data.title,details:n.data.details,status:n.statusCode,date:l,requestId:n.response.headers.get("x-request-id")??void 0,errorId:n.response.headers.get("x-error-id")??void 0};return new U(e)},D={toToast:dt,tryParse:lt,RFCError:U},pt={class:"grid-container"},mt={class:"grid-item-12"},ut={class:"grid-container"},vt={class:"wrapper"},ht={class:"grid-container"},ft={class:"wrapper"},gt={class:"grid-container"},wt={class:"wrapper"},yt={class:"grid-container"},bt={class:"grid-item-12"},Tt="",kt="",St=`
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
`,Ct=`
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
`,$t=`
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
`,Pt=`
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
`,xt=F({__name:"ToastService",setup(n){const{toasts:l,show:e,autoRemove:y,removeAll:b}=W(),P={type:"info",message:"This is an info toast."},T={type:"error",message:"This is an error toast."},I={type:"warning",message:"This is a warning toast."},S={type:"success",message:"This is a success toast."},x={type:"success",message:"This is a super massive toast with lots of text. ".repeat(10)},j={type:"success",message:"This is a persistent toast that needs to be manually dismissed.",autoRemove:!1},q={type:"success",headline:"This toast has no message"},c={type:"info",message:"This toast has a link as a button.",buttons:[{text:"Click me",href:"https://www.example.com"}]},s={type:"success",headline:"Secret toast",message:"Congratulations, you found me!"},g={type:"warning",message:"This toast has a callback as a button.",buttons:[{text:"Click me",callback:()=>e(s),icon:Y}]},C=new D.RFCError({title:"Could not load the workflow from the deployment. Check if the workflow version for this deployment is still available.",details:['Could not load workflow "/Users/some team/some space/workflowname" for deployment "cdf0fc54a-fasd123123-asd1234123-adfa123"','Something else happend with workflow "/Users/some team/some space/workflowname" for deployment "cdf0fc54a-fasd123123-asd1234123-adfa123"'],status:123,date:new Date,requestId:"134123212413412321241341",errorId:"abcdefg",stacktrace:"foo bar baz"}),k=D.toToast({headline:"Deployment could not be created",rfcError:C});return(jt,t)=>(p(),m("div",null,[t[30]||(t[30]=R('<section data-v-c8ac2cc1><div class="grid-container" data-v-c8ac2cc1><div class="grid-item-12" data-v-c8ac2cc1><p data-v-c8ac2cc1> This framework provides a simple and versatile API that enables the use of toast-style notifications. It&#39;s Vuex/Pinia-agnostic, Nuxt 3-ready, and supports both Composition API and Options API approaches. Multiple toast services can be used in the same project. A toast service is a combination of a reactive array of toast objects and methods for mutating the array. </p><p data-v-c8ac2cc1> You are able to import all of the public-facing components of the framework, including types, from <code data-v-c8ac2cc1>@knime/components</code>. </p><p data-v-c8ac2cc1> To use the toast service in your project, follow these steps (see the example section below for detailed coverage of various use-cases): </p><ol data-v-c8ac2cc1><li data-v-c8ac2cc1> Import and instantiate the <code data-v-c8ac2cc1>ToastServiceProvider</code> class in the <code data-v-c8ac2cc1>setup</code> section of the root component of your project (e.g. <code data-v-c8ac2cc1>App.vue</code>). The class instance will create a new toast service. </li><li data-v-c8ac2cc1> In the same <code data-v-c8ac2cc1>setup</code> section, provide the toast service to the downstream components of the application by calling the <code data-v-c8ac2cc1>toastServiceProvider.useToastService()</code> method. </li><li data-v-c8ac2cc1> Either in the root component, or in a downstream component, import the <code data-v-c8ac2cc1>ToastStack</code> component and place it in the <code data-v-c8ac2cc1>template</code> section. Currently, the stack is bound to the bottom left corner of its parent and the position is not adjustable. </li><li data-v-c8ac2cc1> Whenever a component needs to e.g. display a toast notification, import the <code data-v-c8ac2cc1>useToasts</code> composable, which returns the toast service object containing the <code data-v-c8ac2cc1>show</code> function. Make sure to call the composable in the <code data-v-c8ac2cc1>setup</code> section of the component. </li><li data-v-c8ac2cc1> Use the retrieved service properties, e.g. <code data-v-c8ac2cc1>show</code>, anywhere in the component to modify the toast stack. </li></ol></div></div></section>',1)),a("section",null,[a("div",pt,[a("div",mt,[t[24]||(t[24]=a("h4",null,"Interactive demo",-1)),t[25]||(t[25]=a("p",null," This application has a toast service integrated. You can see it in action by spawning toast notifications using the buttons below. ",-1)),a("p",null,[a("b",null,"Current number of toasts in the stack: "+u(o(l).length),1)]),t[26]||(t[26]=a("h5",null,"Basic examples",-1)),a("div",ut,[a("div",vt,[r(o(v),{"with-border":"",compact:"",onClick:t[0]||(t[0]=h=>o(e)(P))},{default:d(()=>t[12]||(t[12]=[i("Info toast")])),_:1}),r(o(v),{"with-border":"",compact:"",onClick:t[1]||(t[1]=h=>o(e)(T))},{default:d(()=>t[13]||(t[13]=[i("Error toast")])),_:1}),r(o(v),{"with-border":"",compact:"",onClick:t[2]||(t[2]=h=>o(e)(I))},{default:d(()=>t[14]||(t[14]=[i("Warning toast")])),_:1}),r(o(v),{"with-border":"",compact:"",onClick:t[3]||(t[3]=h=>o(e)(S))},{default:d(()=>t[15]||(t[15]=[i("Success toast")])),_:1})])]),t[27]||(t[27]=a("h5",null,"Additional features",-1)),a("div",ht,[a("div",ft,[r(o(v),{"with-border":"",compact:"",onClick:t[4]||(t[4]=h=>o(e)(x))},{default:d(()=>t[16]||(t[16]=[i("Toast with a truncated message")])),_:1}),r(o(v),{"with-border":"",compact:"",onClick:t[5]||(t[5]=h=>o(e)(j))},{default:d(()=>t[17]||(t[17]=[i("Persistent toast")])),_:1}),r(o(v),{"with-border":"",compact:"",onClick:t[6]||(t[6]=h=>o(e)(q))},{default:d(()=>t[18]||(t[18]=[i("Toast with only a headline")])),_:1}),r(o(v),{"with-border":"",compact:"",onClick:t[7]||(t[7]=h=>o(e)(c))},{default:d(()=>t[19]||(t[19]=[i("Toast with a hyperlink")])),_:1}),r(o(v),{"with-border":"",compact:"",onClick:t[8]||(t[8]=h=>o(e)(g))},{default:d(()=>t[20]||(t[20]=[i("Toast with a callback")])),_:1}),r(o(v),{"with-border":"",compact:"",onClick:t[9]||(t[9]=h=>o(e)(o(k)))},{default:d(()=>t[21]||(t[21]=[i("Toast with an api error")])),_:1})])]),t[28]||(t[28]=a("h5",null,"Stack control",-1)),a("div",gt,[a("div",wt,[r(o(v),{"with-border":"",compact:"",onClick:t[10]||(t[10]=h=>o(y)())},{default:d(()=>t[22]||(t[22]=[i("Remove toasts with timer")])),_:1}),r(o(v),{"with-border":"",compact:"",onClick:t[11]||(t[11]=h=>o(b)())},{default:d(()=>t[23]||(t[23]=[i("Remove all toasts")])),_:1})])])])])]),t[31]||(t[31]=R('<section data-v-c8ac2cc1><div class="grid-container" data-v-c8ac2cc1><div class="grid-item-12" data-v-c8ac2cc1><h4 data-v-c8ac2cc1>Usage guidelines</h4><p data-v-c8ac2cc1> To make the UX consistent, please try to adhere to the following usage guidelines: </p><ul data-v-c8ac2cc1><li data-v-c8ac2cc1> Omit periods from <code data-v-c8ac2cc1>headlines</code>, e.g. &quot;Action performed.&quot; -&gt; &quot;Action performed&quot;. </li><li data-v-c8ac2cc1>Ensure <code data-v-c8ac2cc1>messages</code> end with a period.</li><li data-v-c8ac2cc1> Use the <code data-v-c8ac2cc1>type</code> of the toast to convey success/error information, instead of explicitly stating it in the <code data-v-c8ac2cc1>headline</code>, e.g. &quot;Successfully created space&quot; -&gt; &quot;Space created&quot;. </li><li data-v-c8ac2cc1> Refrain from using &quot;was&quot; when referring to completed actions, e.g. &quot;Space was created&quot; -&gt; &quot;Space created&quot;. </li><li data-v-c8ac2cc1> Toasts with important information should be persistent, i.e. <code data-v-c8ac2cc1>autoRemove</code> set to <code data-v-c8ac2cc1>false</code>. </li></ul></div></div></section>',1)),a("section",null,[a("div",yt,[a("div",bt,[t[29]||(t[29]=a("h4",null,"Usage examples",-1)),r(w,{summary:"Show example of using via composables"},{default:d(()=>[i(u(St))]),_:1}),r(w,{summary:"Show example of using as plugin"},{default:d(()=>[i(u(Ct))]),_:1}),r(w,{summary:"Show example of using from a store"},{default:d(()=>[i(u($t))]),_:1}),r(w,{summary:"Show example of using multiple services via composables"},{default:d(()=>[i(u(Pt))]),_:1}),r(w,{summary:"Show example of using multiple services as plugin"},{default:d(()=>[i(u(It))]),_:1}),r(w,{summary:"Show toast-service.ts source code"},{default:d(()=>[i(u(Tt))]),_:1}),r(w,{summary:"Show types.ts source code"},{default:d(()=>[i(u(kt))]),_:1})])])])]))}}),Rt=V(xt,[["__scopeId","data-v-c8ac2cc1"]]);export{Rt as default};
