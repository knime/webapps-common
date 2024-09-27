import{C as g}from"./CodeExample-gaZ3omaZ.js";import{o as u,c as h,b as t,x as A,aG as F,X as P,t as r,F as x,e as o,g as N,l as j,d as a,w as i,K as e,p as q,f as E,_ as D,aH as U,al as O,a as R,aI as H}from"./index-BLrOIlO2.js";import{B as l}from"./Button-BXRtrf2F.js";const L={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},M=t("path",{d:"M11.672 7.407h17.312V29.5H11.672zm8.656 0V2.5H3.016v22.093h8.656V7.407z"},null,-1),z=[M];function W(p,n){return u(),h("svg",L,[...z])}const X={render:W},b=p=>(q("data-v-76fbe9c0"),p=p(),E(),p),Y={class:"wrapper"},G={class:"title"},K={key:0,class:"details"},J=b(()=>t("strong",null,"Details:",-1)),Q={key:1},Z=b(()=>t("strong",null,"Status: ",-1)),tt=b(()=>t("strong",null,"Date: ",-1)),et=b(()=>t("strong",null,"Request id: ",-1)),ot={key:1},st=b(()=>t("strong",null,"Error id: ",-1)),at={class:"copy-button-wrapper"},it=A({__name:"ApiErrorTemplate",props:{title:{},details:{},status:{},date:{},requestId:{},errorId:{}},setup(p){const n=p,{copy:c,copied:k}=F({copiedDuring:3e3}),_={year:"numeric",month:"short",day:"numeric",hour:"numeric",minute:"numeric",second:"numeric",hour12:!0},T=P(()=>new Intl.DateTimeFormat(void 0,_).format(n.date)),C=P(()=>{var v;let d="";(v=n.details)!=null&&v.length&&(n.details.length>1?d=`
${n.details.map(y=>`• ${y}`).join(`
`)}`:d=n.details[0]);let f=`${n.title}

`;return f+=d?`Details: ${d}

`:"",f+=`Status: ${n.status}
`,f+=`Date: ${T.value}
`,f+=`Request Id: ${n.requestId}
`,f+=n.errorId?`Error Id: ${n.errorId}
`:"",f}),$=P(()=>k.value?"Error was copied":"Copy error to clipboard"),I=()=>{c(C.value)};return(d,f)=>{var v;return u(),h("div",Y,[t("div",G,r(n.title),1),(v=n.details)!=null&&v.length?(u(),h("div",K,[J,n.details.length==1?(u(),h(x,{key:0},[o(r(n.details[0]),1)],64)):(u(),h("ul",Q,[(u(!0),h(x,null,N(d.details,(S,y)=>(u(),h("li",{key:y},r(S),1))),128))]))])):j("",!0),t("div",null,[Z,o(r(d.status),1)]),t("div",null,[tt,o(r(T.value),1)]),t("div",null,[et,o(r(d.requestId),1)]),d.errorId?(u(),h("div",ot,[st,o(r(d.errorId),1)])):j("",!0),t("div",at,[a(e(l),{onClick:I},{default:i(()=>[a(e(X)),o(r($.value),1)]),_:1})])])}}}),nt=D(it,[["__scopeId","data-v-76fbe9c0"]]),w=p=>(q("data-v-6fefcfd2"),p=p(),E(),p),rt=R('<section data-v-6fefcfd2><div class="grid-container" data-v-6fefcfd2><div class="grid-item-12" data-v-6fefcfd2><p data-v-6fefcfd2> This framework provides a simple and versatile API that enables the use of toast-style notifications. It&#39;s Vuex/Pinia-agnostic, Nuxt 3-ready, and supports both Composition API and Options API approaches. Multiple toast services can be used in the same project. A toast service is a combination of a reactive array of toast objects and methods for mutating the array. </p><p data-v-6fefcfd2> You are able to import all of the public-facing components of the framework, including types, from <code data-v-6fefcfd2>@knime/components</code>. </p><p data-v-6fefcfd2> To use the toast service in your project, follow these steps (see the example section below for detailed coverage of various use-cases): </p><ol data-v-6fefcfd2><li data-v-6fefcfd2> Import and instantiate the <code data-v-6fefcfd2>ToastServiceProvider</code> class in the <code data-v-6fefcfd2>setup</code> section of the root component of your project (e.g. <code data-v-6fefcfd2>App.vue</code>). The class instance will create a new toast service. </li><li data-v-6fefcfd2> In the same <code data-v-6fefcfd2>setup</code> section, provide the toast service to the downstream components of the application by calling the <code data-v-6fefcfd2>toastServiceProvider.useToastService()</code> method. </li><li data-v-6fefcfd2> Either in the root component, or in a downstream component, import the <code data-v-6fefcfd2>ToastStack</code> component and place it in the <code data-v-6fefcfd2>template</code> section. Currently, the stack is bound to the bottom left corner of its parent and the position is not adjustable. </li><li data-v-6fefcfd2> Whenever a component needs to e.g. display a toast notification, import the <code data-v-6fefcfd2>useToasts</code> composable, which returns the toast service object containing the <code data-v-6fefcfd2>show</code> function. Make sure to call the composable in the <code data-v-6fefcfd2>setup</code> section of the component. </li><li data-v-6fefcfd2> Use the retrieved service properties, e.g. <code data-v-6fefcfd2>show</code>, anywhere in the component to modify the toast stack. </li></ol></div></div></section>',1),ct={class:"grid-container"},dt={class:"grid-item-12"},lt=w(()=>t("h4",null,"Interactive demo",-1)),pt=w(()=>t("p",null," This application has a toast service integrated. You can see it in action by spawning toast notifications using the buttons below. ",-1)),mt=w(()=>t("h5",null,"Basic examples",-1)),ft={class:"grid-container"},ut={class:"wrapper"},ht=w(()=>t("h5",null,"Additional features",-1)),vt={class:"grid-container"},gt={class:"wrapper"},wt=w(()=>t("h5",null,"Stack control",-1)),yt={class:"grid-container"},bt={class:"wrapper"},Tt=R('<section data-v-6fefcfd2><div class="grid-container" data-v-6fefcfd2><div class="grid-item-12" data-v-6fefcfd2><h4 data-v-6fefcfd2>Usage guidelines</h4><p data-v-6fefcfd2> To make the UX consistent, please try to adhere to the following usage guidelines: </p><ul data-v-6fefcfd2><li data-v-6fefcfd2> Omit periods from <code data-v-6fefcfd2>headlines</code>, e.g. &quot;Action performed.&quot; -&gt; &quot;Action performed&quot;. </li><li data-v-6fefcfd2>Ensure <code data-v-6fefcfd2>messages</code> end with a period.</li><li data-v-6fefcfd2> Use the <code data-v-6fefcfd2>type</code> of the toast to convey success/error information, instead of explicitly stating it in the <code data-v-6fefcfd2>headline</code>, e.g. &quot;Successfully created space&quot; -&gt; &quot;Space created&quot;. </li><li data-v-6fefcfd2> Refrain from using &quot;was&quot; when referring to completed actions, e.g. &quot;Space was created&quot; -&gt; &quot;Space created&quot;. </li><li data-v-6fefcfd2> Toasts with important information should be persistent, i.e. <code data-v-6fefcfd2>autoRemove</code> set to <code data-v-6fefcfd2>false</code>. </li></ul></div></div></section>',1),St={class:"grid-container"},kt={class:"grid-item-12"},_t=w(()=>t("h4",null,"Usage examples",-1)),Ct="",$t="",It=`
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
`,Pt=`
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
`,xt=`
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
`,jt=`
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
`,At=`
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
`,qt=A({__name:"ToastService",setup(p){const{toasts:n,show:c,autoRemove:k,removeAll:_}=U(),T={type:"info",message:"This is an info toast."},C={type:"error",message:"This is an error toast."},$={type:"warning",message:"This is a warning toast."},I={type:"success",message:"This is a success toast."},d={type:"success",message:"This is a super massive toast with lots of text. ".repeat(10)},f={type:"success",message:"This is a persistent toast that needs to be manually dismissed.",autoRemove:!1},v={type:"success",headline:"This toast has no message"},S={type:"info",message:"This toast has a link as a button.",buttons:[{text:"Click me",href:"https://www.example.com"}]},y={type:"success",headline:"Secret toast",message:"Congratulations, you found me!"},V={type:"warning",message:"This toast has a callback as a button.",buttons:[{text:"Click me",callback:()=>c(y),icon:H}]},B={type:"error",headline:"Deployment could not be created",component:O(nt,{title:"Could not load the workflow from the deployment. Check if the workflow version for this deployment is still available.",details:['Could not load workflow "/Users/some team/some space/workflowname" for deployment "cdf0fc54a-fasd123123-asd1234123-adfa123"','Something else happend with workflow "/Users/some team/some space/workflowname" for deployment "cdf0fc54a-fasd123123-asd1234123-adfa123"'],status:123,date:new Date,requestId:"134123212413412321241341",errorId:"abcdefg"}),width:400};return(Dt,s)=>(u(),h("div",null,[rt,t("section",null,[t("div",ct,[t("div",dt,[lt,pt,t("p",null,[t("b",null,"Current number of toasts in the stack: "+r(e(n).length),1)]),mt,t("div",ft,[t("div",ut,[a(e(l),{"with-border":"",compact:"",onClick:s[0]||(s[0]=m=>e(c)(T))},{default:i(()=>[o("Info toast")]),_:1}),a(e(l),{"with-border":"",compact:"",onClick:s[1]||(s[1]=m=>e(c)(C))},{default:i(()=>[o("Error toast")]),_:1}),a(e(l),{"with-border":"",compact:"",onClick:s[2]||(s[2]=m=>e(c)($))},{default:i(()=>[o("Warning toast")]),_:1}),a(e(l),{"with-border":"",compact:"",onClick:s[3]||(s[3]=m=>e(c)(I))},{default:i(()=>[o("Success toast")]),_:1})])]),ht,t("div",vt,[t("div",gt,[a(e(l),{"with-border":"",compact:"",onClick:s[4]||(s[4]=m=>e(c)(d))},{default:i(()=>[o("Toast with a truncated message")]),_:1}),a(e(l),{"with-border":"",compact:"",onClick:s[5]||(s[5]=m=>e(c)(f))},{default:i(()=>[o("Persistent toast")]),_:1}),a(e(l),{"with-border":"",compact:"",onClick:s[6]||(s[6]=m=>e(c)(v))},{default:i(()=>[o("Toast with only a headline")]),_:1}),a(e(l),{"with-border":"",compact:"",onClick:s[7]||(s[7]=m=>e(c)(S))},{default:i(()=>[o("Toast with a hyperlink")]),_:1}),a(e(l),{"with-border":"",compact:"",onClick:s[8]||(s[8]=m=>e(c)(V))},{default:i(()=>[o("Toast with a callback")]),_:1}),a(e(l),{"with-border":"",compact:"",onClick:s[9]||(s[9]=m=>e(c)(B))},{default:i(()=>[o("Toast with an api error")]),_:1})])]),wt,t("div",yt,[t("div",bt,[a(e(l),{"with-border":"",compact:"",onClick:s[10]||(s[10]=m=>e(k)())},{default:i(()=>[o("Remove toasts with timer")]),_:1}),a(e(l),{"with-border":"",compact:"",onClick:s[11]||(s[11]=m=>e(_)())},{default:i(()=>[o("Remove all toasts")]),_:1})])])])])]),Tt,t("section",null,[t("div",St,[t("div",kt,[_t,a(g,{summary:"Show example of using via composables"},{default:i(()=>[o(r(It))]),_:1}),a(g,{summary:"Show example of using as plugin"},{default:i(()=>[o(r(Pt))]),_:1}),a(g,{summary:"Show example of using from a store"},{default:i(()=>[o(r(xt))]),_:1}),a(g,{summary:"Show example of using multiple services via composables"},{default:i(()=>[o(r(jt))]),_:1}),a(g,{summary:"Show example of using multiple services as plugin"},{default:i(()=>[o(r(At))]),_:1}),a(g,{summary:"Show toast-service.ts source code"},{default:i(()=>[o(r(Ct))]),_:1}),a(g,{summary:"Show types.ts source code"},{default:i(()=>[o(r($t))]),_:1})])])])]))}}),Ft=D(qt,[["__scopeId","data-v-6fefcfd2"]]);export{Ft as default};
