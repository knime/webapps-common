import{C as g}from"./CodeExample-BwrfbvP0.js";import{o as f,c as u,b as t,x as j,ax as D,a1 as P,t as r,F as I,e as o,g as R,l as x,d as a,w as i,K as e,ay as V,ab as B,a as q,az as F,p as N,f as U,_ as O}from"./index-BAmV9QZ3.js";import{B as l}from"./Button-Bej0UFfm.js";const z={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},H=t("path",{d:"M11.672 7.407h17.312V29.5H11.672zm8.656 0V2.5H3.016v22.093h8.656V7.407z"},null,-1),L=[H];function M(h,n){return f(),u("svg",z,[...L])}const W={render:M},Y={class:"wrapper"},K={class:"title"},X={key:0,class:"details"},G=t("strong",null,"Details:",-1),J={key:1},Q=t("strong",null,"Status: ",-1),Z=t("strong",null,"Date: ",-1),tt=t("strong",null,"Request id: ",-1),et={key:1},ot=t("strong",null,"Error id: ",-1),st={class:"copy-button-wrapper"},at=j({__name:"ApiErrorTemplate",props:{title:{},details:{},status:{},date:{},requestId:{},errorId:{}},setup(h){const n=h,{copy:c,copied:S}=D({copiedDuring:3e3}),k={year:"numeric",month:"short",day:"numeric",hour:"numeric",minute:"numeric",second:"numeric",hour12:!0},b=P(()=>new Intl.DateTimeFormat(void 0,k).format(n.date)),_=P(()=>{var v;let d="";(v=n.details)!=null&&v.length&&(n.details.length>1?d=`
${n.details.map(y=>`• ${y}`).join(`
`)}`:d=n.details[0]);let m=`${n.title}

`;return m+=d?`Details: ${d}

`:"",m+=`Status: ${n.status}
`,m+=`Date: ${b.value}
`,m+=`Request Id: ${n.requestId}
`,m+=n.errorId?`Error Id: ${n.errorId}
`:"",m}),C=P(()=>S.value?"Error was copied":"Copy error to clipboard"),$=()=>{c(_.value)};return(d,m)=>{var v;return f(),u("div",Y,[t("div",K,r(n.title),1),(v=n.details)!=null&&v.length?(f(),u("div",X,[G,n.details.length==1?(f(),u(I,{key:0},[o(r(n.details[0]),1)],64)):(f(),u("ul",J,[(f(!0),u(I,null,R(d.details,(T,y)=>(f(),u("li",{key:y},r(T),1))),128))]))])):x("",!0),t("div",null,[Q,o(r(d.status),1)]),t("div",null,[Z,o(r(b.value),1)]),t("div",null,[tt,o(r(d.requestId),1)]),d.errorId?(f(),u("div",et,[ot,o(r(d.errorId),1)])):x("",!0),t("div",st,[a(e(l),{onClick:$},{default:i(()=>[a(e(W)),o(r(C.value),1)]),_:1})])])}}}),w=h=>(N("data-v-6fefcfd2"),h=h(),U(),h),it=q('<section data-v-6fefcfd2><div class="grid-container" data-v-6fefcfd2><div class="grid-item-12" data-v-6fefcfd2><p data-v-6fefcfd2> This framework provides a simple and versatile API that enables the use of toast-style notifications. It&#39;s Vuex/Pinia-agnostic, Nuxt 3-ready, and supports both Composition API and Options API approaches. Multiple toast services can be used in the same project. A toast service is a combination of a reactive array of toast objects and methods for mutating the array. </p><p data-v-6fefcfd2> You are able to import all of the public-facing components of the framework, including types, from <code data-v-6fefcfd2>@knime/components</code>. </p><p data-v-6fefcfd2> To use the toast service in your project, follow these steps (see the example section below for detailed coverage of various use-cases): </p><ol data-v-6fefcfd2><li data-v-6fefcfd2> Import and instantiate the <code data-v-6fefcfd2>ToastServiceProvider</code> class in the <code data-v-6fefcfd2>setup</code> section of the root component of your project (e.g. <code data-v-6fefcfd2>App.vue</code>). The class instance will create a new toast service. </li><li data-v-6fefcfd2> In the same <code data-v-6fefcfd2>setup</code> section, provide the toast service to the downstream components of the application by calling the <code data-v-6fefcfd2>toastServiceProvider.useToastService()</code> method. </li><li data-v-6fefcfd2> Either in the root component, or in a downstream component, import the <code data-v-6fefcfd2>ToastStack</code> component and place it in the <code data-v-6fefcfd2>template</code> section. Currently, the stack is bound to the bottom left corner of its parent and the position is not adjustable. </li><li data-v-6fefcfd2> Whenever a component needs to e.g. display a toast notification, import the <code data-v-6fefcfd2>useToasts</code> composable, which returns the toast service object containing the <code data-v-6fefcfd2>show</code> function. Make sure to call the composable in the <code data-v-6fefcfd2>setup</code> section of the component. </li><li data-v-6fefcfd2> Use the retrieved service properties, e.g. <code data-v-6fefcfd2>show</code>, anywhere in the component to modify the toast stack. </li></ol></div></div></section>',1),nt={class:"grid-container"},rt={class:"grid-item-12"},ct=w(()=>t("h4",null,"Interactive demo",-1)),dt=w(()=>t("p",null," This application has a toast service integrated. You can see it in action by spawning toast notifications using the buttons below. ",-1)),lt=w(()=>t("h5",null,"Basic examples",-1)),pt={class:"grid-container"},mt={class:"wrapper"},ft=w(()=>t("h5",null,"Additional features",-1)),ut={class:"grid-container"},ht={class:"wrapper"},vt=w(()=>t("h5",null,"Stack control",-1)),gt={class:"grid-container"},wt={class:"wrapper"},yt=q('<section data-v-6fefcfd2><div class="grid-container" data-v-6fefcfd2><div class="grid-item-12" data-v-6fefcfd2><h4 data-v-6fefcfd2>Usage guidelines</h4><p data-v-6fefcfd2> To make the UX consistent, please try to adhere to the following usage guidelines: </p><ul data-v-6fefcfd2><li data-v-6fefcfd2> Omit periods from <code data-v-6fefcfd2>headlines</code>, e.g. &quot;Action performed.&quot; -&gt; &quot;Action performed&quot;. </li><li data-v-6fefcfd2>Ensure <code data-v-6fefcfd2>messages</code> end with a period.</li><li data-v-6fefcfd2> Use the <code data-v-6fefcfd2>type</code> of the toast to convey success/error information, instead of explicitly stating it in the <code data-v-6fefcfd2>headline</code>, e.g. &quot;Successfully created space&quot; -&gt; &quot;Space created&quot;. </li><li data-v-6fefcfd2> Refrain from using &quot;was&quot; when referring to completed actions, e.g. &quot;Space was created&quot; -&gt; &quot;Space created&quot;. </li><li data-v-6fefcfd2> Toasts with important information should be persistent, i.e. <code data-v-6fefcfd2>autoRemove</code> set to <code data-v-6fefcfd2>false</code>. </li></ul></div></div></section>',1),bt={class:"grid-container"},Tt={class:"grid-item-12"},St=w(()=>t("h4",null,"Usage examples",-1)),kt="",_t="",Ct=`
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
`,$t=`
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
`,Pt=`
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
`,It=`
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
`,xt=`
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
`,jt=j({__name:"ToastService",setup(h){const{toasts:n,show:c,autoRemove:S,removeAll:k}=V(),b={type:"info",message:"This is an info toast."},_={type:"error",message:"This is an error toast."},C={type:"warning",message:"This is a warning toast."},$={type:"success",message:"This is a success toast."},d={type:"success",message:"This is a super massive toast with lots of text. ".repeat(10)},m={type:"success",message:"This is a persistent toast that needs to be manually dismissed.",autoRemove:!1},v={type:"success",headline:"This toast has no message"},T={type:"info",message:"This toast has a link as a button.",buttons:[{text:"Click me",href:"https://www.example.com"}]},y={type:"success",headline:"Secret toast",message:"Congratulations, you found me!"},A={type:"warning",message:"This toast has a callback as a button.",buttons:[{text:"Click me",callback:()=>c(y),icon:F}]},E={type:"error",headline:"Deployment could not be created",component:B(at,{title:"Could not load the workflow from the deployment. Check if the workflow version for this deployment is still available.",details:['Could not load workflow "/Users/some team/some space/workflowname" for deployment "cdf0fc54a-fasd123123-asd1234123-adfa123"','Something else happend with workflow "/Users/some team/some space/workflowname" for deployment "cdf0fc54a-fasd123123-asd1234123-adfa123"'],status:123,date:new Date,requestId:"134123212413412321241341",errorId:"abcdefg"}),width:400};return(At,s)=>(f(),u("div",null,[it,t("section",null,[t("div",nt,[t("div",rt,[ct,dt,t("p",null,[t("b",null,"Current number of toasts in the stack: "+r(e(n).length),1)]),lt,t("div",pt,[t("div",mt,[a(e(l),{"with-border":"",compact:"",onClick:s[0]||(s[0]=p=>e(c)(b))},{default:i(()=>[o("Info toast")]),_:1}),a(e(l),{"with-border":"",compact:"",onClick:s[1]||(s[1]=p=>e(c)(_))},{default:i(()=>[o("Error toast")]),_:1}),a(e(l),{"with-border":"",compact:"",onClick:s[2]||(s[2]=p=>e(c)(C))},{default:i(()=>[o("Warning toast")]),_:1}),a(e(l),{"with-border":"",compact:"",onClick:s[3]||(s[3]=p=>e(c)($))},{default:i(()=>[o("Success toast")]),_:1})])]),ft,t("div",ut,[t("div",ht,[a(e(l),{"with-border":"",compact:"",onClick:s[4]||(s[4]=p=>e(c)(d))},{default:i(()=>[o("Toast with a truncated message")]),_:1}),a(e(l),{"with-border":"",compact:"",onClick:s[5]||(s[5]=p=>e(c)(m))},{default:i(()=>[o("Persistent toast")]),_:1}),a(e(l),{"with-border":"",compact:"",onClick:s[6]||(s[6]=p=>e(c)(v))},{default:i(()=>[o("Toast with only a headline")]),_:1}),a(e(l),{"with-border":"",compact:"",onClick:s[7]||(s[7]=p=>e(c)(T))},{default:i(()=>[o("Toast with a hyperlink")]),_:1}),a(e(l),{"with-border":"",compact:"",onClick:s[8]||(s[8]=p=>e(c)(A))},{default:i(()=>[o("Toast with a callback")]),_:1}),a(e(l),{"with-border":"",compact:"",onClick:s[9]||(s[9]=p=>e(c)(E))},{default:i(()=>[o("Toast with an api error")]),_:1})])]),vt,t("div",gt,[t("div",wt,[a(e(l),{"with-border":"",compact:"",onClick:s[10]||(s[10]=p=>e(S)())},{default:i(()=>[o("Remove toasts with timer")]),_:1}),a(e(l),{"with-border":"",compact:"",onClick:s[11]||(s[11]=p=>e(k)())},{default:i(()=>[o("Remove all toasts")]),_:1})])])])])]),yt,t("section",null,[t("div",bt,[t("div",Tt,[St,a(g,{summary:"Show example of using via composables"},{default:i(()=>[o(r(Ct))]),_:1}),a(g,{summary:"Show example of using as plugin"},{default:i(()=>[o(r($t))]),_:1}),a(g,{summary:"Show example of using from a store"},{default:i(()=>[o(r(Pt))]),_:1}),a(g,{summary:"Show example of using multiple services via composables"},{default:i(()=>[o(r(It))]),_:1}),a(g,{summary:"Show example of using multiple services as plugin"},{default:i(()=>[o(r(xt))]),_:1}),a(g,{summary:"Show toast-service.ts source code"},{default:i(()=>[o(r(kt))]),_:1}),a(g,{summary:"Show types.ts source code"},{default:i(()=>[o(r(_t))]),_:1})])])])]))}}),Vt=O(jt,[["__scopeId","data-v-6fefcfd2"]]);export{Vt as default};
