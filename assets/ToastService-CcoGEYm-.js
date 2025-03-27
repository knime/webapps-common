var M=Object.defineProperty;var H=(t,c,e)=>c in t?M(t,c,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[c]=e;var A=(t,c,e)=>H(t,typeof c!="symbol"?c+"":c,e);import{o as m,c as u,b as o,i as F,aR as L,j as z,U as D,t as d,m as C,F as $,e as a,g as W,d as n,w as r,u as s,aa as Y,G as p,p as V,f as U,_ as N,ab as G,aS as X,a as B,aT as J}from"./index-CgG797fR.js";import{C as g}from"./CodeExample-ClQCB5jf.js";const K={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},Q=o("path",{d:"M11.672 7.407h17.312V29.5H11.672zm8.656 0V2.5H3.016v22.093h8.656V7.407z"},null,-1),Z=[Q];function ee(t,c){return m(),u("svg",K,[...Z])}const te={render:ee},S=t=>(V("data-v-19cbb98c"),t=t(),U(),t),oe={class:"wrapper"},se={class:"title"},ae={key:1,class:"additional-info"},ie={key:0,class:"details"},ne=S(()=>o("strong",null,"Details: ",-1)),re={key:1,class:"details-list"},ce=S(()=>o("strong",null,"Status: ",-1)),de=S(()=>o("strong",null,"Date: ",-1)),le=S(()=>o("strong",null,"Request id: ",-1)),pe={key:1},me=S(()=>o("strong",null,"Error id: ",-1)),ue={class:"copy-button-wrapper"},he=F({__name:"RFCErrorToastTemplate",props:{headline:{},title:{},details:{},status:{},date:{},requestId:{},errorId:{}},emits:["showMore"],setup(t,{emit:c}){const e=t,y=c,{copy:I,copied:P}=L({copiedDuring:3e3}),b=z(!1),x={year:"numeric",month:"short",day:"numeric",hour:"numeric",minute:"numeric",second:"numeric",hour12:!0},k=D(()=>new Intl.DateTimeFormat(void 0,x).format(e.date)),j=D(()=>{var f;let l="";(f=e.details)!=null&&f.length&&(e.details.length>1?l=`
${e.details.map(T=>`• ${T}`).join(`
`)}`:l=e.details[0]);let v=`${e.headline}

`;return v+=`${e.title}

`,v+=l?`Details: ${l}

`:"",v+=`Status: ${e.status}
`,v+=`Date: ${k.value}
`,v+=`Request Id: ${e.requestId}
`,v+=e.errorId?`Error Id: ${e.errorId}
`:"",v}),E=()=>{I(j.value)},q=()=>{b.value=!0,y("showMore")};return(l,v)=>{var f;return m(),u("div",oe,[o("div",se,d(e.title),1),b.value?C("",!0):(m(),u("button",{key:0,class:"show-more",onClick:q}," Show details ")),b.value?(m(),u("div",ae,[(f=e.details)!=null&&f.length?(m(),u("div",ie,[ne,e.details.length==1?(m(),u($,{key:0},[a(d(e.details[0]),1)],64)):(m(),u("ul",re,[(m(!0),u($,null,W(l.details,(_,T)=>(m(),u("li",{key:T},d(_),1))),128))]))])):C("",!0),o("div",null,[ce,a(d(l.status),1)]),o("div",null,[de,a(d(k.value),1)]),o("div",null,[le,a(d(l.requestId),1)]),l.errorId?(m(),u("div",pe,[me,a(d(l.errorId),1)])):C("",!0),o("div",ue,[n(s(p),{onClick:E},{default:r(()=>[s(P)?(m(),u($,{key:0},[n(s(Y),{class:"copy-icon"}),a("Error was copied")],64)):(m(),u($,{key:1},[n(s(te),{class:"copy-icon"}),a("Copy error to clipboard ")],64))]),_:1})])])):C("",!0)])}}}),ve=N(he,[["__scopeId","data-v-19cbb98c"]]);class O extends Error{constructor(e){super(e.title);A(this,"data");this.data=e}}const fe=({headline:t,rfcError:c})=>{const{data:e}=c,y=G(ve,{headline:t,...e});return{type:"error",headline:t,component:y,autoRemove:!1}},ge=t=>{if(!t.response)return t;const c=t.response.headers.get("date")?new Date(t.response.headers.get("date")):new Date,e={title:t.data.title,details:t.data.details,status:t.statusCode,date:c,requestId:t.response.headers.get("x-request-id")??"",errorId:t.response.headers.get("x-error-id")??void 0};return new O(e)},R={toToast:fe,tryParse:ge,RFCError:O},w=t=>(V("data-v-417ed56d"),t=t(),U(),t),we=B('<section data-v-417ed56d><div class="grid-container" data-v-417ed56d><div class="grid-item-12" data-v-417ed56d><p data-v-417ed56d> This framework provides a simple and versatile API that enables the use of toast-style notifications. It&#39;s Vuex/Pinia-agnostic, Nuxt 3-ready, and supports both Composition API and Options API approaches. Multiple toast services can be used in the same project. A toast service is a combination of a reactive array of toast objects and methods for mutating the array. </p><p data-v-417ed56d> You are able to import all of the public-facing components of the framework, including types, from <code data-v-417ed56d>@knime/components</code>. </p><p data-v-417ed56d> To use the toast service in your project, follow these steps (see the example section below for detailed coverage of various use-cases): </p><ol data-v-417ed56d><li data-v-417ed56d> Import and instantiate the <code data-v-417ed56d>ToastServiceProvider</code> class in the <code data-v-417ed56d>setup</code> section of the root component of your project (e.g. <code data-v-417ed56d>App.vue</code>). The class instance will create a new toast service. </li><li data-v-417ed56d> In the same <code data-v-417ed56d>setup</code> section, provide the toast service to the downstream components of the application by calling the <code data-v-417ed56d>toastServiceProvider.useToastService()</code> method. </li><li data-v-417ed56d> Either in the root component, or in a downstream component, import the <code data-v-417ed56d>ToastStack</code> component and place it in the <code data-v-417ed56d>template</code> section. Currently, the stack is bound to the bottom left corner of its parent and the position is not adjustable. </li><li data-v-417ed56d> Whenever a component needs to e.g. display a toast notification, import the <code data-v-417ed56d>useToasts</code> composable, which returns the toast service object containing the <code data-v-417ed56d>show</code> function. Make sure to call the composable in the <code data-v-417ed56d>setup</code> section of the component. </li><li data-v-417ed56d> Use the retrieved service properties, e.g. <code data-v-417ed56d>show</code>, anywhere in the component to modify the toast stack. </li></ol></div></div></section>',1),ye={class:"grid-container"},be={class:"grid-item-12"},Te=w(()=>o("h4",null,"Interactive demo",-1)),Se=w(()=>o("p",null," This application has a toast service integrated. You can see it in action by spawning toast notifications using the buttons below. ",-1)),ke=w(()=>o("h5",null,"Basic examples",-1)),_e={class:"grid-container"},Ce={class:"wrapper"},$e=w(()=>o("h5",null,"Additional features",-1)),Ie={class:"grid-container"},Pe={class:"wrapper"},xe=w(()=>o("h5",null,"Stack control",-1)),je={class:"grid-container"},Ee={class:"wrapper"},qe=B('<section data-v-417ed56d><div class="grid-container" data-v-417ed56d><div class="grid-item-12" data-v-417ed56d><h4 data-v-417ed56d>Usage guidelines</h4><p data-v-417ed56d> To make the UX consistent, please try to adhere to the following usage guidelines: </p><ul data-v-417ed56d><li data-v-417ed56d> Omit periods from <code data-v-417ed56d>headlines</code>, e.g. &quot;Action performed.&quot; -&gt; &quot;Action performed&quot;. </li><li data-v-417ed56d>Ensure <code data-v-417ed56d>messages</code> end with a period.</li><li data-v-417ed56d> Use the <code data-v-417ed56d>type</code> of the toast to convey success/error information, instead of explicitly stating it in the <code data-v-417ed56d>headline</code>, e.g. &quot;Successfully created space&quot; -&gt; &quot;Space created&quot;. </li><li data-v-417ed56d> Refrain from using &quot;was&quot; when referring to completed actions, e.g. &quot;Space was created&quot; -&gt; &quot;Space created&quot;. </li><li data-v-417ed56d> Toasts with important information should be persistent, i.e. <code data-v-417ed56d>autoRemove</code> set to <code data-v-417ed56d>false</code>. </li></ul></div></div></section>',1),Ae={class:"grid-container"},De={class:"grid-item-12"},Re=w(()=>o("h4",null,"Usage examples",-1)),Fe="",Ve="",Ue=`
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
`,Ne=`
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
`,Be=`
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
`,Oe=`
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
`,Me=`
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
`,He=F({__name:"ToastService",setup(t){const{toasts:c,show:e,autoRemove:y,removeAll:I}=X(),P={type:"info",message:"This is an info toast."},b={type:"error",message:"This is an error toast."},x={type:"warning",message:"This is a warning toast."},k={type:"success",message:"This is a success toast."},j={type:"success",message:"This is a super massive toast with lots of text. ".repeat(10)},E={type:"success",message:"This is a persistent toast that needs to be manually dismissed.",autoRemove:!1},q={type:"success",headline:"This toast has no message"},l={type:"info",message:"This toast has a link as a button.",buttons:[{text:"Click me",href:"https://www.example.com"}]},v={type:"success",headline:"Secret toast",message:"Congratulations, you found me!"},f={type:"warning",message:"This toast has a callback as a button.",buttons:[{text:"Click me",callback:()=>e(v),icon:J}]},_=new R.RFCError({title:"Could not load the workflow from the deployment. Check if the workflow version for this deployment is still available.",details:['Could not load workflow "/Users/some team/some space/workflowname" for deployment "cdf0fc54a-fasd123123-asd1234123-adfa123"','Something else happend with workflow "/Users/some team/some space/workflowname" for deployment "cdf0fc54a-fasd123123-asd1234123-adfa123"'],status:123,date:new Date,requestId:"134123212413412321241341",errorId:"abcdefg"}),T=R.toToast({headline:"Deployment could not be created",rfcError:_});return(Le,i)=>(m(),u("div",null,[we,o("section",null,[o("div",ye,[o("div",be,[Te,Se,o("p",null,[o("b",null,"Current number of toasts in the stack: "+d(s(c).length),1)]),ke,o("div",_e,[o("div",Ce,[n(s(p),{"with-border":"",compact:"",onClick:i[0]||(i[0]=h=>s(e)(P))},{default:r(()=>[a("Info toast")]),_:1}),n(s(p),{"with-border":"",compact:"",onClick:i[1]||(i[1]=h=>s(e)(b))},{default:r(()=>[a("Error toast")]),_:1}),n(s(p),{"with-border":"",compact:"",onClick:i[2]||(i[2]=h=>s(e)(x))},{default:r(()=>[a("Warning toast")]),_:1}),n(s(p),{"with-border":"",compact:"",onClick:i[3]||(i[3]=h=>s(e)(k))},{default:r(()=>[a("Success toast")]),_:1})])]),$e,o("div",Ie,[o("div",Pe,[n(s(p),{"with-border":"",compact:"",onClick:i[4]||(i[4]=h=>s(e)(j))},{default:r(()=>[a("Toast with a truncated message")]),_:1}),n(s(p),{"with-border":"",compact:"",onClick:i[5]||(i[5]=h=>s(e)(E))},{default:r(()=>[a("Persistent toast")]),_:1}),n(s(p),{"with-border":"",compact:"",onClick:i[6]||(i[6]=h=>s(e)(q))},{default:r(()=>[a("Toast with only a headline")]),_:1}),n(s(p),{"with-border":"",compact:"",onClick:i[7]||(i[7]=h=>s(e)(l))},{default:r(()=>[a("Toast with a hyperlink")]),_:1}),n(s(p),{"with-border":"",compact:"",onClick:i[8]||(i[8]=h=>s(e)(f))},{default:r(()=>[a("Toast with a callback")]),_:1}),n(s(p),{"with-border":"",compact:"",onClick:i[9]||(i[9]=h=>s(e)(s(T)))},{default:r(()=>[a("Toast with an api error")]),_:1})])]),xe,o("div",je,[o("div",Ee,[n(s(p),{"with-border":"",compact:"",onClick:i[10]||(i[10]=h=>s(y)())},{default:r(()=>[a("Remove toasts with timer")]),_:1}),n(s(p),{"with-border":"",compact:"",onClick:i[11]||(i[11]=h=>s(I)())},{default:r(()=>[a("Remove all toasts")]),_:1})])])])])]),qe,o("section",null,[o("div",Ae,[o("div",De,[Re,n(g,{summary:"Show example of using via composables"},{default:r(()=>[a(d(Ue))]),_:1}),n(g,{summary:"Show example of using as plugin"},{default:r(()=>[a(d(Ne))]),_:1}),n(g,{summary:"Show example of using from a store"},{default:r(()=>[a(d(Be))]),_:1}),n(g,{summary:"Show example of using multiple services via composables"},{default:r(()=>[a(d(Oe))]),_:1}),n(g,{summary:"Show example of using multiple services as plugin"},{default:r(()=>[a(d(Me))]),_:1}),n(g,{summary:"Show toast-service.ts source code"},{default:r(()=>[a(d(Fe))]),_:1}),n(g,{summary:"Show types.ts source code"},{default:r(()=>[a(d(Ve))]),_:1})])])])]))}}),Ge=N(He,[["__scopeId","data-v-417ed56d"]]);export{Ge as default};
