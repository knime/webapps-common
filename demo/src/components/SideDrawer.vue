<script lang="ts" setup>
import { Button, SideDrawer, SideDrawerHeader } from "@knime/components";

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
const isExpandedCustomStyles = ref(false);
const isExpandedWithHeader = ref(false);
const isExpandedWithSubSideDrawerHeader = ref(false);

const expandedMessage = computed(() => {
  return isExpanded.value ? "expanded" : "not expanded";
});
const expandedMessageCustomStyles = computed(() => {
  return isExpandedCustomStyles.value
    ? "expanded (with custom styles)"
    : "not expanded (so you can't see the custom styles)";
});

const expandedMessageWithHeader = computed(() => {
  return isExpandedWithHeader.value
    ? "expanded (with header)"
    : "not expanded (so you can't see the header)";
});

const expandedMessageWithSubHeader = computed(() => {
  return isExpandedWithSubSideDrawerHeader.value
    ? "expanded (with sub drawer header)"
    : "not expanded (so you can't see the sub drawer header)";
});
</script>

<template>
  <div>
    <section>
      <div class="grid-container">
        <div class="grid-item-12 wrapper">
          <p>
            Provides an expandable drawer to the right side which can be filled
            with arbitrary content. On small screens it will take up the whole
            width.
          </p>
          <Button primary @click="isExpanded = !isExpanded"> Draw it! </Button>
          <p>I am {{ expandedMessage }}</p>
        </div>
      </div>
    </section>
    <SideDrawer class="side-drawer" :is-expanded="isExpanded">
      <div class="contents-side-drawer">
        <h4>something here</h4>
        <p>
          {{ lorumIpsumContent }}
        </p>
        <Button with-border @click="isExpanded = false"> Close me! </Button>
      </div>
    </SideDrawer>

    <section>
      <div class="grid-container">
        <div class="grid-item-12 wrapper">
          <p>
            It is possible to override some styles of the drawer by using the
            <code>styleOverrides</code> prop.
          </p>
          <Button
            primary
            @click="isExpandedCustomStyles = !isExpandedCustomStyles"
          >
            Draw it!
          </Button>
          <p>I am {{ expandedMessageCustomStyles }}</p>
        </div>
      </div>
    </section>
    <SideDrawer
      class="side-drawer"
      :is-expanded="isExpandedCustomStyles"
      :style-overrides="{ width: '50%' }"
    >
      <div class="contents-side-drawer">
        <h4>something here</h4>
        <p>
          {{ lorumIpsumContent }}
        </p>
        <Button with-border @click="isExpandedCustomStyles = false">
          Close me!
        </Button>
      </div>
    </SideDrawer>
    <section>
      <div class="grid-container">
        <div class="grid-item-12 wrapper">
          <p>Provides an expandable drawer with header</p>
          <Button primary @click="isExpandedWithHeader = !isExpandedWithHeader">
            Draw it!
          </Button>
          <p>I am {{ expandedMessageWithHeader }}</p>
        </div>
      </div>
    </section>
    <SideDrawer
      class="side-drawer"
      :is-expanded="isExpandedWithHeader"
      :style-overrides="{ width: '50%' }"
    >
      <SideDrawerHeader title="My header" description="This is a description" />
      <div class="contents-side-drawer">
        <h4>something here</h4>
        <p>
          {{ lorumIpsumContent }}
        </p>
        <Button with-border @click="isExpandedWithHeader = false">
          Close me!
        </Button>
      </div>
    </SideDrawer>

    <section>
      <div class="grid-container">
        <div class="grid-item-12 wrapper">
          <p>Provides an expandable drawer with sub drawer header</p>
          <Button
            primary
            @click="
              isExpandedWithSubSideDrawerHeader =
                !isExpandedWithSubSideDrawerHeader
            "
          >
            Draw it!
          </Button>
          <p>I am {{ expandedMessageWithSubHeader }}</p>
        </div>
      </div>
    </section>
    <SideDrawer
      class="side-drawer"
      :is-expanded="isExpandedWithSubSideDrawerHeader"
      :style-overrides="{ width: '50%' }"
    >
      <SideDrawerHeader
        title="My header"
        description="This is a description"
        @close="isExpandedWithSubSideDrawerHeader = false"
        :is-sub-drawer="true"
      />
      <div class="contents-side-drawer">
        <h4>something here</h4>
        <p>
          {{ lorumIpsumContent }}
        </p>
        <Button with-border @click="isExpandedWithSubSideDrawerHeader = false">
          Close me!
        </Button>
      </div>
    </SideDrawer>

    <section>
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

.contents-side-drawer {
  padding: 30px;
  box-sizing: border-box;
  background-color: var(--knime-white);
  height: 100%;
}
</style>
