<script>
import CodeExample from './demo/CodeExample.vue';
import TabBar from 'webapps-common/ui/components/TabBar.vue';
import tabbarCode from 'webapps-common/ui/components/TabBar.vue?raw';
import BulbIcon from 'webapps-common/ui/assets/img/icons/bulb.svg';
import HelpIcon from 'webapps-common/ui/assets/img/icons/circle-help.svg';
import StarIcon from 'webapps-common/ui/assets/img/icons/star.svg';

const codeExampleStandalone = `<script>
import TabBar from '~/webapps-common/ui/components/TabBar.vue';
import BulbIcon from '~/webapps-common/ui/assets/img/icons/bulb.svg';
import HelpIcon from '~/webapps-common/ui/assets/img/icons/circle-help.svg';

export default {
    components: {
        TabBar,
        BulbIcon,
        HelpIcon
    },
    data() {
        return {
            activeTab: 'oranges'
        };
    },
    computed: {
        possibleTabValues() {
            return [{
                value: 'apples',
                label: 'Apples',
                title: 'Click for apples',
                icon: BulbIcon
            }, {
                value: 'oranges',
                label: 'Oranges',
                title: 'Click for oranges',
                icon: HelpIcon
            }, {
                label: 'Bananas (out of stock)',
                value: 'bananas',
                title: 'Click for bananas',
                disabled: true
            }];
        }
    }
};
<\/script>

<template>
  <TabBar
    :model-value="oranges"
    :possible-values="possibleTabValues"
    :disabled="false"
    @update:modelValue="activeTab = $event"
  />
  <!-- OR -->
  <TabBar
    v-model="oranges"
    :possible-values="possibleTabValues"
    :disabled="false"
  />
</template>`;

const possibleTabValues = [{
    value: 'apples',
    label: 'Apples',
    title: 'Click for apples',
    icon: BulbIcon
}, {
    value: 'oranges',
    label: 'Oranges',
    title: 'Click for oranges',
    icon: HelpIcon
}, {
    label: 'Bananas (out of stock)',
    title: 'Currently no bananas, sorry!',
    value: 'bananas',
    disabled: true
}];

export default {
    components: {
        TabBar,
        CodeExample
    },
    data() {
        return {
            activeTab: null,
            tabbarCode,
            codeExampleStandalone,
            activeTabStandalone: 'oranges',
            disabled: false,
            bananasDisabled: true
        };
    },
    computed: {
        possibleTabValuesStandalone() {
            let result = [...this.possibleTabValues];
            result[2] = {
                ...result[2],
                disabled: this.bananasDisabled,
                label: this.bananasDisabled ? 'Bananas (out of stock)' : 'Bananas!',
                title: this.bananasDisabled ? 'Currently no bananas, sorry!' : 'Click for bananas',
                icon: this.bananasDisabled ? null : StarIcon
            };
            return [...result];
        },
        possibleTabValues() {
            return possibleTabValues;
        }
    }
};
</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <h2>TabBar</h2>
        <p>
          The tab bar can be used as a standalone component or together with the included mixin, which syncs the
          selected value to the <code>activeTab</code> value:
        </p>

        <h4>Standalone</h4>
        <TabBar
          v-model="activeTabStandalone"
          :disabled="disabled"
          :possible-values="possibleTabValuesStandalone"
          name="t1"
        />
        <p><b>active tab:</b> {{ activeTabStandalone }}</p>
        <p>
          Individual items can be disabled
          <button @click="bananasDisabled = !bananasDisabled">{{ bananasDisabled ? 'enable' : 'disable' }}</button>,
          also the whole bar can be disabled:
          <button @click="disabled = !disabled">{{ disabled ? 'enable' : 'disable' }}</button>
        </p>
        <CodeExample summary="Show usage example (standalone)">{{ codeExampleStandalone }}</CodeExample>

        <h4>With Mixin</h4>
        <TabBar
          v-model="activeTab"
          :possible-values="possibleTabValues"
          name="t2"
        />
        <p><b>active tab:</b> {{ activeTab }}</p>
        <CodeExample summary="Show TabBar.vue source code">{{ tabbarCode }}</CodeExample>
      </div>
    </div>
  </section>
</template>

<style lang="postcss" scoped>
section {
  & :deep(.shadow-wrapper::before) {
    background-image: linear-gradient(270deg, hsl(0deg 0% 100% / 0%) 0%, var(--knime-white) 100%);
  }

  & :deep(.shadow-wrapper::after) {
    background-image: linear-gradient(90deg, hsl(0deg 0% 100% / 0%) 0%, var(--knime-white) 100%);
  }
}

h4 {
  margin-bottom: 10px;
}

button {
  width: 6em;
}

:deep(input[value="bananas"] + span svg) {
  fill: transparent;
  transition: fill 0.4s linear;
}

:deep(input[value="bananas"]:checked + span svg) {
  fill: var(--knime-yellow);
}
</style>
