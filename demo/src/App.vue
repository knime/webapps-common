<script>
import "./assets/index.css";

import { h as createElement, defineAsyncComponent } from "vue";

import {
  HintProvider,
  SearchInput as SearchInputComponent,
  TabBar as TabBarComponent,
  ToastServiceProvider,
  ToastStack,
} from "@knime/components";
import BulbIcon from "@knime/styles/img/icons/bulb.svg";
import CheckboxIcon from "@knime/styles/img/icons/checkboxes.svg";
import PaletteIcon from "@knime/styles/img/icons/color-palette.svg";
import UnknownIcon from "@knime/styles/img/icons/file-question.svg";
import InteractiveIcon from "@knime/styles/img/icons/interactive.svg";
import ListThumbs from "@knime/styles/img/icons/list-thumbs.svg";
import ImageIcon from "@knime/styles/img/icons/media-image.svg";
import ViewListIcon from "@knime/styles/img/icons/view-list.svg";

import HeadlineWithAnchorLink from "./components/demo/HeadlineWithAnchorLink.vue";
import NpmLink from "./components/demo/NpmLink.vue";

const demoComponents = {
  layout: {
    Fonts: defineAsyncComponent(() => import("./components/Fonts.vue")),
    Colors: defineAsyncComponent(() => import("./components/Colors.vue")),
    Grid: defineAsyncComponent(() => import("./components/Grid.vue")),
    Headlines: defineAsyncComponent(() => import("./components/Headlines.vue")),
    Description: defineAsyncComponent(
      () => import("./components/Description.vue"),
    ),
  },
  images: {
    Images: defineAsyncComponent(() => import("./components/Images.vue")),
    Icons: defineAsyncComponent(() => import("./components/Icons.vue")),
  },
  interactive: {
    AutoPlayVideo: defineAsyncComponent(
      () => import("./components/AutoPlayVideo.vue"),
    ),
    Breadcrumb: defineAsyncComponent(
      () => import("./components/Breadcrumb.vue"),
    ),
    ProgressBar: defineAsyncComponent(
      () => import("./components/ProgressBar.vue"),
    ),
    ProgressItem: defineAsyncComponent(
      () => import("./components/ProgressItem.vue"),
    ),
    LinkList: defineAsyncComponent(() => import("./components/LinkList.vue")),
    Button: defineAsyncComponent(() => import("./components/Button.vue")),
    FunctionButton: defineAsyncComponent(
      () => import("./components/FunctionButton.vue"),
    ),
    SplitButton: defineAsyncComponent(
      () => import("./components/SplitButton.vue"),
    ),
    PlusButton: defineAsyncComponent(
      () => import("./components/PlusButton.vue"),
    ),
    Carousel: defineAsyncComponent(() => import("./components/Carousel.vue")),
    ExpandTransition: defineAsyncComponent(
      () => import("./components/transitions/ExpandTransition.vue"),
    ),
    Collapser: defineAsyncComponent(() => import("./components/Collapser.vue")),
    FileLink: defineAsyncComponent(() => import("./components/FileLink.vue")),
    FileSelector: defineAsyncComponent(
      () => import("./components/FileSelector.vue"),
    ),
    IdleReadyButton: defineAsyncComponent(
      () => import("./components/IdleReadyButton.vue"),
    ),
    Modal: defineAsyncComponent(() => import("./components/Modal.vue")),
    InlineMessage: defineAsyncComponent(
      () => import("./components/InlineMessage.vue"),
    ),
    MenuItems: defineAsyncComponent(() => import("./components/MenuItems.vue")),
    SideDrawer: defineAsyncComponent(
      () => import("./components/SideDrawer.vue"),
    ),
    SubMenu: defineAsyncComponent(() => import("./components/SubMenu.vue")),
    Tooltip: defineAsyncComponent(() => import("./components/Tooltip.vue")),
    Tree: defineAsyncComponent(() => import("./components/Tree.vue")),
    TabBar: defineAsyncComponent(() => import("./components/TabBar.vue")),
    TagList: defineAsyncComponent(() => import("./components/TagList.vue")),
    LoadingIcon: defineAsyncComponent(
      () => import("./components/LoadingIcon.vue"),
    ),
    DonutChart: defineAsyncComponent(
      () => import("./components/DonutChart.vue"),
    ),
    FileExplorer: defineAsyncComponent(
      () => import("./components/FileExplorer.vue"),
    ),
    LocalDateTime: defineAsyncComponent(
      () => import("./components/LocalDateTime.vue"),
    ),
    Pill: defineAsyncComponent(() => import("./components/Pill.vue")),
    CollapsiblePanel: defineAsyncComponent(
      () => import("./components/CollapsiblePanel.vue"),
    ),
    UploadProgressPanel: defineAsyncComponent(
      () => import("./components/UploadProgressPanel.vue"),
    ),
    DownloadProgressPanel: defineAsyncComponent(
      () => import("./components/DownloadProgressPanel.vue"),
    ),
    SkeletonItem: defineAsyncComponent(
      () => import("./components/SkeletonItem.vue"),
    ),
    Avatar: defineAsyncComponent(() => import("./components/Avatar.vue")),
  },
  toasts: {
    "Toast Service": defineAsyncComponent(
      () => import("./components/ToastService.vue"),
    ),
  },
  hints: {
    Hints: defineAsyncComponent(() => import("./components/Hints.vue")),
  },
  forms: {
    Label: defineAsyncComponent(() => import("./components/Label.vue")),
    Fieldset: defineAsyncComponent(() => import("./components/Fieldset.vue")),
    InputField: defineAsyncComponent(
      () => import("./components/InputField.vue"),
    ),
    TextArea: defineAsyncComponent(() => import("./components/TextArea.vue")),
    SearchInput: defineAsyncComponent(
      () => import("./components/SearchInput.vue"),
    ),
    NumberInput: defineAsyncComponent(
      () => import("./components/NumberInput.vue"),
    ),
    QuantityInput: defineAsyncComponent(
      () => import("./components/QuantityInput.vue"),
    ),
    Checkbox: defineAsyncComponent(() => import("./components/Checkbox.vue")),
    Checkboxes: defineAsyncComponent(
      () => import("./components/Checkboxes.vue"),
    ),
    SearchableCheckboxes: defineAsyncComponent(
      () => import("./components/SearchableCheckboxes.vue"),
    ),
    ComboBox: defineAsyncComponent(() => import("./components/ComboBox.vue")),
    RadioButtons: defineAsyncComponent(
      () => import("./components/RadioButtons.vue"),
    ),
    ValueSwitch: defineAsyncComponent(
      () => import("./components/ValueSwitch.vue"),
    ),
    DateTimeInput: defineAsyncComponent(
      () => import("./components/DateTimeInput.vue"),
    ),
    TimePartInput: defineAsyncComponent(
      () => import("./components/TimePartInput.vue"),
    ),
    DateTimeFormatInput: defineAsyncComponent(
      () => import("./components/DateTimeFormatInput.vue"),
    ),
    IntervalInput: defineAsyncComponent(
      () => import("./components/IntervalInput.vue"),
    ),
    ListBox: defineAsyncComponent(() => import("./components/ListBox.vue")),
    Dropdown: defineAsyncComponent(() => import("./components/Dropdown.vue")),
    Multiselect: defineAsyncComponent(
      () => import("./components/Multiselect.vue"),
    ),
    MultiselectListBox: defineAsyncComponent(
      () => import("./components/MultiselectListBox.vue"),
    ),
    SearchableList: defineAsyncComponent(
      () => import("./components/SearchableList.vue"),
    ),
    StyledListItem: defineAsyncComponent(
      () => import("./components/StyledListItem.vue"),
    ),
    ToggleSwitch: defineAsyncComponent(
      () => import("./components/ToggleSwitch.vue"),
    ),
    Twinlist: defineAsyncComponent(() => import("./components/Twinlist.vue")),
    MultiModeTwinlist: defineAsyncComponent(
      () => import("./components/MultiModeTwinlist.vue"),
    ),
    SortList: defineAsyncComponent(() => import("./components/SortList.vue")),
    RichTextEditor: defineAsyncComponent(
      () => import("./components/RichTextEditor.vue"),
    ),
  },
  misc: {
    NodePreview: defineAsyncComponent(
      () => import("./components/NodePreview.vue"),
    ),
    NodeFeatureList: defineAsyncComponent(
      () => import("./components/NodeFeatureList.vue"),
    ),
    OpenSourceCredits: defineAsyncComponent(
      () => import("./components/OpenSourceCredits.vue"),
    ),
  },
  npm: {
    "KNIME UI Table": {
      render() {
        const link = "https://www.npmjs.com/package/@knime/knime-ui-table";
        return createElement(NpmLink, { link });
      },
    },
    "KNIME ESLint config": {
      render() {
        const link = "https://www.npmjs.com/package/@knime/eslint-config";
        return createElement(NpmLink, { link });
      },
    },
  },
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
  TabBarComponent,
  HeadlineWithAnchorLink,
  SearchInputComponent,
  ToastStack,
  HintProvider,
  ...flattenComponents(demoComponents),
};

