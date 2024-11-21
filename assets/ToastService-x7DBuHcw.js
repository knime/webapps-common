import{o as d,c as p,b as e,i as D,aM as U,j as O,U as E,t as r,m as k,F as _,e as s,g as B,d as i,w as n,u as t,ah as M,G as l,p as R,f as V,_ as F,aN as H,ai as L,a as N,aO as z}from"./index-P7WMaXAv.js";import{C as b}from"./CodeExample-YOZfKAVw.js";const W={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},Y=e("path",{d:"M11.672 7.407h17.312V29.5H11.672zm8.656 0V2.5H3.016v22.093h8.656V7.407z"},null,-1),G=[Y];function X(m,S){return d(),p("svg",W,[...G])}const J={render:X},y=m=>(R("data-v-25fb0c61"),m=m(),V(),m),K={class:"wrapper"},Q={class:"title"},Z={key:1,class:"additional-info"},ee={key:0,class:"details"},te=y(()=>e("strong",null,"Details: ",-1)),oe={key:1,class:"details-list"},se=y(()=>e("strong",null,"Status: ",-1)),ae=y(()=>e("strong",null,"Date: ",-1)),ie=y(()=>e("strong",null,"Request id: ",-1)),ne={key:1},re=y(()=>e("strong",null,"Error id: ",-1)),ce={class:"copy-button-wrapper"},le=D({__name:"ApiErrorTemplate",props:{headline:{},title:{},details:{},status:{},date:{},requestId:{},errorId:{}},emits:["showMore"],setup(m,{emit:S}){const o=m,C=S,{copy:$,copied:I}=U({copiedDuring:3e3}),g=O(!1),P={year:"numeric",month:"short",day:"numeric",hour:"numeric",minute:"numeric",second:"numeric",hour12:!0},T=E(()=>new Intl.DateTimeFormat(void 0,P).format(o.date)),x=E(()=>{var v;let c="";(v=o.details)!=null&&v.length&&(o.details.length>1?c=`
${o.details.map(w=>`• ${w}`).join(`
`)}`:c=o.details[0]);let h=`${o.headline}

`;return h+=`${o.title}

`,h+=c?`Details: ${c}

`:"",h+=`Status: ${o.status}
`,h+=`Date: ${T.value}
`,h+=`Request Id: ${o.requestId}
`,h+=o.errorId?`Error Id: ${o.errorId}
`:"",h}),j=()=>{$(x.value)},A=()=>{g.value=!0,C("showMore")};return(c,h)=>{var v;return d(),p("div",K,[e("div",Q,r(o.title),1),g.value?k("",!0):(d(),p("button",{key:0,class:"show-more",onClick:A}," Show details ")),g.value?(d(),p("div",Z,[(v=o.details)!=null&&v.length?(d(),p("div",ee,[te,o.details.length==1?(d(),p(_,{key:0},[s(r(o.details[0]),1)],64)):(d(),p("ul",oe,[(d(!0),p(_,null,B(c.details,(q,w)=>(d(),p("li",{key:w},r(q),1))),128))]))])):k("",!0),e("div",null,[se,s(r(c.status),1)]),e("div",null,[ae,s(r(T.value),1)]),e("div",null,[ie,s(r(c.requestId),1)]),c.errorId?(d(),p("div",ne,[re,s(r(c.errorId),1)])):k("",!0),e("div",ce,[i(t(l),{onClick:j},{default:n(()=>[t(I)?(d(),p(_,{key:0},[i(t(M),{class:"copy-icon"}),s("Error was copied")],64)):(d(),p(_,{key:1},[i(t(J),{class:"copy-icon"}),s("Copy error to clipboard ")],64))]),_:1})])])):k("",!0)])}}}),de=F(le,[["__scopeId","data-v-25fb0c61"]]),f=m=>(R("data-v-bb4314e9"),m=m(),V(),m),pe=N('<section data-v-bb4314e9><div class="grid-container" data-v-bb4314e9><div class="grid-item-12" data-v-bb4314e9><p data-v-bb4314e9> This framework provides a simple and versatile API that enables the use of toast-style notifications. It&#39;s Vuex/Pinia-agnostic, Nuxt 3-ready, and supports both Composition API and Options API approaches. Multiple toast services can be used in the same project. A toast service is a combination of a reactive array of toast objects and methods for mutating the array. </p><p data-v-bb4314e9> You are able to import all of the public-facing components of the framework, including types, from <code data-v-bb4314e9>@knime/components</code>. </p><p data-v-bb4314e9> To use the toast service in your project, follow these steps (see the example section below for detailed coverage of various use-cases): </p><ol data-v-bb4314e9><li data-v-bb4314e9> Import and instantiate the <code data-v-bb4314e9>ToastServiceProvider</code> class in the <code data-v-bb4314e9>setup</code> section of the root component of your project (e.g. <code data-v-bb4314e9>App.vue</code>). The class instance will create a new toast service. </li><li data-v-bb4314e9> In the same <code data-v-bb4314e9>setup</code> section, provide the toast service to the downstream components of the application by calling the <code data-v-bb4314e9>toastServiceProvider.useToastService()</code> method. </li><li data-v-bb4314e9> Either in the root component, or in a downstream component, import the <code data-v-bb4314e9>ToastStack</code> component and place it in the <code data-v-bb4314e9>template</code> section. Currently, the stack is bound to the bottom left corner of its parent and the position is not adjustable. </li><li data-v-bb4314e9> Whenever a component needs to e.g. display a toast notification, import the <code data-v-bb4314e9>useToasts</code> composable, which returns the toast service object containing the <code data-v-bb4314e9>show</code> function. Make sure to call the composable in the <code data-v-bb4314e9>setup</code> section of the component. </li><li data-v-bb4314e9> Use the retrieved service properties, e.g. <code data-v-bb4314e9>show</code>, anywhere in the component to modify the toast stack. </li></ol></div></div></section>',1),me={class:"grid-container"},ue={class:"grid-item-12"},he=f(()=>e("h4",null,"Interactive demo",-1)),ve=f(()=>e("p",null," This application has a toast service integrated. You can see it in action by spawning toast notifications using the buttons below. ",-1)),be=f(()=>e("h5",null,"Basic examples",-1)),fe={class:"grid-container"},ge={class:"wrapper"},we=f(()=>e("h5",null,"Additional features",-1)),ye={class:"grid-container"},Se={class:"wrapper"},Te=f(()=>e("h5",null,"Stack control",-1)),ke={class:"grid-container"},_e={class:"wrapper"},Ce=N('<section data-v-bb4314e9><div class="grid-container" data-v-bb4314e9><div class="grid-item-12" data-v-bb4314e9><h4 data-v-bb4314e9>Usage guidelines</h4><p data-v-bb4314e9> To make the UX consistent, please try to adhere to the following usage guidelines: </p><ul data-v-bb4314e9><li data-v-bb4314e9> Omit periods from <code data-v-bb4314e9>headlines</code>, e.g. &quot;Action performed.&quot; -&gt; &quot;Action performed&quot;. </li><li data-v-bb4314e9>Ensure <code data-v-bb4314e9>messages</code> end with a period.</li><li data-v-bb4314e9> Use the <code data-v-bb4314e9>type</code> of the toast to convey success/error information, instead of explicitly stating it in the <code data-v-bb4314e9>headline</code>, e.g. &quot;Successfully created space&quot; -&gt; &quot;Space created&quot;. </li><li data-v-bb4314e9> Refrain from using &quot;was&quot; when referring to completed actions, e.g. &quot;Space was created&quot; -&gt; &quot;Space created&quot;. </li><li data-v-bb4314e9> Toasts with important information should be persistent, i.e. <code data-v-bb4314e9>autoRemove</code> set to <code data-v-bb4314e9>false</code>. </li></ul></div></div></section>',1),$e={class:"grid-container"},Ie={class:"grid-item-12"},Pe=f(()=>e("h4",null,"Usage examples",-1)),xe="",je="",Ae=`
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
`,qe=`
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
`,Ee=`
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
`,De=`
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
`,Re=`
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
`,Ve=D({__name:"ToastService",setup(m){const{toasts:S,show:o,autoRemove:C,removeAll:$}=H(),I={type:"info",message:"This is an info toast."},g={type:"error",message:"This is an error toast."},P={type:"warning",message:"This is a warning toast."},T={type:"success",message:"This is a success toast."},x={type:"success",message:"This is a super massive toast with lots of text. ".repeat(10)},j={type:"success",message:"This is a persistent toast that needs to be manually dismissed.",autoRemove:!1},A={type:"success",headline:"This toast has no message"},c={type:"info",message:"This toast has a link as a button.",buttons:[{text:"Click me",href:"https://www.example.com"}]},h={type:"success",headline:"Secret toast",message:"Congratulations, you found me!"},v={type:"warning",message:"This toast has a callback as a button.",buttons:[{text:"Click me",callback:()=>o(h),icon:z}]},w={type:"error",headline:"Deployment could not be created",autoRemove:!1,component:L(de,{headline:"Deployment could not be created",title:"Could not load the workflow from the deployment. Check if the workflow version for this deployment is still available.",details:['Could not load workflow "/Users/some team/some space/workflowname" for deployment "cdf0fc54a-fasd123123-asd1234123-adfa123"','Something else happend with workflow "/Users/some team/some space/workflowname" for deployment "cdf0fc54a-fasd123123-asd1234123-adfa123"'],status:123,date:new Date,requestId:"134123212413412321241341",errorId:"abcdefg"})};return(Fe,a)=>(d(),p("div",null,[pe,e("section",null,[e("div",me,[e("div",ue,[he,ve,e("p",null,[e("b",null,"Current number of toasts in the stack: "+r(t(S).length),1)]),be,e("div",fe,[e("div",ge,[i(t(l),{"with-border":"",compact:"",onClick:a[0]||(a[0]=u=>t(o)(I))},{default:n(()=>[s("Info toast")]),_:1}),i(t(l),{"with-border":"",compact:"",onClick:a[1]||(a[1]=u=>t(o)(g))},{default:n(()=>[s("Error toast")]),_:1}),i(t(l),{"with-border":"",compact:"",onClick:a[2]||(a[2]=u=>t(o)(P))},{default:n(()=>[s("Warning toast")]),_:1}),i(t(l),{"with-border":"",compact:"",onClick:a[3]||(a[3]=u=>t(o)(T))},{default:n(()=>[s("Success toast")]),_:1})])]),we,e("div",ye,[e("div",Se,[i(t(l),{"with-border":"",compact:"",onClick:a[4]||(a[4]=u=>t(o)(x))},{default:n(()=>[s("Toast with a truncated message")]),_:1}),i(t(l),{"with-border":"",compact:"",onClick:a[5]||(a[5]=u=>t(o)(j))},{default:n(()=>[s("Persistent toast")]),_:1}),i(t(l),{"with-border":"",compact:"",onClick:a[6]||(a[6]=u=>t(o)(A))},{default:n(()=>[s("Toast with only a headline")]),_:1}),i(t(l),{"with-border":"",compact:"",onClick:a[7]||(a[7]=u=>t(o)(c))},{default:n(()=>[s("Toast with a hyperlink")]),_:1}),i(t(l),{"with-border":"",compact:"",onClick:a[8]||(a[8]=u=>t(o)(v))},{default:n(()=>[s("Toast with a callback")]),_:1}),i(t(l),{"with-border":"",compact:"",onClick:a[9]||(a[9]=u=>t(o)(w))},{default:n(()=>[s("Toast with an api error")]),_:1})])]),Te,e("div",ke,[e("div",_e,[i(t(l),{"with-border":"",compact:"",onClick:a[10]||(a[10]=u=>t(C)())},{default:n(()=>[s("Remove toasts with timer")]),_:1}),i(t(l),{"with-border":"",compact:"",onClick:a[11]||(a[11]=u=>t($)())},{default:n(()=>[s("Remove all toasts")]),_:1})])])])])]),Ce,e("section",null,[e("div",$e,[e("div",Ie,[Pe,i(b,{summary:"Show example of using via composables"},{default:n(()=>[s(r(Ae))]),_:1}),i(b,{summary:"Show example of using as plugin"},{default:n(()=>[s(r(qe))]),_:1}),i(b,{summary:"Show example of using from a store"},{default:n(()=>[s(r(Ee))]),_:1}),i(b,{summary:"Show example of using multiple services via composables"},{default:n(()=>[s(r(De))]),_:1}),i(b,{summary:"Show example of using multiple services as plugin"},{default:n(()=>[s(r(Re))]),_:1}),i(b,{summary:"Show toast-service.ts source code"},{default:n(()=>[s(r(xe))]),_:1}),i(b,{summary:"Show types.ts source code"},{default:n(()=>[s(r(je))]),_:1})])])])]))}}),Oe=F(Ve,[["__scopeId","data-v-bb4314e9"]]);export{Oe as default};
