import{c as l,o as d,b as a,h as _,aV as V,i as B,R as q,l as f,t as m,F as C,e as i,f as N,d as r,w as c,u as o,aa as U,C as v,_ as R,ab as O,aW as M,a as E,aX as z}from"./index-DRvYTa_0.js";import{C as g}from"./CodeExample-WcEVHjl5.js";const H={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"};function L(p,u){return d(),l("svg",H,u[0]||(u[0]=[a("path",{d:"M11.672 7.407h17.312V29.5H11.672zm8.656 0V2.5H3.016v22.093h8.656V7.407z"},null,-1)]))}const W={render:L},X={class:"wrapper"},Y={class:"title"},G={key:1,class:"additional-info"},J={key:0,class:"details"},K={key:1,class:"details-list"},Q={key:1},Z={key:2},tt={key:3},et={key:4},ot={key:5},st={key:6,class:"copy-button-wrapper"},at=_({__name:"RFCErrorToastTemplate",props:{headline:{},canCopyToClipboard:{type:Boolean,default:!0},title:{},status:{default:void 0},date:{default:void 0},details:{default:()=>[]},requestId:{default:void 0},errorId:{default:void 0},stacktrace:{}},emits:["showMore"],setup(p,{emit:u}){const e=p,w=u,{copy:y,copied:$}=V({copiedDuring:3e3}),b=B(!1),P={year:"numeric",month:"short",day:"numeric",hour:"numeric",minute:"numeric",second:"numeric",hour12:!0},T=q(()=>new Intl.DateTimeFormat(void 0,P).format(e.date)),I=q(()=>{let n="";e.details?.length&&(e.details.length>1?n=`
${e.details.map(k=>`• ${k}`).join(`
`)}`:n=e.details[0]);let s=`${e.headline}

`;return s+=`${e.title}

`,s+=n?`Details: ${n}

`:"",e.status!==void 0&&(s+=`Status: ${e.status}
`),e.date&&(s+=`Date: ${T.value}
`),e.requestId&&(s+=`Request Id: ${e.requestId}
`),e.errorId&&(s+=`Error Id: ${e.errorId}
`),e.stacktrace&&(s+=`------
`,s+=`Stacktrace:

${e.stacktrace}
`),s}),x=()=>{y(I.value).catch(n=>{consola.error("Failed to copy to clipboard",{error:n})})},j=()=>{b.value=!0,w("showMore")};return(n,s)=>(d(),l("div",X,[a("div",Y,m(e.title),1),b.value?f("",!0):(d(),l("button",{key:0,class:"show-more",onClick:j}," Show details ")),b.value?(d(),l("div",G,[e.details?.length?(d(),l("div",J,[s[0]||(s[0]=a("strong",null,"Details: ",-1)),e.details.length==1?(d(),l(C,{key:0},[i(m(e.details[0]),1)],64)):(d(),l("ul",K,[(d(!0),l(C,null,N(n.details,(S,k)=>(d(),l("li",{key:k},m(S),1))),128))]))])):f("",!0),n.status!==void 0?(d(),l("div",Q,[s[1]||(s[1]=a("strong",null,"Status: ",-1)),i(m(n.status),1)])):f("",!0),n.date?(d(),l("div",Z,[s[2]||(s[2]=a("strong",null,"Date: ",-1)),i(m(T.value),1)])):f("",!0),n.requestId?(d(),l("div",tt,[s[3]||(s[3]=a("strong",null,"Request id: ",-1)),i(m(n.requestId),1)])):f("",!0),n.errorId?(d(),l("div",et,[s[4]||(s[4]=a("strong",null,"Error id: ",-1)),i(m(n.errorId),1)])):f("",!0),n.stacktrace?(d(),l("div",ot,s[5]||(s[5]=[a("strong",null,"Stacktrace: ",-1),i("Part of clipboard text ",-1)]))):f("",!0),n.canCopyToClipboard?(d(),l("div",st,[r(o(v),{onClick:x},{default:c(()=>[o($)?(d(),l(C,{key:0},[r(o(U),{class:"copy-icon"}),s[6]||(s[6]=i("Error was copied ",-1))],64)):(d(),l(C,{key:1},[r(o(W),{class:"copy-icon"}),s[7]||(s[7]=i("Copy error to clipboard ",-1))],64))]),_:1})])):f("",!0)])):f("",!0)]))}}),it=R(at,[["__scopeId","data-v-0158aea8"]]);class D extends Error{data;constructor(u){super(u.title),this.data=u}}const rt=({headline:p,rfcError:u,canCopyToClipboard:e=!0})=>{const{data:w}=u,y=O(it,{headline:p,...w,canCopyToClipboard:e});return{type:"error",headline:p,component:y,autoRemove:!1}},nt=p=>{if(!p.response)return p;const u=p.response.headers.get("date")?new Date(p.response.headers.get("date")):void 0,e={title:p.data.title,details:p.data.details,status:p.statusCode,date:u,requestId:p.response.headers.get("x-request-id")??void 0,errorId:p.response.headers.get("x-error-id")??void 0};return new D(e)},A={toToast:rt,tryParse:nt,RFCError:D},ct={class:"grid-container"},lt={class:"grid-item-12"},dt={class:"grid-container"},pt={class:"wrapper"},mt={class:"grid-container"},ut={class:"wrapper"},vt={class:"grid-container"},ht={class:"wrapper"},ft={class:"grid-container"},gt={class:"grid-item-12"},wt="",yt="",bt=`
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
`,kt=`
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
`,Tt=`
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
`,St=`
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
`,Ct=`
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
`,$t=_({__name:"ToastService",setup(p){const{toasts:u,show:e,autoRemove:w,removeAll:y}=M(),$={type:"info",message:"This is an info toast."},b={type:"error",message:"This is an error toast."},P={type:"warning",message:"This is a warning toast."},T={type:"success",message:"This is a success toast."},I={type:"success",message:"This is a super massive toast with lots of text. ".repeat(10)},x={type:"success",message:"This is a persistent toast that needs to be manually dismissed.",autoRemove:!1},j={type:"success",headline:"This toast has no message"},n={type:"info",message:"This toast has a link as a button.",buttons:[{text:"Click me",href:"https://www.example.com"}]},s={type:"success",headline:"Secret toast",message:"Congratulations, you found me!"},S={type:"warning",message:"This toast has a callback as a button.",buttons:[{text:"Click me",callback:()=>e(s),icon:z}]},k=new A.RFCError({title:"Could not load the workflow from the deployment. Check if the workflow version for this deployment is still available.",details:['Could not load workflow "/Users/some team/some space/workflowname" for deployment "cdf0fc54a-fasd123123-asd1234123-adfa123"','Something else happend with workflow "/Users/some team/some space/workflowname" for deployment "cdf0fc54a-fasd123123-asd1234123-adfa123"'],status:123,date:new Date,requestId:"134123212413412321241341",errorId:"abcdefg",stacktrace:"foo bar baz"}),F=A.toToast({headline:"Deployment could not be created",rfcError:k});return(Pt,t)=>(d(),l("div",null,[t[30]||(t[30]=E('<section data-v-c8ac2cc1><div class="grid-container" data-v-c8ac2cc1><div class="grid-item-12" data-v-c8ac2cc1><p data-v-c8ac2cc1> This framework provides a simple and versatile API that enables the use of toast-style notifications. It&#39;s Vuex/Pinia-agnostic, Nuxt 3-ready, and supports both Composition API and Options API approaches. Multiple toast services can be used in the same project. A toast service is a combination of a reactive array of toast objects and methods for mutating the array. </p><p data-v-c8ac2cc1> You are able to import all of the public-facing components of the framework, including types, from <code data-v-c8ac2cc1>@knime/components</code>. </p><p data-v-c8ac2cc1> To use the toast service in your project, follow these steps (see the example section below for detailed coverage of various use-cases): </p><ol data-v-c8ac2cc1><li data-v-c8ac2cc1> Import and instantiate the <code data-v-c8ac2cc1>ToastServiceProvider</code> class in the <code data-v-c8ac2cc1>setup</code> section of the root component of your project (e.g. <code data-v-c8ac2cc1>App.vue</code>). The class instance will create a new toast service. </li><li data-v-c8ac2cc1> In the same <code data-v-c8ac2cc1>setup</code> section, provide the toast service to the downstream components of the application by calling the <code data-v-c8ac2cc1>toastServiceProvider.useToastService()</code> method. </li><li data-v-c8ac2cc1> Either in the root component, or in a downstream component, import the <code data-v-c8ac2cc1>ToastStack</code> component and place it in the <code data-v-c8ac2cc1>template</code> section. Currently, the stack is bound to the bottom left corner of its parent and the position is not adjustable. </li><li data-v-c8ac2cc1> Whenever a component needs to e.g. display a toast notification, import the <code data-v-c8ac2cc1>useToasts</code> composable, which returns the toast service object containing the <code data-v-c8ac2cc1>show</code> function. Make sure to call the composable in the <code data-v-c8ac2cc1>setup</code> section of the component. </li><li data-v-c8ac2cc1> Use the retrieved service properties, e.g. <code data-v-c8ac2cc1>show</code>, anywhere in the component to modify the toast stack. </li></ol></div></div></section>',1)),a("section",null,[a("div",ct,[a("div",lt,[t[24]||(t[24]=a("h4",null,"Interactive demo",-1)),t[25]||(t[25]=a("p",null," This application has a toast service integrated. You can see it in action by spawning toast notifications using the buttons below. ",-1)),a("p",null,[a("b",null,"Current number of toasts in the stack: "+m(o(u).length),1)]),t[26]||(t[26]=a("h5",null,"Basic examples",-1)),a("div",dt,[a("div",pt,[r(o(v),{"with-border":"",compact:"",onClick:t[0]||(t[0]=h=>o(e)($))},{default:c(()=>t[12]||(t[12]=[i("Info toast",-1)])),_:1,__:[12]}),r(o(v),{"with-border":"",compact:"",onClick:t[1]||(t[1]=h=>o(e)(b))},{default:c(()=>t[13]||(t[13]=[i("Error toast",-1)])),_:1,__:[13]}),r(o(v),{"with-border":"",compact:"",onClick:t[2]||(t[2]=h=>o(e)(P))},{default:c(()=>t[14]||(t[14]=[i("Warning toast",-1)])),_:1,__:[14]}),r(o(v),{"with-border":"",compact:"",onClick:t[3]||(t[3]=h=>o(e)(T))},{default:c(()=>t[15]||(t[15]=[i("Success toast",-1)])),_:1,__:[15]})])]),t[27]||(t[27]=a("h5",null,"Additional features",-1)),a("div",mt,[a("div",ut,[r(o(v),{"with-border":"",compact:"",onClick:t[4]||(t[4]=h=>o(e)(I))},{default:c(()=>t[16]||(t[16]=[i("Toast with a truncated message",-1)])),_:1,__:[16]}),r(o(v),{"with-border":"",compact:"",onClick:t[5]||(t[5]=h=>o(e)(x))},{default:c(()=>t[17]||(t[17]=[i("Persistent toast",-1)])),_:1,__:[17]}),r(o(v),{"with-border":"",compact:"",onClick:t[6]||(t[6]=h=>o(e)(j))},{default:c(()=>t[18]||(t[18]=[i("Toast with only a headline",-1)])),_:1,__:[18]}),r(o(v),{"with-border":"",compact:"",onClick:t[7]||(t[7]=h=>o(e)(n))},{default:c(()=>t[19]||(t[19]=[i("Toast with a hyperlink",-1)])),_:1,__:[19]}),r(o(v),{"with-border":"",compact:"",onClick:t[8]||(t[8]=h=>o(e)(S))},{default:c(()=>t[20]||(t[20]=[i("Toast with a callback",-1)])),_:1,__:[20]}),r(o(v),{"with-border":"",compact:"",onClick:t[9]||(t[9]=h=>o(e)(o(F)))},{default:c(()=>t[21]||(t[21]=[i("Toast with an api error",-1)])),_:1,__:[21]})])]),t[28]||(t[28]=a("h5",null,"Stack control",-1)),a("div",vt,[a("div",ht,[r(o(v),{"with-border":"",compact:"",onClick:t[10]||(t[10]=h=>o(w)())},{default:c(()=>t[22]||(t[22]=[i("Remove toasts with timer",-1)])),_:1,__:[22]}),r(o(v),{"with-border":"",compact:"",onClick:t[11]||(t[11]=h=>o(y)())},{default:c(()=>t[23]||(t[23]=[i("Remove all toasts",-1)])),_:1,__:[23]})])])])])]),t[31]||(t[31]=E('<section data-v-c8ac2cc1><div class="grid-container" data-v-c8ac2cc1><div class="grid-item-12" data-v-c8ac2cc1><h4 data-v-c8ac2cc1>Usage guidelines</h4><p data-v-c8ac2cc1> To make the UX consistent, please try to adhere to the following usage guidelines: </p><ul data-v-c8ac2cc1><li data-v-c8ac2cc1> Omit periods from <code data-v-c8ac2cc1>headlines</code>, e.g. &quot;Action performed.&quot; -&gt; &quot;Action performed&quot;. </li><li data-v-c8ac2cc1>Ensure <code data-v-c8ac2cc1>messages</code> end with a period.</li><li data-v-c8ac2cc1> Use the <code data-v-c8ac2cc1>type</code> of the toast to convey success/error information, instead of explicitly stating it in the <code data-v-c8ac2cc1>headline</code>, e.g. &quot;Successfully created space&quot; -&gt; &quot;Space created&quot;. </li><li data-v-c8ac2cc1> Refrain from using &quot;was&quot; when referring to completed actions, e.g. &quot;Space was created&quot; -&gt; &quot;Space created&quot;. </li><li data-v-c8ac2cc1> Toasts with important information should be persistent, i.e. <code data-v-c8ac2cc1>autoRemove</code> set to <code data-v-c8ac2cc1>false</code>. </li></ul></div></div></section>',1)),a("section",null,[a("div",ft,[a("div",gt,[t[29]||(t[29]=a("h4",null,"Usage examples",-1)),r(g,{summary:"Show example of using via composables"},{default:c(()=>[i(m(bt))]),_:1}),r(g,{summary:"Show example of using as plugin"},{default:c(()=>[i(m(kt))]),_:1}),r(g,{summary:"Show example of using from a store"},{default:c(()=>[i(m(Tt))]),_:1}),r(g,{summary:"Show example of using multiple services via composables"},{default:c(()=>[i(m(St))]),_:1}),r(g,{summary:"Show example of using multiple services as plugin"},{default:c(()=>[i(m(Ct))]),_:1}),r(g,{summary:"Show toast-service.ts source code"},{default:c(()=>[i(m(wt))]),_:1}),r(g,{summary:"Show types.ts source code"},{default:c(()=>[i(m(yt))]),_:1})])])])]))}}),jt=R($t,[["__scopeId","data-v-c8ac2cc1"]]);export{jt as default};
