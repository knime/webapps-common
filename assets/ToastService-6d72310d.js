import{C as l}from"./CodeExample-da1e7865.js";import{B as i}from"./Button-5838e60b.js";import{q as _,a2 as j,o as I,c as A,b as t,t as p,X as n,d as o,w as s,e as a,a as u,a3 as N,p as R,f as $,_ as q}from"./index-1920ea22.js";const E=`import { ref, provide, inject, computed, getCurrentInstance } from "vue";
import type { App, Plugin } from "vue";
import { uniqueId, cloneDeep } from "lodash";
import type {
  Toast,
  ToastService,
  ToastServiceComposableOptions,
  UseToastsOptions,
} from "./types";

export const defaultToastServiceSymbol = Symbol("toast");
export const defaultGlobalPropertyName = "$toast";

export class ToastServiceError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "ToastServiceError";
  }
}

/**
 * Each instance of the class is bound to a reactive array of toasts, with which you
 * can interface via the properties of the \`ToastService\` object.
 *
 * You have the following options to access the toast service:
 * - \`provide\` the service object to downstream components by using the \`useToastService\`
 *   method in the \`setup\` of the app's root component;
 * - register the service object as a global property by getting a Plugin object via
 *   the \`getToastServicePlugin\` method, and binding it to the app via \`app.use(toastPlugin)\`
 *   in \`main.js/ts\`;
 * - get the toast service object directly via \`getToastServiceObject\` method.
 */
export class ToastServiceProvider {
  toasts = ref<Toast[]>([]);

  show = (toast: Toast): string => {
    const clonedToast = cloneDeep(toast);
    clonedToast.id = clonedToast.id
      ? \`\${clonedToast.id}-\${uniqueId()}\`
      : uniqueId();
    clonedToast.autoRemove = clonedToast.autoRemove ?? true;
    this.toasts.value.unshift(clonedToast);

    return clonedToast.id;
  };

  remove = (id: string): void => {
    this.toasts.value = this.toasts.value.filter(
      (toast: Toast) => toast.id !== id,
    );
  };

  autoRemove = (): void => {
    this.toasts.value = this.toasts.value.filter(
      (toast: Toast) => !toast.autoRemove,
    );
  };

  removeAll = (): void => {
    this.toasts.value = [];
  };

  readonlyToasts = computed(() => this.toasts.value);

  toastServiceObject: ToastService = {
    toasts: this.readonlyToasts,
    show: this.show,
    remove: this.remove,
    autoRemove: this.autoRemove,
    removeAll: this.removeAll,
  };

  /** Methods for accessing the toast service object */

  /**
   * A composable to be used in the app's root component's \`setup\`. Provides
   * the service object to downstream components of the app via Vue's dependency
   * injection, which can then be accessed via the \`useToasts\` composable.
   *
   * @example
   * toastServiceProvider.useToastService({ serviceSymbol: Symbol("customToastService") });
   */
  useToastService = ({
    serviceSymbol = defaultToastServiceSymbol as Symbol,
  }: ToastServiceComposableOptions = {}): void => {
    provide(serviceSymbol, this.toastServiceObject);
  };

  /**
   * Returns an object that can be used as a plugin with the \`app.use()\` syntax.
   * A custom \`propertyName\` property can be provided to be used as the global
   * property name instead of the default "$toast".
   *
   * @example
   * const toastPlugin = toastServiceProvider.getToastServicePlugin();
   * app.use(toastPlugin, {
   *    propertyName: "$customPropertyName" // "$toast" by default
   * })
   */
  getToastServicePlugin = (): Plugin => {
    return {
      install: (app: App, options?: { propertyName?: string }) => {
        const propertyName = options?.propertyName ?? defaultGlobalPropertyName;
        app.config.globalProperties[propertyName] = this.toastServiceObject;
      },
    };
  };

  /**
   * Returns the toast service object directly.
   */
  getToastServiceObject = (): ToastService => {
    return this.toastServiceObject;
  };
}

const useToastsFromSymbol = (serviceSymbol: Symbol): ToastService => {
  const toastService = inject<ToastService | null>(serviceSymbol, null);

  if (!toastService) {
    throw new ToastServiceError(
      \`No toast service found using the symbol \${serviceSymbol.toString()}.\`,
    );
  }

  return toastService;
};

const useToastsFromGlobalProperty = (propertyName: string): ToastService => {
  const toastService =
    getCurrentInstance()?.appContext.config.globalProperties[propertyName];

  if (!toastService) {
    throw new ToastServiceError(
      \`No toast service found using the global property name '\${propertyName}'.\`,
    );
  }

  return toastService;
};

/**
 * Retrieves the toast service object either from the global injection or from the app's
 * global property via the app instance. If you have multiple instances of the toast
 * service in the app, you can use different injection key symbols or global property
 * names to differentiate them.
 *
 * @example
 * import { useToasts } from "webapps-common/ui/services/toast";
 *
 * // Using default options (the app has a shared toast service between components)
 * const { show } = useToasts();
 *
 * // Using a specific symbol (multiple toast services running across the app)
 * const { show } = useToasts({ serviceSymbol: mySpecialSymbol });
 *
 * show({
 *    type: "success",
 *    message: "I am an example toast."
 * });
 */

export const useToasts = ({
  serviceSymbol,
  propertyName,
}: UseToastsOptions = {}): ToastService => {
  if (serviceSymbol && propertyName) {
    throw new ToastServiceError(
      "Please provide either a custom injection key symbol or a custom global property name, but not both.",
    );
  }

  if (!serviceSymbol && !propertyName) {
    try {
      return useToastsFromSymbol(defaultToastServiceSymbol);
    } catch (error) {
      return useToastsFromGlobalProperty(defaultGlobalPropertyName);
    }
  }

  if (serviceSymbol) {
    return useToastsFromSymbol(serviceSymbol);
  }

  if (propertyName) {
    return useToastsFromGlobalProperty(propertyName);
  }

  throw new ToastServiceError("No toast service found.");
};
`,O=`import type { ComputedRef, FunctionalComponent, SVGAttributes } from "vue";

type BaseToastButton = {
  /**
   * An optional callback function to be executed when the button is clicked.
   */
  callback?: () => void;
  /**
   * If provided, the button will act as a NuxtLink and navigate to the specified route.
   * Takes precedence over the \`href\` prop.
   */
  to?: string;
  /**
   * If provided, the button will act as a hyperlink directing to the given URL.
   * Only takes effect if \`to\` is not provided.
   */
  href?: string;
};

type ToastButtonWithIcon = {
  /**
   * The icon to be displayed alongside with, or instead of the button text.
   */
  icon: FunctionalComponent<SVGAttributes>;
  text?: string;
};

type ToastButtonWithText = {
  icon?: FunctionalComponent<SVGAttributes>;
  /**
   * The text content to be displayed on the button.
   */
  text: string;
};

export type ToastButton = BaseToastButton &
  (ToastButtonWithIcon | ToastButtonWithText);

export interface ToastStack {
  serviceSymbol?: Symbol | null;
  propertyName?: string | null;
}

export interface Toast {
  /**
   * Set to "info" by default.
   */
  type?: "error" | "warning" | "success" | "info";
  /**
   * If not specified, the type is used as the headline, e.g. "Info".
   */
  headline?: string;
  message?: string;
  buttons?: ToastButton[];
  /**
   * If set to true, the toast will have an animated progress bar indicating time before
   * being automatically dismissed.
   */
  autoRemove?: boolean;
  active?: boolean;
  id?: string;
  stackId?: string;
}

export interface ToastService {
  /**
   * Reactive array of Toast objects.
   */
  toasts: ComputedRef<Toast[]>;
  /**
   * Adds the provided Toast object to the \`toasts\` array.
   */
  show: (toast: Toast) => string;
  /**
   * Removes the specified Toast object from the \`toasts\` array.
   */
  remove: (id: string) => void;
  /**
   * Removes all Toast objects with \`autoRemove\` set to \`true\` from the \`toasts\` array.
   */
  autoRemove: () => void;
  /**
   * Removes all Toast objects from the \`toasts\` array.
   */
  removeAll: () => void;
}

export interface ToastServiceComposableOptions {
  /**
   * The Symbol for the toast service object properties to be bound to.
   */
  serviceSymbol?: Symbol;
}

export interface UseToastsOptions {
  /**
   * Custom Symbol to be used as the injection key.
   */
  serviceSymbol?: Symbol | null;

  /**
   * Custom global property name. "$toast" by default.
   */
  propertyName?: string | null;
}
`,d=m=>(R("data-v-9e5d5feb"),m=m(),$(),m),B=u('<section data-v-9e5d5feb><div class="grid-container" data-v-9e5d5feb><div class="grid-item-12" data-v-9e5d5feb><p data-v-9e5d5feb> This framework provides a simple and versatile API that enables the use of toast-style notifications. It&#39;s Vuex/Pinia-agnostic, Nuxt 3-ready, and supports both Composition API and Options API approaches. Multiple toast services can be used in the same project. A toast service is a combination of a reactive array of toast objects and methods for mutating the array. </p><p data-v-9e5d5feb> You are able to import all of the public-facing components of the framework, including types, from <code data-v-9e5d5feb>webapps-common/ui/services/toast</code>. </p><p data-v-9e5d5feb> To use the toast service in your project, follow these steps (see the example section below for detailed coverage of various use-cases): </p><ol data-v-9e5d5feb><li data-v-9e5d5feb> Import and instantiate the <code data-v-9e5d5feb>ToastServiceProvider</code> class in the <code data-v-9e5d5feb>setup</code> section of the root component of your project (e.g. <code data-v-9e5d5feb>App.vue</code>). The class instance will create a new toast service. </li><li data-v-9e5d5feb> In the same <code data-v-9e5d5feb>setup</code> section, provide the toast service to the downstream components of the application by calling the <code data-v-9e5d5feb>toastServiceProvider.useToastService()</code> method. </li><li data-v-9e5d5feb> Either in the root component, or in a downstream component, import the <code data-v-9e5d5feb>ToastStack</code> component and place it in the <code data-v-9e5d5feb>template</code> section. Currently, the stack is bound to the bottom left corner of its parent and the position is not adjustable. </li><li data-v-9e5d5feb> Whenever a component needs to e.g. display a toast notification, import the <code data-v-9e5d5feb>useToasts</code> composable, which returns the toast service object containing the <code data-v-9e5d5feb>show</code> function. Make sure to call the composable in the <code data-v-9e5d5feb>setup</code> section of the component. </li><li data-v-9e5d5feb> Use the retrieved service properties, e.g. <code data-v-9e5d5feb>show</code>, anywhere in the component to modify the toast stack. </li></ol></div></div></section>',1),F={class:"grid-container"},V={class:"grid-item-12"},U=d(()=>t("h4",null,"Interactive demo",-1)),G=d(()=>t("p",null," This application has a toast service integrated. You can see it in action by spawning toast notifications using the buttons below. ",-1)),W=d(()=>t("h5",null,"Basic examples",-1)),D={class:"grid-container"},M={class:"wrapper"},Y=d(()=>t("h5",null,"Additional features",-1)),L={class:"grid-container"},X={class:"wrapper"},H=d(()=>t("h5",null,"Stack control",-1)),z={class:"grid-container"},J={class:"wrapper"},K=u('<section data-v-9e5d5feb><div class="grid-container" data-v-9e5d5feb><div class="grid-item-12" data-v-9e5d5feb><h4 data-v-9e5d5feb>Usage guidelines</h4><p data-v-9e5d5feb> To make the UX consistent, please try to adhere to the following usage guidelines: </p><ul data-v-9e5d5feb><li data-v-9e5d5feb> Omit periods from <code data-v-9e5d5feb>headlines</code>, e.g. &quot;Action performed.&quot; -&gt; &quot;Action performed&quot;. </li><li data-v-9e5d5feb>Ensure <code data-v-9e5d5feb>messages</code> end with a period.</li><li data-v-9e5d5feb> Use the <code data-v-9e5d5feb>type</code> of the toast to convey success/error information, instead of explicitly stating it in the <code data-v-9e5d5feb>headline</code>, e.g. &quot;Successfully created space&quot; -&gt; &quot;Space created&quot;. </li><li data-v-9e5d5feb> Refrain from using &quot;was&quot; when referring to completed actions, e.g. &quot;Space was created&quot; -&gt; &quot;Space created&quot;. </li><li data-v-9e5d5feb> Toasts with important information should be persistent, i.e. <code data-v-9e5d5feb>autoRemove</code> set to <code data-v-9e5d5feb>false</code>. </li></ul></div></div></section>',1),Q={class:"grid-container"},Z={class:"grid-item-12"},ee=d(()=>t("h4",null,"Usage examples",-1)),te=`
  // App.vue (root component of a Vue 3-based project)
  <script setup lang="ts">
  import { ToastStack, ToastServiceProvider } from "webapps-common/ui/services/toast";

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
  import { useToasts, type Toast } from "webapps-common/ui/services/toast";

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
`,oe=`
  // main.ts (root script of a Vue 3-based project)
  import { ToastServiceProvider } from "webapps-common/ui/services/toast";

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
  import { ToastStack } from "webapps-common/ui/services/toast";
  <\/script>

  <template>
    <!-- place the ToastStack component where you want toasts to be rendered -->
    <ToastStack />
    <!-- the rest of the <template> -->
  </template>


  ------------------------------------
  // SomeChildComponent.vue
  <script lang="ts">
  import type { Toast } from "webapps-common/ui/services/toast";

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
`,se=`
  // main.ts (root script of a Vue 3-based project)
  import { ToastServiceProvider } from "webapps-common/ui/services/toast";

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
  import { ToastStack } from "webapps-common/ui/services/toast";
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
`,ae=`
  // someConfigFile.ts
  export const customSymbol = Symbol("customToastService");


  ------------------------------------
  // SomeComponent.vue
  <script setup lang="ts">
  import { customSymbol } from "./someConfigFile";
  import { ToastStack, ToastServiceProvider } from "webapps-common/ui/services/toast";

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
  import { useToasts, type Toast } from "webapps-common/ui/services/toast";

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
`,ne=`
  // main.ts
  import { ToastServiceProvider } from "webapps-common/ui/services/toast";

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
  import { ToastStack } from "webapps-common/ui/services/toast";
  <\/script>

  <template>
    <!-- pass the custom property name to the ToastStack -->
    <ToastStack :property-name:"$kombucha" />
    <!-- the rest of the <template> -->
  </template>


  ------------------------------------
  // SomeOtherComponent.vue
  <script lang="ts">
  import type { Toast } from "webapps-common/ui/services/toast";

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
`,ie=_({__name:"ToastService",setup(m){const{toasts:v,show:r,autoRemove:h,removeAll:b}=j(),f={type:"info",message:"This is an info toast."},y={type:"error",message:"This is an error toast."},g={type:"warning",message:"This is a warning toast."},S={type:"success",message:"This is a success toast."},T={type:"success",message:"This is a super massive toast with lots of text. ".repeat(10)},w={type:"success",message:"This is a persistent toast that needs to be manually dismissed.",autoRemove:!1},k={type:"success",headline:"This toast has no message"},P={type:"info",message:"This toast has a link as a button.",buttons:[{text:"Click me",href:"https://www.example.com"}]},C={type:"success",headline:"Secret toast",message:"Congratulations, you found me!"},x={type:"warning",message:"This toast has a callback as a button.",buttons:[{text:"Click me",callback:()=>r(C),icon:N}]};return(re,e)=>(I(),A("div",null,[B,t("section",null,[t("div",F,[t("div",V,[U,G,t("p",null,[t("b",null,"Current number of toasts in the stack: "+p(n(v).length),1)]),W,t("div",D,[t("div",M,[o(i,{"with-border":"",compact:"",onClick:e[0]||(e[0]=c=>n(r)(f))},{default:s(()=>[a("Info toast")]),_:1}),o(i,{"with-border":"",compact:"",onClick:e[1]||(e[1]=c=>n(r)(y))},{default:s(()=>[a("Error toast")]),_:1}),o(i,{"with-border":"",compact:"",onClick:e[2]||(e[2]=c=>n(r)(g))},{default:s(()=>[a("Warning toast")]),_:1}),o(i,{"with-border":"",compact:"",onClick:e[3]||(e[3]=c=>n(r)(S))},{default:s(()=>[a("Success toast")]),_:1})])]),Y,t("div",L,[t("div",X,[o(i,{"with-border":"",compact:"",onClick:e[4]||(e[4]=c=>n(r)(T))},{default:s(()=>[a("Toast with a truncated message")]),_:1}),o(i,{"with-border":"",compact:"",onClick:e[5]||(e[5]=c=>n(r)(w))},{default:s(()=>[a("Persistent toast")]),_:1}),o(i,{"with-border":"",compact:"",onClick:e[6]||(e[6]=c=>n(r)(k))},{default:s(()=>[a("Toast with only a headline")]),_:1}),o(i,{"with-border":"",compact:"",onClick:e[7]||(e[7]=c=>n(r)(P))},{default:s(()=>[a("Toast with a hyperlink")]),_:1}),o(i,{"with-border":"",compact:"",onClick:e[8]||(e[8]=c=>n(r)(x))},{default:s(()=>[a("Toast with a callback")]),_:1})])]),H,t("div",z,[t("div",J,[o(i,{"with-border":"",compact:"",onClick:e[9]||(e[9]=c=>n(h)())},{default:s(()=>[a("Remove toasts with timer")]),_:1}),o(i,{"with-border":"",compact:"",onClick:e[10]||(e[10]=c=>n(b)())},{default:s(()=>[a("Remove all toasts")]),_:1})])])])])]),K,t("section",null,[t("div",Q,[t("div",Z,[ee,o(l,{summary:"Show example of using via composables"},{default:s(()=>[a(p(te))]),_:1}),o(l,{summary:"Show example of using as plugin"},{default:s(()=>[a(p(oe))]),_:1}),o(l,{summary:"Show example of using from a store"},{default:s(()=>[a(p(se))]),_:1}),o(l,{summary:"Show example of using multiple services via composables"},{default:s(()=>[a(p(ae))]),_:1}),o(l,{summary:"Show example of using multiple services as plugin"},{default:s(()=>[a(p(ne))]),_:1}),o(l,{summary:"Show toast-service.ts source code"},{default:s(()=>[a(p(n(E)),1)]),_:1}),o(l,{summary:"Show types.ts source code"},{default:s(()=>[a(p(n(O)),1)]),_:1})])])])]))}});const de=q(ie,[["__scopeId","data-v-9e5d5feb"]]);export{de as default};
