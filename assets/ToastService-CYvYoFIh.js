var M=Object.defineProperty;var H=(e,c,t)=>c in e?M(e,c,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[c]=t;var A=(e,c,t)=>H(e,typeof c!="symbol"?c+"":c,t);import{o as m,c as u,b as o,i as F,aM as L,j as z,U as D,t as d,m as C,F as $,e as a,g as W,d as n,w as r,u as s,aa as Y,G as p,p as V,f as N,_ as U,ab as G,aN as X,a as O,aO as J}from"./index-LDr8wY-6.js";import{C as f}from"./CodeExample-Bckx9qRZ.js";const K={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},Q=o("path",{d:"M11.672 7.407h17.312V29.5H11.672zm8.656 0V2.5H3.016v22.093h8.656V7.407z"},null,-1),Z=[Q];function tt(e,c){return m(),u("svg",K,[...Z])}const et={render:tt},S=e=>(V("data-v-19cbb98c"),e=e(),N(),e),ot={class:"wrapper"},st={class:"title"},at={key:1,class:"additional-info"},it={key:0,class:"details"},nt=S(()=>o("strong",null,"Details: ",-1)),rt={key:1,class:"details-list"},ct=S(()=>o("strong",null,"Status: ",-1)),dt=S(()=>o("strong",null,"Date: ",-1)),lt=S(()=>o("strong",null,"Request id: ",-1)),pt={key:1},mt=S(()=>o("strong",null,"Error id: ",-1)),ut={class:"copy-button-wrapper"},ht=F({__name:"RFCErrorToastTemplate",props:{headline:{},title:{},details:{},status:{},date:{},requestId:{},errorId:{}},emits:["showMore"],setup(e,{emit:c}){const t=e,w=c,{copy:I,copied:P}=L({copiedDuring:3e3}),y=z(!1),x={year:"numeric",month:"short",day:"numeric",hour:"numeric",minute:"numeric",second:"numeric",hour12:!0},k=D(()=>new Intl.DateTimeFormat(void 0,x).format(t.date)),j=D(()=>{var b;let l="";(b=t.details)!=null&&b.length&&(t.details.length>1?l=`
${t.details.map(T=>`• ${T}`).join(`
`)}`:l=t.details[0]);let v=`${t.headline}

`;return v+=`${t.title}

`,v+=l?`Details: ${l}

`:"",v+=`Status: ${t.status}
`,v+=`Date: ${k.value}
`,v+=`Request Id: ${t.requestId}
`,v+=t.errorId?`Error Id: ${t.errorId}
`:"",v}),E=()=>{I(j.value)},q=()=>{y.value=!0,w("showMore")};return(l,v)=>{var b;return m(),u("div",ot,[o("div",st,d(t.title),1),y.value?C("",!0):(m(),u("button",{key:0,class:"show-more",onClick:q}," Show details ")),y.value?(m(),u("div",at,[(b=t.details)!=null&&b.length?(m(),u("div",it,[nt,t.details.length==1?(m(),u($,{key:0},[a(d(t.details[0]),1)],64)):(m(),u("ul",rt,[(m(!0),u($,null,W(l.details,(_,T)=>(m(),u("li",{key:T},d(_),1))),128))]))])):C("",!0),o("div",null,[ct,a(d(l.status),1)]),o("div",null,[dt,a(d(k.value),1)]),o("div",null,[lt,a(d(l.requestId),1)]),l.errorId?(m(),u("div",pt,[mt,a(d(l.errorId),1)])):C("",!0),o("div",ut,[n(s(p),{onClick:E},{default:r(()=>[s(P)?(m(),u($,{key:0},[n(s(Y),{class:"copy-icon"}),a("Error was copied")],64)):(m(),u($,{key:1},[n(s(et),{class:"copy-icon"}),a("Copy error to clipboard ")],64))]),_:1})])])):C("",!0)])}}}),vt=U(ht,[["__scopeId","data-v-19cbb98c"]]);class B extends Error{constructor(t){super(t.title);A(this,"data");this.data=t}}const bt=({headline:e,rfcError:c})=>{const{data:t}=c,w=G(vt,{headline:e,...t});return{type:"error",headline:e,component:w,autoRemove:!1}},ft=e=>{if(!e.response)return e;const c=e.response.headers.get("date")?new Date(e.response.headers.get("date")):new Date,t={title:e.data.title,details:e.data.details,status:e.statusCode,date:c,requestId:e.response.headers.get("x-request-id")??"",errorId:e.response.headers.get("x-error-id")??void 0};return new B(t)},R={toToast:bt,tryParse:ft,RFCError:B},g=e=>(V("data-v-b57b52cd"),e=e(),N(),e),gt=O('<section data-v-b57b52cd><div class="grid-container" data-v-b57b52cd><div class="grid-item-12" data-v-b57b52cd><p data-v-b57b52cd> This framework provides a simple and versatile API that enables the use of toast-style notifications. It&#39;s Vuex/Pinia-agnostic, Nuxt 3-ready, and supports both Composition API and Options API approaches. Multiple toast services can be used in the same project. A toast service is a combination of a reactive array of toast objects and methods for mutating the array. </p><p data-v-b57b52cd> You are able to import all of the public-facing components of the framework, including types, from <code data-v-b57b52cd>@knime/components</code>. </p><p data-v-b57b52cd> To use the toast service in your project, follow these steps (see the example section below for detailed coverage of various use-cases): </p><ol data-v-b57b52cd><li data-v-b57b52cd> Import and instantiate the <code data-v-b57b52cd>ToastServiceProvider</code> class in the <code data-v-b57b52cd>setup</code> section of the root component of your project (e.g. <code data-v-b57b52cd>App.vue</code>). The class instance will create a new toast service. </li><li data-v-b57b52cd> In the same <code data-v-b57b52cd>setup</code> section, provide the toast service to the downstream components of the application by calling the <code data-v-b57b52cd>toastServiceProvider.useToastService()</code> method. </li><li data-v-b57b52cd> Either in the root component, or in a downstream component, import the <code data-v-b57b52cd>ToastStack</code> component and place it in the <code data-v-b57b52cd>template</code> section. Currently, the stack is bound to the bottom left corner of its parent and the position is not adjustable. </li><li data-v-b57b52cd> Whenever a component needs to e.g. display a toast notification, import the <code data-v-b57b52cd>useToasts</code> composable, which returns the toast service object containing the <code data-v-b57b52cd>show</code> function. Make sure to call the composable in the <code data-v-b57b52cd>setup</code> section of the component. </li><li data-v-b57b52cd> Use the retrieved service properties, e.g. <code data-v-b57b52cd>show</code>, anywhere in the component to modify the toast stack. </li></ol></div></div></section>',1),wt={class:"grid-container"},yt={class:"grid-item-12"},Tt=g(()=>o("h4",null,"Interactive demo",-1)),St=g(()=>o("p",null," This application has a toast service integrated. You can see it in action by spawning toast notifications using the buttons below. ",-1)),kt=g(()=>o("h5",null,"Basic examples",-1)),_t={class:"grid-container"},Ct={class:"wrapper"},$t=g(()=>o("h5",null,"Additional features",-1)),It={class:"grid-container"},Pt={class:"wrapper"},xt=g(()=>o("h5",null,"Stack control",-1)),jt={class:"grid-container"},Et={class:"wrapper"},qt=O('<section data-v-b57b52cd><div class="grid-container" data-v-b57b52cd><div class="grid-item-12" data-v-b57b52cd><h4 data-v-b57b52cd>Usage guidelines</h4><p data-v-b57b52cd> To make the UX consistent, please try to adhere to the following usage guidelines: </p><ul data-v-b57b52cd><li data-v-b57b52cd> Omit periods from <code data-v-b57b52cd>headlines</code>, e.g. &quot;Action performed.&quot; -&gt; &quot;Action performed&quot;. </li><li data-v-b57b52cd>Ensure <code data-v-b57b52cd>messages</code> end with a period.</li><li data-v-b57b52cd> Use the <code data-v-b57b52cd>type</code> of the toast to convey success/error information, instead of explicitly stating it in the <code data-v-b57b52cd>headline</code>, e.g. &quot;Successfully created space&quot; -&gt; &quot;Space created&quot;. </li><li data-v-b57b52cd> Refrain from using &quot;was&quot; when referring to completed actions, e.g. &quot;Space was created&quot; -&gt; &quot;Space created&quot;. </li><li data-v-b57b52cd> Toasts with important information should be persistent, i.e. <code data-v-b57b52cd>autoRemove</code> set to <code data-v-b57b52cd>false</code>. </li></ul></div></div></section>',1),At={class:"grid-container"},Dt={class:"grid-item-12"},Rt=g(()=>o("h4",null,"Usage examples",-1)),Ft="",Vt="",Nt=`
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
`,Ut=`
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
`,Ot=`
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
`,Bt=`
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
`,Mt=`
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
`,Ht=F({__name:"ToastService",setup(e){const{toasts:c,show:t,autoRemove:w,removeAll:I}=X(),P={type:"info",message:"This is an info toast."},y={type:"error",message:"This is an error toast."},x={type:"warning",message:"This is a warning toast."},k={type:"success",message:"This is a success toast."},j={type:"success",message:"This is a super massive toast with lots of text. ".repeat(10)},E={type:"success",message:"This is a persistent toast that needs to be manually dismissed.",autoRemove:!1},q={type:"success",headline:"This toast has no message"},l={type:"info",message:"This toast has a link as a button.",buttons:[{text:"Click me",href:"https://www.example.com"}]},v={type:"success",headline:"Secret toast",message:"Congratulations, you found me!"},b={type:"warning",message:"This toast has a callback as a button.",buttons:[{text:"Click me",callback:()=>t(v),icon:J}]},_=new R.RFCError({title:"Could not load the workflow from the deployment. Check if the workflow version for this deployment is still available.",details:['Could not load workflow "/Users/some team/some space/workflowname" for deployment "cdf0fc54a-fasd123123-asd1234123-adfa123"','Something else happend with workflow "/Users/some team/some space/workflowname" for deployment "cdf0fc54a-fasd123123-asd1234123-adfa123"'],status:123,date:new Date,requestId:"134123212413412321241341",errorId:"abcdefg"}),T=R.toToast({headline:"Deployment could not be created",rfcError:_});return(Lt,i)=>(m(),u("div",null,[gt,o("section",null,[o("div",wt,[o("div",yt,[Tt,St,o("p",null,[o("b",null,"Current number of toasts in the stack: "+d(s(c).length),1)]),kt,o("div",_t,[o("div",Ct,[n(s(p),{"with-border":"",compact:"",onClick:i[0]||(i[0]=h=>s(t)(P))},{default:r(()=>[a("Info toast")]),_:1}),n(s(p),{"with-border":"",compact:"",onClick:i[1]||(i[1]=h=>s(t)(y))},{default:r(()=>[a("Error toast")]),_:1}),n(s(p),{"with-border":"",compact:"",onClick:i[2]||(i[2]=h=>s(t)(x))},{default:r(()=>[a("Warning toast")]),_:1}),n(s(p),{"with-border":"",compact:"",onClick:i[3]||(i[3]=h=>s(t)(k))},{default:r(()=>[a("Success toast")]),_:1})])]),$t,o("div",It,[o("div",Pt,[n(s(p),{"with-border":"",compact:"",onClick:i[4]||(i[4]=h=>s(t)(j))},{default:r(()=>[a("Toast with a truncated message")]),_:1}),n(s(p),{"with-border":"",compact:"",onClick:i[5]||(i[5]=h=>s(t)(E))},{default:r(()=>[a("Persistent toast")]),_:1}),n(s(p),{"with-border":"",compact:"",onClick:i[6]||(i[6]=h=>s(t)(q))},{default:r(()=>[a("Toast with only a headline")]),_:1}),n(s(p),{"with-border":"",compact:"",onClick:i[7]||(i[7]=h=>s(t)(l))},{default:r(()=>[a("Toast with a hyperlink")]),_:1}),n(s(p),{"with-border":"",compact:"",onClick:i[8]||(i[8]=h=>s(t)(b))},{default:r(()=>[a("Toast with a callback")]),_:1}),n(s(p),{"with-border":"",compact:"",onClick:i[9]||(i[9]=h=>s(t)(s(T)))},{default:r(()=>[a("Toast with an api error")]),_:1})])]),xt,o("div",jt,[o("div",Et,[n(s(p),{"with-border":"",compact:"",onClick:i[10]||(i[10]=h=>s(w)())},{default:r(()=>[a("Remove toasts with timer")]),_:1}),n(s(p),{"with-border":"",compact:"",onClick:i[11]||(i[11]=h=>s(I)())},{default:r(()=>[a("Remove all toasts")]),_:1})])])])])]),qt,o("section",null,[o("div",At,[o("div",Dt,[Rt,n(f,{summary:"Show example of using via composables"},{default:r(()=>[a(d(Nt))]),_:1}),n(f,{summary:"Show example of using as plugin"},{default:r(()=>[a(d(Ut))]),_:1}),n(f,{summary:"Show example of using from a store"},{default:r(()=>[a(d(Ot))]),_:1}),n(f,{summary:"Show example of using multiple services via composables"},{default:r(()=>[a(d(Bt))]),_:1}),n(f,{summary:"Show example of using multiple services as plugin"},{default:r(()=>[a(d(Mt))]),_:1}),n(f,{summary:"Show toast-service.ts source code"},{default:r(()=>[a(d(Ft))]),_:1}),n(f,{summary:"Show types.ts source code"},{default:r(()=>[a(d(Vt))]),_:1})])])])]))}}),Gt=U(Ht,[["__scopeId","data-v-b57b52cd"]]);export{Gt as default};
