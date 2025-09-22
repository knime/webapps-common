<script lang="ts" setup>
import {
  Button,
  SideDrawer,
  SideDrawerHeader,
  Checkboxes,
  SideDrawerControls,
  Checkbox,
} from "@knime/components";

import CodeExample from "./demo/CodeExample.vue";
import { ref } from "vue";
import { computed } from "vue";

const codeExample = `<script>
import SideDrawer from '~/webapps-common/ui/components/SideDrawer.vue';
import Button from '~/webapps-common/ui/components/Button.vue';

export default {
    components: {
        SideDrawer,
        Button,
    },
    data() {
        return {
            isExpanded: false
        };
    },
    computed: {
        expandedMessage() {
            return this.isExpanded ? 'expanded' : 'not expanded';
        }
    }

};
<\/script>

<template>
  <SideDrawer
      class="side-drawer"
      :is-expanded="isExpanded"
    >
      <div class="contents-side-drawer">
        <h4>something here</h4>
        <p>And a lot more Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim, nemo nostrum repellat voluptas,
          nesciunt sequi velit earum iusto iste beatae hic perspiciatis deserunt exercitationem aut sapiente quas culpa
          sint alias.</p>
        <Button
          with-border
          @click="isExpanded = false"
        >
          Close me!
        </Button>
      </div>
    </SideDrawer>
</template>

<style lang="postcss" scoped>

h4 {
  margin: 0;
}

.contents-side-drawer {
  padding: 30px;
  box-sizing: border-box;
  background-color: var(--knime-white);
  height: 100%;
}

</style>
`;

const lorumIpsumContent = `And a lot more Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Enim, nemo nostrum repellat voluptas, nesciunt sequi velit earum
          iusto iste beatae hic perspiciatis deserunt exercitationem aut
          sapiente quas culpa sint alias.`;

const isExpanded = ref(false);
const selected = ref<Array<string>>([]);

const enableCustomStyles = computed(() =>
  selected.value.includes("customStyles"),
);
const enableControls = computed(() => selected.value.includes("controls"));
const enableHeader = computed(() => selected.value.includes("header"));
const enableSubDrawerHeader = ref(false);

const expandedMessage = computed(() => {
  return isExpanded.value ? "expanded" : "not expanded";
});
</script>

<template>
  <div>
    <section>
      <div class="grid-container">
        <div class="grid-item-12 wrapper">
          <div class="info">
            <p>
              Provides an expandable drawer to the right side which can be
              filled with arbitrary content. On small screens it will take up
              the whole width.
            </p>
            <Button primary @click="isExpanded = !isExpanded">
              Draw it!
            </Button>
            <p>I am {{ expandedMessage }}</p>
          </div>
          <div class="options">
            <h4>Options</h4>
            <Checkboxes
              v-model="selected"
              :possible-values="[
                {
                  id: 'header',
                  text: 'Show Header',
                },
                {
                  id: 'controls',
                  text: 'Show Controls',
                },
                {
                  id: 'customStyles',
                  text: 'Use Custom Styles',
                },
              ]"
            />
            <div v-if="enableHeader">
              <h5>Extras</h5>
              <Checkbox v-model="enableSubDrawerHeader"
                >Enable Side Drawer Header</Checkbox
              >
            </div>
          </div>
        </div>
      </div>
    </section>
    <SideDrawer
      class="side-drawer"
      :is-expanded="isExpanded"
      :style-overrides="enableCustomStyles ? { width: '50%' } : undefined"
    >
      <div class="side-drawer-wrapper">
        <div>
          <SideDrawerHeader
            v-if="enableHeader"
            title="My header"
            description="This is a description"
            :is-sub-drawer="enableSubDrawerHeader"
            @close="isExpanded = false"
          />
          <div class="contents-side-drawer">
            <h4>something here</h4>
            <p>
              {{ lorumIpsumContent }}
            </p>
            <Button
              v-if="!enableHeader && !enableControls"
              with-border
              @click="isExpanded = false"
            >
              Close me!
            </Button>
          </div>
        </div>
        <SideDrawerControls
          v-if="enableControls"
          class="side-drawer-controls"
          :edit-enabled="true"
          @cancel="isExpanded = false"
        />
      </div>
    </SideDrawer>
    <section class="code-example">
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{
            codeExample
          }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="postcss" scoped>
h4 {
  margin: 0;
}

.options,
.code-example {
  margin-top: 30px;
}

.options-controller {
  display: flex;
  gap: 20px;
  align-items: center;
}

.side-drawer {
  & .side-drawer-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }

  & .contents-side-drawer {
    box-sizing: border-box;
    height: 100%;
    padding: 30px;
  }
}
</style>
