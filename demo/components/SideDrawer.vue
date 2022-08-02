<script>
import CodeExample from './demo/CodeExample.vue';
import SideDrawer from '../../ui/components/SideDrawer.vue';
import Button from '../../ui/components/Button.vue';
import PencilIcon from '../../ui/assets/img/icons/pencil.svg?inline';
import code from '!!raw-loader!../../ui/components/SideDrawer';


const codeExampleStandalone = `<script>
import SideDrawer from '~/webapps-common/ui/components/SideDrawer.vue';
import MenuIcon from '~/webapps-common/ui/assets/img/icons/menu-options.svg?inline';
// TODO
<\/script>

<template>
  <nav>
    <SideDrawer
      :items="sideDrawerItems"
      orientation="left"
      button-title="Open my sideDrawer with icons"
    >
  </nav>
</template>

<style lang="postcss" scoped>
nav {
  display: flex;

  & >>> .sideDrawer-toggle:hover,
  & >>> .sideDrawer-toggle:focus,
  &:focus-within >>> .sideDrawer-toggle {
    color: var(--knime-white);
    background-color: var(--knime-masala);

    & svg {
      stroke: var(--knime-white);
    }
  }
}
</style>
`;

export default {
    components: {
        SideDrawer,
        Button,
        PencilIcon
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
</script>

<template>
  <div>
    <section>
      <div class="grid-container">
        <div class="grid-item-12 wrapper">
          <h2>Side Drawer</h2>
          <p>Provides an expandable drawer to the right side which can be filled with arbitrary content. On mobile it will take up the whole width.</p>
          <Button
            primary
            @click="isExpanded = !isExpanded"
          >
            Draw it!
          </Button>
          <p>I am {{ expandedMessage }}</p>
        </div>
      </div>
    </section>
    <SideDrawer
      class="side-drawer"
      :is-expanded="isExpanded"
    >
      <div class="contents-side-drawer">
        <h4>something here</h4>
        <p>And a lot more Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim, nemo nostrum repellat voluptas, nesciunt sequi velit earum iusto iste beatae hic perspiciatis deserunt exercitationem aut sapiente quas culpa sint alias.</p>
        <Button
          with-border
          @click="isExpanded = false"
        >
          Close me!
        </Button>
      </div>
    </SideDrawer>
  </div>
</template>


<style lang="postcss">

h4 {
  margin: 0;
}

body,
html {
  /* overflow-x: hidden; */
}

.contents-side-drawer {
  padding: 30px;
  box-sizing: border-box;
  background-color: var(--knime-white);
  height: stretch;
}

</style>