export default {
  components,
  setup() {
    const toastServiceProvider = new ToastServiceProvider();
    toastServiceProvider.useToastService();
  },
  data() {
    return {
      searchQuery: "",
      activeTab: "",
    };
  },
  computed: {
    filteredDemoComponents() {
      if (!this.isSearchActive) {
        return this.demoComponents;
      }
      let filtered = {};
      for (let [category, componentByName] of Object.entries(
        this.demoComponents,
      )) {
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
      return this.searchQuery !== "";
    },
    possibleTabValues() {
      return [
        {
          value: "layout",
          label: "Style & Layout",
          icon: PaletteIcon,
        },
        {
          value: "images",
          label: "Images & Icons",
          icon: ImageIcon,
        },
        {
          value: "interactive",
          label: "UI Components",
          icon: InteractiveIcon,
        },
        {
          value: "forms",
          label: "Forms",
          icon: CheckboxIcon,
        },
        {
          value: "toasts",
          label: "Toasts",
          icon: ViewListIcon,
        },
        {
          value: "hints",
          label: "Hints",
          icon: BulbIcon,
        },
        {
          value: "misc",
          label: "Misc",
          icon: UnknownIcon,
        },
        {
          value: "npm",
          label: "npm packages",
          icon: ListThumbs,
        },
      ];
    },
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
    },
    async activeTab(newTabVal, oldTabVal) {
      // do not update tab if we have a query otherwise the query would be lost
      await this.$router.isReady();
      if (this.$route.query.q) {
        return;
      }
      if (newTabVal !== oldTabVal) {
        const query = {};
        if (newTabVal) {
          query.tab = newTabVal;
        }
        this.$router.replace({ query });
      }
    },
  },

  async created() {
    this.demoComponents = demoComponents;
    await this.$router.isReady();
    if (this.$route.query.q) {
      this.searchQuery = this.$route.query.q.trim();
    }

    if (this.$route.query.tab) {
      this.activeTab = this.$route.query.tab;
    }
  },
};
</script>

