<script>
import { defineAsyncComponent, h as createElement, ref } from 'vue';
import './assets/index.css';

import TabBar from 'webapps-common/ui/components/TabBar.vue';
import ImageIcon from 'webapps-common/ui/assets/img/icons/media-image.svg';
import InteractiveIcon from 'webapps-common/ui/assets/img/icons/interactive.svg';
import PaletteIcon from 'webapps-common/ui/assets/img/icons/color-palette.svg';
import CheckboxIcon from 'webapps-common/ui/assets/img/icons/checkboxes.svg';
import TooltipIcon from 'webapps-common/ui/assets/img/icons/tooltip.svg';
import UnknownIcon from 'webapps-common/ui/assets/img/icons/file-question.svg';
import ListThumbs from 'webapps-common/ui/assets/img/icons/list-thumbs.svg';
import HeadlineWithAnchorLink from 'webapps-common/ui/components/HeadlineWithAnchorLink.vue';

import SearchInput from 'webapps-common/ui/components/forms/SearchInput.vue';

import NpmLink from './components/demo/NpmLink.vue';


const demoComponents = {
    layout: {
        Fonts: defineAsyncComponent(() => import('./components/Fonts.vue')),
        Colors: defineAsyncComponent(() => import('./components/Colors.vue')),
        Grid: defineAsyncComponent(() => import('./components/Grid.vue')),
        Headlines: defineAsyncComponent(() => import('./components/Headlines.vue')),
        Description: defineAsyncComponent(() => import('./components/Description.vue'))
    },
    images: {
        Images: defineAsyncComponent(() => import('./components/Images.vue')),
        Icons: defineAsyncComponent(() => import('./components/Icons.vue'))
    },
    interactive: {
        Breadcrumb: defineAsyncComponent(() => import('./components/Breadcrumb.vue')),
        LinkList: defineAsyncComponent(() => import('./components/LinkList.vue')),
        Button: defineAsyncComponent(() => import('./components/Button.vue')),
        FunctionButton: defineAsyncComponent(() => import('./components/FunctionButton.vue')),
        SplitButton: defineAsyncComponent(() => import('./components/SplitButton.vue')),
        PlusButton: defineAsyncComponent(() => import('./components/PlusButton.vue')),
        Carousel: defineAsyncComponent(() => import('./components/Carousel.vue')),
        ExpandTransition: defineAsyncComponent(() => import('./components/transitions/ExpandTransition.vue')),
        Collapser: defineAsyncComponent(() => import('./components/Collapser.vue')),
        FileLink: defineAsyncComponent(() => import('./components/FileLink.vue')),
        IdleReadyButton: defineAsyncComponent(() => import('./components/IdleReadyButton.vue')),
        Modal: defineAsyncComponent(() => import('./components/Modal.vue')),
        MenuItems: defineAsyncComponent(() => import('./components/MenuItems.vue')),
        SideDrawer: defineAsyncComponent(() => import('./components/SideDrawer.vue')),
        SubMenu: defineAsyncComponent(() => import('./components/SubMenu.vue')),
        Tooltip: defineAsyncComponent(() => import('./components/Tooltip.vue')),
        TabBarDemo: defineAsyncComponent(() => import('./components/TabBar.vue')),
        TagList: defineAsyncComponent(() => import('./components/TagList.vue')),
        LoadingIcon: defineAsyncComponent(() => import('./components/LoadingIcon.vue')),
        DonutChart: defineAsyncComponent(() => import('./components/DonutChart.vue'))
    },
    messages: {
        Message: defineAsyncComponent(() => import('./components/Message.vue')),
        Messages: defineAsyncComponent(() => import('./components/Messages.vue'))
    },
    forms: {
        Label: defineAsyncComponent(() => import('./components/Label.vue')),
        Fieldset: defineAsyncComponent(() => import('./components/Fieldset.vue')),
        InputField: defineAsyncComponent(() => import('./components/InputField.vue')),
        TextArea: defineAsyncComponent(() => import('./components/TextArea.vue')),
        SearchInputDemo: defineAsyncComponent(() => import('./components/SearchInput.vue')),
        NumberInput: defineAsyncComponent(() => import('./components/NumberInput.vue')),
        Checkbox: defineAsyncComponent(() => import('./components/Checkbox.vue')),
        Checkboxes: defineAsyncComponent(() => import('./components/Checkboxes.vue')),
        ComboBox: defineAsyncComponent(() => import('./components/ComboBox.vue')),
        RadioButtons: defineAsyncComponent(() => import('./components/RadioButtons.vue')),
        ValueSwitch: defineAsyncComponent(() => import('./components/ValueSwitch.vue')),
        DateTimeInput: defineAsyncComponent(() => import('./components/DateTimeInput.vue')),
        TimePartInput: defineAsyncComponent(() => import('./components/TimePartInput.vue')),
        ListBox: defineAsyncComponent(() => import('./components/ListBox.vue')),
        Dropdown: defineAsyncComponent(() => import('./components/Dropdown.vue')),
        Multiselect: defineAsyncComponent(() => import('./components/Multiselect.vue')),
        MultiselectListBox: defineAsyncComponent(() => import('./components/MultiselectListBox.vue')),
        StyledListItem: defineAsyncComponent(() => import('./components/StyledListItem.vue')),
        ToggleSwitch: defineAsyncComponent(() => import('./components/ToggleSwitch.vue')),
        Twinlist: defineAsyncComponent(() => import('./components/Twinlist.vue')),
        MultiModeTwinlist: defineAsyncComponent(() => import('./components/MultiModeTwinlist.vue'))
    },
    misc: {
        NodePreview: defineAsyncComponent(() => import('./components/NodePreview.vue')),
        NodeFeatureList: defineAsyncComponent(() => import('./components/NodeFeatureList.vue')),
        OpenSourceCredits: defineAsyncComponent(() => import('./components/OpenSourceCredits.vue'))
    },
    npm: {
        knimeUiTable: {
            render() {
                const link = 'https://www.npmjs.com/package/@knime/knime-ui-table';
                const name = 'KNIME UI Table';
                return createElement(NpmLink, { link, name });
            }
        },
        knimeEsLint: {
            render() {
                const link = 'https://www.npmjs.com/package/@knime/eslint-config';
                const name = 'KNIME ESLint config';
                return createElement(NpmLink, { link, name });
            }
        }
    }
};


