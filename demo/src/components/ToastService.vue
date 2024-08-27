<script setup lang="ts">
import CodeExample from "./demo/CodeExample.vue";
import { ApiErrorTemplate, Button } from "@knime/components";
import Interactive from "@knime/styles/img/icons/interactive.svg";
// @ts-ignore
import { useToasts, type Toast } from "@knime/components";
import { h } from "vue";

// import toastServiceCode from "@knime/components/toastService?raw";
// import typesCode from "@knime/components/types?raw";
const toastServiceCode = "";
const typesCode = "";

const composableCodeExample = `
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
`;

const pluginCodeExample = `
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
`;

const storeCodeExample = `
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
`;

const multipleServicesComposableCodeExample = `
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
`;

const multipleServicesPluginCodeExample = `
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
`;

// Inject the toast service
const { toasts, show, autoRemove, removeAll } = useToasts();

// Toast types: info, error, warning, success
const infoToast: Toast = {
  type: "info",
  message: "This is an info toast.",
};

const errorToast: Toast = {
  type: "error",
  message: "This is an error toast.",
};

const warningToast: Toast = {
  type: "warning",
  message: "This is a warning toast.",
};

const successToast: Toast = {
  type: "success",
  message: "This is a success toast.",
};

// Additional features: message truncation, persistence, headline-only, buttons
const truncatedToast: Toast = {
  type: "success",
  message: "This is a super massive toast with lots of text. ".repeat(10), // eslint-disable-line no-magic-numbers
};

const persistentToast: Toast = {
  type: "success",
  message: "This is a persistent toast that needs to be manually dismissed.",
  autoRemove: false,
};

const headlineOnlyToast: Toast = {
  type: "success",
  headline: "This toast has no message",
};

const hyperlinkTost: Toast = {
  type: "info",
  message: "This toast has a link as a button.",
  buttons: [
    {
      text: "Click me",
      href: "https://www.example.com",
    },
  ],
};

const secretToast: Toast = {
  type: "success",
  headline: "Secret toast",
  message: "Congratulations, you found me!",
};

const callbackToast: Toast = {
  type: "warning",
  message: "This toast has a callback as a button.",
  buttons: [
    {
      text: "Click me",
      callback: () => show(secretToast),
      icon: Interactive,
    },
  ],
};

const apiError = h(ApiErrorTemplate, {
  title:
    "Could not load the workflow from the deployment. Check if the workflow version for this deployment is still available.",
  details: [
    'Could not load workflow "/Users/some team/some space/workflowname" for deployment "cdf0fc54a-fasd123123-asd1234123-adfa123"',
    'Something else happend with workflow "/Users/some team/some space/workflowname" for deployment "cdf0fc54a-fasd123123-asd1234123-adfa123"',
  ],
  status: 123,
  date: new Date(),
  requestId: "134123212413412321241341",
  errorId: "abcdefg",
});

const apiErrorToast: Toast = {
  type: "error",
  headline: "Deployment could not be created",
  component: apiError,
  width: 400,
};
</script>

