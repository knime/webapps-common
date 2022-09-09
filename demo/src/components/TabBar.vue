<script>
import CodeExample from './demo/CodeExample.vue';
import TabBar, { tabBarMixin } from 'webapps-common/ui/components/TabBar.vue';
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
    value="oranges"
    :possible-values="possibleTabValues"
    :disabled="false"
    @update:value="activeTab = $event"
  />
</template>`;

const codeExampleMixin = `<script>
import TabBar, { tabBarMixin } from '~/webapps-common/ui/components/TabBar.vue';
import BulbIcon from '~/webapps-common/ui/assets/img/icons/bulb.svg';
import HelpIcon from '~/webapps-common/ui/assets/img/icons/circle-help.svg';

export default {
    components: {
        TabBar,
        BulbIcon,
        HelpIcon
    },
    mixins: [tabBarMixin],
    computed: {
        possibleTabValues() { // required by the mixin
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
                disabled: true
            }];
        }
    }
};
<\/script>

<template>
  <TabBar
    :value.sync="activeTab"
    :possible-values="possibleTabValues"
  />
  <\!-- The mixin provides the 'activeTab' value -->
  <p><b>Active tab:</b> {{ activeTab }}</p>
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
    mixins: [tabBarMixin],
    data() {
        return {
            tabbarCode,
            codeExampleStandalone,
            codeExampleMixin,
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
          :disabled="disabled"
          :value="activeTabStandalone"
          :possible-values="possibleTabValuesStandalone"
          name="t1"
          @update:value="activeTabStandalone = $event"
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
          :value.sync="activeTab"
          :possible-values="possibleTabValues"
          name="t2"
        />
        <p><b>active tab:</b> {{ activeTab }}</p>
        <CodeExample summary="Show usage example (withMixin)">{{ codeExampleMixin }}</CodeExample>
        <CodeExample summary="Show TabBar.vue source code">{{ tabbarCode }}</CodeExample>
      </div>
    </div>
  </section>
</template>

<style lang="postcss" scoped>
section {
  & >>> .shadow-wrapper::before {
    background-image: linear-gradient(270deg, hsla(0, 0%, 100%, 0) 0%, var(--knime-white) 100%);
  }

  & >>> .shadow-wrapper::after {
    background-image: linear-gradient(90deg, hsla(0, 0%, 100%, 0) 0%, var(--knime-white) 100%);
  }
}

h4 {
  margin-bottom: 10px;
}

button {
  width: 6em;
}

>>> input[value="bananas"] + span svg {
  fill: transparent;
  transition: fill 0.4s linear;
}

>>> input[value="bananas"]:checked + span svg {
  fill: var(--knime-yellow);
}
</style>
