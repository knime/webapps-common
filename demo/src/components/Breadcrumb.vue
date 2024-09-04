<script>
import { markRaw } from "vue";
import CodeExample from "./demo/CodeExample.vue";
import FolderIcon from "@knime/styles/img/icons/folder.svg";
import { Breadcrumb } from "@knime/components";
// import breadcrumbCode from "webapps-common/ui/components/Breadcrumb.vue?raw";
const breadcrumbCode = "";

const codeExample = `<Breadcrumb
  :items="[
    { text: 'segment without link' },
    { text: 'segment with link', href: '/' },
    { text: 'segment with icon (clickable)', icon: FolderIcon, clickable: true },
    { text: 'segment with icon', icon: FolderIcon }
    { title: 'only an icon with no text but a title', icon: FolderIcon }
  ]"
  greyStyle
/>
`;

export default {
  components: {
    Breadcrumb,
    CodeExample,
  },
  data() {
    const FolderIconRef = markRaw(FolderIcon);
    return {
      breadcrumbCode,
      breadcrumbItems: [
        { text: "KNIME Hub", href: "/" },
        { text: "John Doe", href: "/john.doe" },
        { text: "Public Space", href: "/john.doe/space", icon: FolderIconRef },
        { title: "only an icon with no text but a title", icon: FolderIcon },
        { text: "Examples (clickable)", icon: FolderIconRef, clickable: true },
        { text: "Sentiment Prediction via REST" },
      ],
      codeExample,
      containerWidth: 200,
    };
  },
  methods: {
    onItemClicked({ text }) {
      window.alert(`You clicked on item ${JSON.stringify({ text })}`);
    },
  },
};
</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <p>
          Breadcrumbs can have different focus/hover styles, these can be
          toggled via the "greyStyle"-property
        </p>
        <h6>Default style:</h6>
        <Breadcrumb :items="breadcrumbItems" @click-item="onItemClicked" />
        <h6>"greyStyle" enabled:</h6>
        <Breadcrumb :items="breadcrumbItems" grey-style />
        <h6>"noWrap" enabled:</h6>
        Width of container:
        <input
          v-model="containerWidth"
          type="range"
          min="20"
          max="1000"
          step="10"
        />
        <div
          :style="{ width: `${containerWidth}px`, border: '1px solid black' }"
        >
          <Breadcrumb :items="breadcrumbItems" no-wrap />
        </div>
        <h6>"compact" enabled:</h6>
        <Breadcrumb :items="breadcrumbItems" compact />
        <CodeExample summary="Show usage example">{{
          codeExample
        }}</CodeExample>
        <CodeExample summary="Show Breadcrumb.vue source code">{{
          breadcrumbCode
        }}</CodeExample>
      </div>
    </div>
  </section>
</template>
