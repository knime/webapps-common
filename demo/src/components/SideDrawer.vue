<script>
import CodeExample from './demo/CodeExample.vue';
import SideDrawer from 'webapps-common/ui/components/SideDrawer.vue';
import Button from 'webapps-common/ui/components/Button.vue';
import code from 'webapps-common/ui/components/SideDrawer.vue?raw';


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
        <p>And a lot more Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim, nemo nostrum repellat voluptas, nesciunt sequi velit earum iusto iste beatae hic perspiciatis deserunt exercitationem aut sapiente quas culpa sint alias.</p>
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

export default {
    components: {
        SideDrawer,
        Button,
        CodeExample
    },
    data() {
        return {
            codeExample,
            isExpanded: false
        };
    },
    computed: {
        code() {
            return code;
        },
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
          <h2>SideDrawer</h2>
          <p>
            Provides an expandable drawer to the right side which can be filled with arbitrary content.
            On small screens it will take up the whole width.
          </p>
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
        <p>
          And a lot more Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim, nemo
          nostrum repellat voluptas, nesciunt sequi velit earum iusto iste beatae hic perspiciatis deserunt
          exercitationem aut sapiente quas culpa sint alias.
        </p>
        <Button
          with-border
          @click="isExpanded = false"
        >
          Close me!
        </Button>
      </div>
    </SideDrawer>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{ codeExample }}</CodeExample>
          <CodeExample summary="Show SideDrawer.vue source code">{{ code }}</CodeExample>
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
