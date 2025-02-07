<script>
import { Button, SideDrawer } from "@knime/components";

import CodeExample from "./demo/CodeExample.vue";
// import code from "webapps-common/ui/components/SideDrawer.vue?raw";
const code = "";

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

export default {
  components: {
    SideDrawer,
    Button,
    CodeExample,
  },
  data() {
    return {
      codeExample,
      lorumIpsumContent,
      isExpanded: false,
      isExpandedCustomStyles: false,
    };
  },
  computed: {
    code() {
      return code;
    },
    expandedMessage() {
      return this.isExpanded ? "expanded" : "not expanded";
    },
    expandedMessageCustomStyles() {
      return this.isExpandedCustomStyles
        ? "expanded (with custom styles)"
        : "not expanded (so you can't see the custom styles)";
    },
  },
};
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
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{
            codeExample
          }}</CodeExample>
          <CodeExample summary="Show SideDrawer.vue source code">{{
            code
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