const flattenComponents = (componentsByCategory) => {
    let componentsFlattened = {};
    for (let componentByName of Object.values(componentsByCategory)) {
        for (let [name, component] of Object.entries(componentByName)) {
            componentsFlattened[name] = component;
        }
    }
    return componentsFlattened;
};

// Transform the components into a flat object
const components = {
    TabBar,
    HeadlineWithAnchorLink,
    SearchInput,
    ...flattenComponents(demoComponents)
};

export default {
    components,
    data() {
        return {
            searchQuery: '',
            activeTab: ''
        };
    },
    computed: {
        filteredDemoComponents() {
            if (!this.isSearchActive) {
                return this.demoComponents;
            }
            let filtered = {};
            for (let [category, componentByName] of Object.entries(this.demoComponents)) {
                for (let [name, component] of Object.entries(componentByName)) {
                    if (name.toLowerCase().includes(this.searchQuery.toLowerCase())) {
                        if (!filtered.hasOwnProperty(category)) {
                            filtered[category] = {};
                        }
                        filtered[category][name] = component;
                    }
                }
            }
            return filtered;
        },
        isSearchActive() {
            return this.searchQuery !== '';
        },
        possibleTabValues() {
            return [{
                value: 'layout',
                label: 'Style & Layout',
                icon: PaletteIcon
            }, {
                value: 'images',
                label: 'Images & Icons',
                icon: ImageIcon
            }, {
                value: 'interactive',
                label: 'UI Components',
                icon: InteractiveIcon
            }, {
                value: 'forms',
                label: 'Forms',
                icon: CheckboxIcon
            }, {
                value: 'messages',
                label: 'Messages',
                icon: TooltipIcon
            }, {
                value: 'misc',
                label: 'Misc',
                icon: UnknownIcon
            }, {
                value: 'npm',
                label: 'npm packages',
                icon: ListThumbs
            }];
        }
    },
    watch: {
        searchQuery(newSearchQuery, oldSearchQuery) {
            if (newSearchQuery !== oldSearchQuery) {
                const query = {};
                if (newSearchQuery) {
                    query.q = this.searchQuery;
                }
                this.$router.replace({ query });
            }
        }
    },
    async created() {
        this.demoComponents = demoComponents;
        await this.$router.isReady();
        if (this.$route.query.q) {
            this.searchQuery = this.$route.query.q.trim();
        }
    }

};
</script>

<template>
  <div>
    <header>
      <img
        src="~webapps-common/ui/assets/img/KNIME_Logo_gray.svg?file"
        class="logo"
      >
    </header>
    <main>
      <section>
        <div class="grid-container header">
          <div class="grid-item-12">
            <h1>KNIME WebApps Common</h1>
            <p>
              This page gives an overview of shared CSS, assets like icons and Vue-based UI components.
              To use them, it's recommended to integrate them as Git submodule as described in the
              <a href="https://bitbucket.org/KNIME/webapps-common/src/master/README.md">README.md</a>.
              More and more parts are also available as <a href="https://www.npmjs.com/~knime">npm packages</a>.
            </p>

            <div class="categories">
              <TabBar
                v-model="activeTab"
                :disabled="isSearchActive"
                :possible-values="possibleTabValues"
              />
              <SearchInput
                v-model.trim="searchQuery"
                autofocus
                placeholder="Filter by component name…"
                class="search"
              />
            </div>
          </div>
        </div>
      </section>

      <template v-for="(componentByName, category) in filteredDemoComponents">
        <div
          v-if="activeTab === category || isSearchActive"
          :key="category"
        >
          <div
            v-for="(component, name) in componentByName"
            :key="category+name"
          >
            <HeadlineWithAnchorLink
              :title="name"
            />
            <component
              :is="name"
            />
          </div>
        </div>
      </template>
    </main>
  </div>
</template>

<style scoped lang="postcss">

.logo {
  height: 4vmin;
  margin: 2vmin 0;
}

main {
  margin-bottom: 10em;
}

.header {
  margin-bottom: -30px;
}

section {
  & :deep(.shadow-wrapper::before) {
    background-image: linear-gradient(270deg, hsl(0deg 0% 100% / 0%) 0%, var(--knime-white) 100%);
  }

  & :deep(.shadow-wrapper::after) {
    background-image: linear-gradient(90deg, hsl(0deg 0% 100% / 0%) 0%, var(--knime-white) 100%);
  }
}

.categories {
  position: relative;

  & .search {
    min-width: 250px;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 1;

    @media only screen and (max-width: 1280px) {
      position: relative;
      margin-bottom: 30px;
    }
  }
}

</style>