<template>
  <div>
    <!-- Framework description -->
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <p>
            This framework provides a simple and versatile API that enables the
            use of toast-style notifications. It's Vuex/Pinia-agnostic, Nuxt
            3-ready, and supports both Composition API and Options API
            approaches. Multiple toast services can be used in the same project.
            A toast service is a combination of a reactive array of toast
            objects and methods for mutating the array.
          </p>
          <p>
            You are able to import all of the public-facing components of the
            framework, including types, from
            <code>@knime/components</code>.
          </p>
          <p>
            To use the toast service in your project, follow these steps (see
            the example section below for detailed coverage of various
            use-cases):
          </p>
          <ol>
            <li>
              Import and instantiate the <code>ToastServiceProvider</code> class
              in the <code>setup</code> section of the root component of your
              project (e.g. <code>App.vue</code>). The class instance will
              create a new toast service.
            </li>
            <li>
              In the same <code>setup</code> section, provide the toast service
              to the downstream components of the application by calling the
              <code>toastServiceProvider.useToastService()</code> method.
            </li>
            <li>
              Either in the root component, or in a downstream component, import
              the
              <code>ToastStack</code> component and place it in the
              <code>template</code> section. Currently, the stack is bound to
              the bottom left corner of its parent and the position is not
              adjustable.
            </li>
            <li>
              Whenever a component needs to e.g. display a toast notification,
              import the <code>useToasts</code> composable, which returns the
              toast service object containing the <code>show</code> function.
              Make sure to call the composable in the <code>setup</code> section
              of the component.
            </li>
            <li>
              Use the retrieved service properties, e.g. <code>show</code>,
              anywhere in the component to modify the toast stack.
            </li>
          </ol>
        </div>
      </div>
    </section>

    <!-- Interactive demo -->
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <h4>Interactive demo</h4>
          <p>
            This application has a toast service integrated. You can see it in
            action by spawning toast notifications using the buttons below.
          </p>
          <p>
            <b
              >Current number of toasts in the stack:
              {{ (toasts as any).length }}</b
            >
          </p>
          <h5>Basic examples</h5>
          <div class="grid-container">
            <div class="wrapper">
              <Button with-border compact @click="show(infoToast)"
                >Info toast</Button
              >
              <Button with-border compact @click="show(errorToast)"
                >Error toast</Button
              >
              <Button with-border compact @click="show(warningToast)"
                >Warning toast</Button
              >
              <Button with-border compact @click="show(successToast)"
                >Success toast</Button
              >
            </div>
          </div>
          <h5>Additional features</h5>
          <div class="grid-container">
            <div class="wrapper">
              <Button with-border compact @click="show(truncatedToast)"
                >Toast with a truncated message</Button
              >
              <Button with-border compact @click="show(persistentToast)"
                >Persistent toast</Button
              >
              <Button with-border compact @click="show(headlineOnlyToast)"
                >Toast with only a headline</Button
              >
              <Button with-border compact @click="show(hyperlinkTost)"
                >Toast with a hyperlink</Button
              >
              <Button with-border compact @click="show(callbackToast)"
                >Toast with a callback</Button
              >
              <Button with-border compact @click="show(apiErrorToast)"
                >Toast with an api error</Button
              >
            </div>
          </div>
          <h5>Stack control</h5>
          <div class="grid-container">
            <div class="wrapper">
              <Button with-border compact @click="autoRemove()"
                >Remove toasts with timer</Button
              >
              <Button with-border compact @click="removeAll()"
                >Remove all toasts</Button
              >
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- UX guidelines -->
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <h4>Usage guidelines</h4>
          <p>
            To make the UX consistent, please try to adhere to the following
            usage guidelines:
          </p>
          <ul>
            <li>
              Omit periods from <code>headlines</code>, e.g. "Action performed."
              -> "Action performed".
            </li>
            <li>Ensure <code>messages</code> end with a period.</li>
            <li>
              Use the <code>type</code> of the toast to convey success/error
              information, instead of explicitly stating it in the
              <code>headline</code>, e.g. "Successfully created space" -> "Space
              created".
            </li>
            <li>
              Refrain from using "was" when referring to completed actions, e.g.
              "Space was created" -> "Space created".
            </li>
            <li>
              Toasts with important information should be persistent, i.e.
              <code>autoRemove</code> set to <code>false</code>.
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Usage examples -->
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <h4>Usage examples</h4>
          <CodeExample summary="Show example of using via composables">{{
            composableCodeExample
          }}</CodeExample>
          <CodeExample summary="Show example of using as plugin">{{
            pluginCodeExample
          }}</CodeExample>
          <CodeExample summary="Show example of using from a store">{{
            storeCodeExample
          }}</CodeExample>
          <CodeExample
            summary="Show example of using multiple services via composables"
            >{{ multipleServicesComposableCodeExample }}</CodeExample
          >
          <CodeExample
            summary="Show example of using multiple services as plugin"
            >{{ multipleServicesPluginCodeExample }}</CodeExample
          >
          <CodeExample summary="Show toast-service.ts source code">{{
            toastServiceCode
          }}</CodeExample>
          <CodeExample summary="Show types.ts source code">{{
            typesCode
          }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="postcss" scoped>
.wrapper {
  display: grid;
  grid-template-columns: repeat(5, max-content);
  gap: 20px;
  max-width: 100%;
  place-items: center center;

  @media only screen and (width <= 900px) {
    grid-template-columns: repeat(1, max-content);
  }
}
</style>
