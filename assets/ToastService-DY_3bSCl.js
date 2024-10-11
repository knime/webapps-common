import{o as p,c as m,b as e,x as A,aG as B,$ as N,y as j,t as r,l as _,F as C,e as o,g as U,d as a,w as i,M as t,ac as O,p as q,f as E,_ as D,aH as H,ae as M,a as R,aI as L}from"./index-DPeWTVdU.js";import{C as f}from"./CodeExample-DpAz2xuT.js";import{B as d}from"./Button-DL-ywcl0.js";const z={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},W=e("path",{d:"M11.672 7.407h17.312V29.5H11.672zm8.656 0V2.5H3.016v22.093h8.656V7.407z"},null,-1),Y=[W];function G(h,n){return p(),m("svg",z,[...Y])}const X={render:G},T=h=>(q("data-v-e1cd4cec"),h=h(),E(),h),J={class:"wrapper"},K={class:"title"},Q={key:1,class:"additional-info"},Z={key:0,class:"details"},ee=T(()=>e("strong",null,"Details: ",-1)),te={key:1,class:"details-list"},oe=T(()=>e("strong",null,"Status: ",-1)),se=T(()=>e("strong",null,"Date: ",-1)),ae=T(()=>e("strong",null,"Request id: ",-1)),ie={key:1},ne=T(()=>e("strong",null,"Error id: ",-1)),re={class:"copy-button-wrapper"},ce=A({__name:"ApiErrorTemplate",props:{headline:{},title:{},details:{},status:{},date:{},requestId:{},errorId:{}},setup(h){const n=h,{copy:c,copied:$}=B({copiedDuring:3e3}),w=N(!1),I={year:"numeric",month:"short",day:"numeric",hour:"numeric",minute:"numeric",second:"numeric",hour12:!0},k=j(()=>new Intl.DateTimeFormat(void 0,I).format(n.date)),P=j(()=>{var b;let l="";(b=n.details)!=null&&b.length&&(n.details.length>1?l=`
${n.details.map(S=>`• ${S}`).join(`
`)}`:l=n.details[0]);let u=`${n.headline}

`;return u+=`${n.title}

`,u+=l?`Details: ${l}

`:"",u+=`Status: ${n.status}
`,u+=`Date: ${k.value}
`,u+=`Request Id: ${n.requestId}
`,u+=n.errorId?`Error Id: ${n.errorId}
`:"",u}),x=()=>{c(P.value)};return(l,u)=>{var b;return p(),m("div",J,[e("div",K,r(n.title),1),w.value?_("",!0):(p(),m("button",{key:0,class:"show-more",onClick:u[0]||(u[0]=y=>w.value=!0)}," Show details ")),w.value?(p(),m("div",Q,[(b=n.details)!=null&&b.length?(p(),m("div",Z,[ee,n.details.length==1?(p(),m(C,{key:0},[o(r(n.details[0]),1)],64)):(p(),m("ul",te,[(p(!0),m(C,null,U(l.details,(y,S)=>(p(),m("li",{key:S},r(y),1))),128))]))])):_("",!0),e("div",null,[oe,o(r(l.status),1)]),e("div",null,[se,o(r(k.value),1)]),e("div",null,[ae,o(r(l.requestId),1)]),l.errorId?(p(),m("div",ie,[ne,o(r(l.errorId),1)])):_("",!0),e("div",re,[a(t(d),{onClick:x},{default:i(()=>[t($)?(p(),m(C,{key:0},[a(t(O),{class:"check-icon"}),o("Error was copied")],64)):(p(),m(C,{key:1},[a(t(X),{class:"copy-icon"}),o("Copy error to clipboard ")],64))]),_:1})])])):_("",!0)])}}}),le=D(ce,[["__scopeId","data-v-e1cd4cec"]]),g=h=>(q("data-v-bb4314e9"),h=h(),E(),h),de=R('<section data-v-bb4314e9><div class="grid-container" data-v-bb4314e9><div class="grid-item-12" data-v-bb4314e9><p data-v-bb4314e9> This framework provides a simple and versatile API that enables the use of toast-style notifications. It&#39;s Vuex/Pinia-agnostic, Nuxt 3-ready, and supports both Composition API and Options API approaches. Multiple toast services can be used in the same project. A toast service is a combination of a reactive array of toast objects and methods for mutating the array. </p><p data-v-bb4314e9> You are able to import all of the public-facing components of the framework, including types, from <code data-v-bb4314e9>@knime/components</code>. </p><p data-v-bb4314e9> To use the toast service in your project, follow these steps (see the example section below for detailed coverage of various use-cases): </p><ol data-v-bb4314e9><li data-v-bb4314e9> Import and instantiate the <code data-v-bb4314e9>ToastServiceProvider</code> class in the <code data-v-bb4314e9>setup</code> section of the root component of your project (e.g. <code data-v-bb4314e9>App.vue</code>). The class instance will create a new toast service. </li><li data-v-bb4314e9> In the same <code data-v-bb4314e9>setup</code> section, provide the toast service to the downstream components of the application by calling the <code data-v-bb4314e9>toastServiceProvider.useToastService()</code> method. </li><li data-v-bb4314e9> Either in the root component, or in a downstream component, import the <code data-v-bb4314e9>ToastStack</code> component and place it in the <code data-v-bb4314e9>template</code> section. Currently, the stack is bound to the bottom left corner of its parent and the position is not adjustable. </li><li data-v-bb4314e9> Whenever a component needs to e.g. display a toast notification, import the <code data-v-bb4314e9>useToasts</code> composable, which returns the toast service object containing the <code data-v-bb4314e9>show</code> function. Make sure to call the composable in the <code data-v-bb4314e9>setup</code> section of the component. </li><li data-v-bb4314e9> Use the retrieved service properties, e.g. <code data-v-bb4314e9>show</code>, anywhere in the component to modify the toast stack. </li></ol></div></div></section>',1),pe={class:"grid-container"},me={class:"grid-item-12"},ue=g(()=>e("h4",null,"Interactive demo",-1)),he=g(()=>e("p",null," This application has a toast service integrated. You can see it in action by spawning toast notifications using the buttons below. ",-1)),ve=g(()=>e("h5",null,"Basic examples",-1)),be={class:"grid-container"},fe={class:"wrapper"},ge=g(()=>e("h5",null,"Additional features",-1)),we={class:"grid-container"},ye={class:"wrapper"},Se=g(()=>e("h5",null,"Stack control",-1)),Te={class:"grid-container"},ke={class:"wrapper"},_e=R('<section data-v-bb4314e9><div class="grid-container" data-v-bb4314e9><div class="grid-item-12" data-v-bb4314e9><h4 data-v-bb4314e9>Usage guidelines</h4><p data-v-bb4314e9> To make the UX consistent, please try to adhere to the following usage guidelines: </p><ul data-v-bb4314e9><li data-v-bb4314e9> Omit periods from <code data-v-bb4314e9>headlines</code>, e.g. &quot;Action performed.&quot; -&gt; &quot;Action performed&quot;. </li><li data-v-bb4314e9>Ensure <code data-v-bb4314e9>messages</code> end with a period.</li><li data-v-bb4314e9> Use the <code data-v-bb4314e9>type</code> of the toast to convey success/error information, instead of explicitly stating it in the <code data-v-bb4314e9>headline</code>, e.g. &quot;Successfully created space&quot; -&gt; &quot;Space created&quot;. </li><li data-v-bb4314e9> Refrain from using &quot;was&quot; when referring to completed actions, e.g. &quot;Space was created&quot; -&gt; &quot;Space created&quot;. </li><li data-v-bb4314e9> Toasts with important information should be persistent, i.e. <code data-v-bb4314e9>autoRemove</code> set to <code data-v-bb4314e9>false</code>. </li></ul></div></div></section>',1),Ce={class:"grid-container"},$e={class:"grid-item-12"},Ie=g(()=>e("h4",null,"Usage examples",-1)),Pe="",xe="",je=`
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
`,Ae=`
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
`,qe=`
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
`,Ee=`
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
`,De=`
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
`,Re=A({__name:"ToastService",setup(h){const{toasts:n,show:c,autoRemove:$,removeAll:w}=H(),I={type:"info",message:"This is an info toast."},k={type:"error",message:"This is an error toast."},P={type:"warning",message:"This is a warning toast."},x={type:"success",message:"This is a success toast."},l={type:"success",message:"This is a super massive toast with lots of text. ".repeat(10)},u={type:"success",message:"This is a persistent toast that needs to be manually dismissed.",autoRemove:!1},b={type:"success",headline:"This toast has no message"},y={type:"info",message:"This toast has a link as a button.",buttons:[{text:"Click me",href:"https://www.example.com"}]},S={type:"success",headline:"Secret toast",message:"Congratulations, you found me!"},V={type:"warning",message:"This toast has a callback as a button.",buttons:[{text:"Click me",callback:()=>c(S),icon:L}]},F={type:"error",headline:"Deployment could not be created",autoRemove:!1,component:M(le,{headline:"Deployment could not be created",title:"Could not load the workflow from the deployment. Check if the workflow version for this deployment is still available.",details:['Could not load workflow "/Users/some team/some space/workflowname" for deployment "cdf0fc54a-fasd123123-asd1234123-adfa123"','Something else happend with workflow "/Users/some team/some space/workflowname" for deployment "cdf0fc54a-fasd123123-asd1234123-adfa123"'],status:123,date:new Date,requestId:"134123212413412321241341",errorId:"abcdefg"})};return(Fe,s)=>(p(),m("div",null,[de,e("section",null,[e("div",pe,[e("div",me,[ue,he,e("p",null,[e("b",null,"Current number of toasts in the stack: "+r(t(n).length),1)]),ve,e("div",be,[e("div",fe,[a(t(d),{"with-border":"",compact:"",onClick:s[0]||(s[0]=v=>t(c)(I))},{default:i(()=>[o("Info toast")]),_:1}),a(t(d),{"with-border":"",compact:"",onClick:s[1]||(s[1]=v=>t(c)(k))},{default:i(()=>[o("Error toast")]),_:1}),a(t(d),{"with-border":"",compact:"",onClick:s[2]||(s[2]=v=>t(c)(P))},{default:i(()=>[o("Warning toast")]),_:1}),a(t(d),{"with-border":"",compact:"",onClick:s[3]||(s[3]=v=>t(c)(x))},{default:i(()=>[o("Success toast")]),_:1})])]),ge,e("div",we,[e("div",ye,[a(t(d),{"with-border":"",compact:"",onClick:s[4]||(s[4]=v=>t(c)(l))},{default:i(()=>[o("Toast with a truncated message")]),_:1}),a(t(d),{"with-border":"",compact:"",onClick:s[5]||(s[5]=v=>t(c)(u))},{default:i(()=>[o("Persistent toast")]),_:1}),a(t(d),{"with-border":"",compact:"",onClick:s[6]||(s[6]=v=>t(c)(b))},{default:i(()=>[o("Toast with only a headline")]),_:1}),a(t(d),{"with-border":"",compact:"",onClick:s[7]||(s[7]=v=>t(c)(y))},{default:i(()=>[o("Toast with a hyperlink")]),_:1}),a(t(d),{"with-border":"",compact:"",onClick:s[8]||(s[8]=v=>t(c)(V))},{default:i(()=>[o("Toast with a callback")]),_:1}),a(t(d),{"with-border":"",compact:"",onClick:s[9]||(s[9]=v=>t(c)(F))},{default:i(()=>[o("Toast with an api error")]),_:1})])]),Se,e("div",Te,[e("div",ke,[a(t(d),{"with-border":"",compact:"",onClick:s[10]||(s[10]=v=>t($)())},{default:i(()=>[o("Remove toasts with timer")]),_:1}),a(t(d),{"with-border":"",compact:"",onClick:s[11]||(s[11]=v=>t(w)())},{default:i(()=>[o("Remove all toasts")]),_:1})])])])])]),_e,e("section",null,[e("div",Ce,[e("div",$e,[Ie,a(f,{summary:"Show example of using via composables"},{default:i(()=>[o(r(je))]),_:1}),a(f,{summary:"Show example of using as plugin"},{default:i(()=>[o(r(Ae))]),_:1}),a(f,{summary:"Show example of using from a store"},{default:i(()=>[o(r(qe))]),_:1}),a(f,{summary:"Show example of using multiple services via composables"},{default:i(()=>[o(r(Ee))]),_:1}),a(f,{summary:"Show example of using multiple services as plugin"},{default:i(()=>[o(r(De))]),_:1}),a(f,{summary:"Show toast-service.ts source code"},{default:i(()=>[o(r(Pe))]),_:1}),a(f,{summary:"Show types.ts source code"},{default:i(()=>[o(r(xe))]),_:1})])])])]))}}),Oe=D(Re,[["__scopeId","data-v-bb4314e9"]]);export{Oe as default};
