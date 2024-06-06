<script setup lang="ts">
// import HelloWorld from "./components/HelloWorld.vue";
// import { Button } from "@knime/base-components";
import Icon from "@knime/styles/img/icons/ai-brain.svg";
import { MenuItems } from "@knime/base-components";

const items = [
  {
    text: "sdfsdf",
  },
];
</script>

<template>
  <MenuItems :items="items" :menu-aria-label="'sdsdfs'" />

  <!-- <Button primary>This is a KNIME Button</Button>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" /> -->
  <Icon />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
</style>

<!-- <style>
@import url("@knime/styles/css/index.css");
</style> -->