<template>
  <div>
    <header>
      <img
        src="@knime/styles/img/KNIME_Logo_gray.svg?file"
        class="logo"
        alt="KNIME"
      />
    </header>
    <main>
      <section>
        <div class="grid-container header">
          <div class="grid-item-12">
            <h1>KNIME WebApps Common</h1>
            <p>
              This page gives an overview of shared CSS, assets like icons and
              Vue-based UI components. To use them, check the published
              <a href="https://www.npmjs.com/~knime">npm packages</a>.
            </p>

            <div class="categories">
              <TabBarComponent
                v-model="activeTab"
                :disabled="isSearchActive"
                :possible-values="possibleTabValues"
              />
              <SearchInputComponent
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
        <div v-if="activeTab === category || isSearchActive" :key="category">
          <div
            v-for="(component, name) in componentByName"
            :key="category + name"
          >
            <HeadlineWithAnchorLink :title="name" />
            <div class="component">
              <component :is="name" />
            </div>
          </div>
        </div>
      </template>
    </main>
    <ToastStack />
    <HintProvider />
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
    background-image: linear-gradient(
      270deg,
      hsl(0deg 0% 100% / 0%) 0%,
      var(--knime-white) 100%
    );
  }

  & :deep(.shadow-wrapper::after) {
    background-image: linear-gradient(
      90deg,
      hsl(0deg 0% 100% / 0%) 0%,
      var(--knime-white) 100%
    );
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

    @media only screen and (width <= 1280px) {
      position: relative;
      margin-bottom: 30px;
    }
  }
}

.component:deep(.grid-container:first-of-type p:first-child) {
  margin-top: 0;
}
</style>
