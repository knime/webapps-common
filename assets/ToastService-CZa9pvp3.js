import{C as l}from"./CodeExample-BDLpTtDe.js";import{u as x,as as j,o as I,c as A,b as o,t as p,P as t,d as s,w as a,e as i,a as u,at as $,p as q,f as E,_ as R}from"./index-APhx44S2.js";import{B as n}from"./Button-o9IXSY75.js";const m=d=>(q("data-v-9605ea43"),d=d(),E(),d),V=u('<section data-v-9605ea43><div class="grid-container" data-v-9605ea43><div class="grid-item-12" data-v-9605ea43><p data-v-9605ea43> This framework provides a simple and versatile API that enables the use of toast-style notifications. It&#39;s Vuex/Pinia-agnostic, Nuxt 3-ready, and supports both Composition API and Options API approaches. Multiple toast services can be used in the same project. A toast service is a combination of a reactive array of toast objects and methods for mutating the array. </p><p data-v-9605ea43> You are able to import all of the public-facing components of the framework, including types, from <code data-v-9605ea43>@knime/components</code>. </p><p data-v-9605ea43> To use the toast service in your project, follow these steps (see the example section below for detailed coverage of various use-cases): </p><ol data-v-9605ea43><li data-v-9605ea43> Import and instantiate the <code data-v-9605ea43>ToastServiceProvider</code> class in the <code data-v-9605ea43>setup</code> section of the root component of your project (e.g. <code data-v-9605ea43>App.vue</code>). The class instance will create a new toast service. </li><li data-v-9605ea43> In the same <code data-v-9605ea43>setup</code> section, provide the toast service to the downstream components of the application by calling the <code data-v-9605ea43>toastServiceProvider.useToastService()</code> method. </li><li data-v-9605ea43> Either in the root component, or in a downstream component, import the <code data-v-9605ea43>ToastStack</code> component and place it in the <code data-v-9605ea43>template</code> section. Currently, the stack is bound to the bottom left corner of its parent and the position is not adjustable. </li><li data-v-9605ea43> Whenever a component needs to e.g. display a toast notification, import the <code data-v-9605ea43>useToasts</code> composable, which returns the toast service object containing the <code data-v-9605ea43>show</code> function. Make sure to call the composable in the <code data-v-9605ea43>setup</code> section of the component. </li><li data-v-9605ea43> Use the retrieved service properties, e.g. <code data-v-9605ea43>show</code>, anywhere in the component to modify the toast stack. </li></ol></div></div></section>',1),B={class:"grid-container"},N={class:"grid-item-12"},O=m(()=>o("h4",null,"Interactive demo",-1)),U=m(()=>o("p",null," This application has a toast service integrated. You can see it in action by spawning toast notifications using the buttons below. ",-1)),D=m(()=>o("h5",null,"Basic examples",-1)),F={class:"grid-container"},M={class:"wrapper"},W=m(()=>o("h5",null,"Additional features",-1)),Y={class:"grid-container"},H={class:"wrapper"},X=m(()=>o("h5",null,"Stack control",-1)),z={class:"grid-container"},G={class:"wrapper"},J=u('<section data-v-9605ea43><div class="grid-container" data-v-9605ea43><div class="grid-item-12" data-v-9605ea43><h4 data-v-9605ea43>Usage guidelines</h4><p data-v-9605ea43> To make the UX consistent, please try to adhere to the following usage guidelines: </p><ul data-v-9605ea43><li data-v-9605ea43> Omit periods from <code data-v-9605ea43>headlines</code>, e.g. &quot;Action performed.&quot; -&gt; &quot;Action performed&quot;. </li><li data-v-9605ea43>Ensure <code data-v-9605ea43>messages</code> end with a period.</li><li data-v-9605ea43> Use the <code data-v-9605ea43>type</code> of the toast to convey success/error information, instead of explicitly stating it in the <code data-v-9605ea43>headline</code>, e.g. &quot;Successfully created space&quot; -&gt; &quot;Space created&quot;. </li><li data-v-9605ea43> Refrain from using &quot;was&quot; when referring to completed actions, e.g. &quot;Space was created&quot; -&gt; &quot;Space created&quot;. </li><li data-v-9605ea43> Toasts with important information should be persistent, i.e. <code data-v-9605ea43>autoRemove</code> set to <code data-v-9605ea43>false</code>. </li></ul></div></div></section>',1),K={class:"grid-container"},L={class:"grid-item-12"},Q=m(()=>o("h4",null,"Usage examples",-1)),Z="",tt="",et=`
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
`,ot=`
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
`,st=`
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
`,at=`
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
`,it=`
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
`,nt=x({__name:"ToastService",setup(d){const{toasts:h,show:r,autoRemove:v,removeAll:f}=j(),g={type:"info",message:"This is an info toast."},b={type:"error",message:"This is an error toast."},w={type:"warning",message:"This is a warning toast."},S={type:"success",message:"This is a success toast."},T={type:"success",message:"This is a super massive toast with lots of text. ".repeat(10)},y={type:"success",message:"This is a persistent toast that needs to be manually dismissed.",autoRemove:!1},k={type:"success",headline:"This toast has no message"},_={type:"info",message:"This toast has a link as a button.",buttons:[{text:"Click me",href:"https://www.example.com"}]},C={type:"success",headline:"Secret toast",message:"Congratulations, you found me!"},P={type:"warning",message:"This toast has a callback as a button.",buttons:[{text:"Click me",callback:()=>r(C),icon:$}]};return(rt,e)=>(I(),A("div",null,[V,o("section",null,[o("div",B,[o("div",N,[O,U,o("p",null,[o("b",null,"Current number of toasts in the stack: "+p(t(h).length),1)]),D,o("div",F,[o("div",M,[s(t(n),{"with-border":"",compact:"",onClick:e[0]||(e[0]=c=>t(r)(g))},{default:a(()=>[i("Info toast")]),_:1}),s(t(n),{"with-border":"",compact:"",onClick:e[1]||(e[1]=c=>t(r)(b))},{default:a(()=>[i("Error toast")]),_:1}),s(t(n),{"with-border":"",compact:"",onClick:e[2]||(e[2]=c=>t(r)(w))},{default:a(()=>[i("Warning toast")]),_:1}),s(t(n),{"with-border":"",compact:"",onClick:e[3]||(e[3]=c=>t(r)(S))},{default:a(()=>[i("Success toast")]),_:1})])]),W,o("div",Y,[o("div",H,[s(t(n),{"with-border":"",compact:"",onClick:e[4]||(e[4]=c=>t(r)(T))},{default:a(()=>[i("Toast with a truncated message")]),_:1}),s(t(n),{"with-border":"",compact:"",onClick:e[5]||(e[5]=c=>t(r)(y))},{default:a(()=>[i("Persistent toast")]),_:1}),s(t(n),{"with-border":"",compact:"",onClick:e[6]||(e[6]=c=>t(r)(k))},{default:a(()=>[i("Toast with only a headline")]),_:1}),s(t(n),{"with-border":"",compact:"",onClick:e[7]||(e[7]=c=>t(r)(_))},{default:a(()=>[i("Toast with a hyperlink")]),_:1}),s(t(n),{"with-border":"",compact:"",onClick:e[8]||(e[8]=c=>t(r)(P))},{default:a(()=>[i("Toast with a callback")]),_:1})])]),X,o("div",z,[o("div",G,[s(t(n),{"with-border":"",compact:"",onClick:e[9]||(e[9]=c=>t(v)())},{default:a(()=>[i("Remove toasts with timer")]),_:1}),s(t(n),{"with-border":"",compact:"",onClick:e[10]||(e[10]=c=>t(f)())},{default:a(()=>[i("Remove all toasts")]),_:1})])])])])]),J,o("section",null,[o("div",K,[o("div",L,[Q,s(l,{summary:"Show example of using via composables"},{default:a(()=>[i(p(et))]),_:1}),s(l,{summary:"Show example of using as plugin"},{default:a(()=>[i(p(ot))]),_:1}),s(l,{summary:"Show example of using from a store"},{default:a(()=>[i(p(st))]),_:1}),s(l,{summary:"Show example of using multiple services via composables"},{default:a(()=>[i(p(at))]),_:1}),s(l,{summary:"Show example of using multiple services as plugin"},{default:a(()=>[i(p(it))]),_:1}),s(l,{summary:"Show toast-service.ts source code"},{default:a(()=>[i(p(Z))]),_:1}),s(l,{summary:"Show types.ts source code"},{default:a(()=>[i(p(tt))]),_:1})])])])]))}}),mt=R(nt,[["__scopeId","data-v-9605ea43"]]);export{mt as default};
