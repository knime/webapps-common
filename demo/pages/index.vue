<script>
import 'prismjs';

import Breadcrumb from '../components/Breadcrumb.vue';
import Button from '../components/Button.vue';
import Carousel from '../components/Carousel.vue';
import Checkbox from '../components/Checkbox.vue';
import Checkboxes from '../components/Checkboxes.vue';
import Collapser from '../components/Collapser.vue';
import Colors from '../components/Colors.vue';
import DateTimeInput from '../components/DateTimeInput.vue';
import Description from '../components/Description.vue';
import Dropdown from '../components/Dropdown.vue';
import Fieldset from '../components/Fieldset.vue';
import Fonts from '../components/Fonts.vue';
import FunctionButton from '../components/FunctionButton.vue';
import FileLink from '../components/FileLink.vue';
import Grid from '../components/Grid.vue';
import Headlines from '../components/Headlines.vue';
import Icons from '../components/Icons.vue';
import IdleReadyButton from '../components/IdleReadyButton.vue';
import Images from '../components/Images.vue';
import InputField from '../components/InputField.vue';
import Label from '../components/Label.vue';
import LinkList from '../components/LinkList.vue';
import ListBox from '../components/ListBox.vue';
import LoadingIcon from '../components/LoadingIcon.vue';
import Message from '../components/Message.vue';
import Messages from '../components/Messages.vue';
import Modal from '../components/Modal.vue';
import Multiselect from '../components/Multiselect.vue';
import MultiselectListBox from '../components/MultiselectListBox.vue';
import NodeFeatureList from '../components/NodeFeatureList.vue';
import NodePreview from '../components/NodePreview.vue';
import NumberInput from '../components/NumberInput.vue';
import OpenSourceCredits from '../components/OpenSourceCredits.vue';
import RadioButtons from '../components/RadioButtons.vue';
import SideDrawer from '../components/SideDrawer.vue';
import ValueSwitch from '../components/ValueSwitch.vue';
import SplitButton from '../components/SplitButton.vue';
import SubMenu from '../components/SubMenu.vue';
import TabBarDemo from '../components/TabBar.vue';
import TagList from '../components/TagList.vue';
import TextArea from '../components/TextArea.vue';
import TimePartInput from '../components/TimePartInut.vue';
import ToggleSwitch from '../components/ToggleSwitch.vue';
import Tooltip from '../components/Tooltip.vue';
import Twinlist from '../components/Twinlist.vue';
import TabBar, { tabBarMixin } from '../../ui/components/TabBar.vue';
import SearchField from '../../ui/components/forms/InputField.vue';

import ImageIcon from 'webapps-common/ui/assets/img/icons/media-image.svg';
import InteractiveIcon from 'webapps-common/ui/assets/img/icons/interactive.svg';
import PaletteIcon from 'webapps-common/ui/assets/img/icons/color-palette.svg';
import CheckboxIcon from 'webapps-common/ui/assets/img/icons/checkboxes.svg';
import TooltipIcon from 'webapps-common/ui/assets/img/icons/tooltip.svg';
import UnknownIcon from 'webapps-common/ui/assets/img/icons/file-question.svg';
import SearchIcon from 'webapps-common/ui/assets/img/icons/lens.svg';

const demoComponents = {
    layout: {
        Fonts,
        Colors,
        Grid,
        Headlines,
        Description
    },
    images: {
        Images,
        Icons
    },
    interactive: {
        Breadcrumb,
        LinkList,
        Button,
        Carousel,
        Collapser,
        FunctionButton,
        FileLink,
        IdleReadyButton,
        Modal,
        SideDrawer,
        SubMenu,
        SplitButton,
        Tooltip,
        TabBarDemo,
        TagList,
        LoadingIcon
    },
    messages: {
        Message,
        Messages
    },
    forms: {
        Label,
        Fieldset,
        InputField,
        TextArea,
        NumberInput,
        Checkbox,
        Checkboxes,
        RadioButtons,
        ValueSwitch,
        DateTimeInput,
        TimePartInput,
        ListBox,
        Dropdown,
        Multiselect,
        MultiselectListBox,
        ToggleSwitch,
        Twinlist
    },
    misc: {
        NodePreview,
        NodeFeatureList,
        OpenSourceCredits
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
    SearchField,
    SearchIcon,
    ...flattenComponents(demoComponents)
};


export default {
    components,
    mixins: [tabBarMixin],
    data() {
        return {
            searchQuery: ''
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
                    if (name.toLowerCase().includes(this.searchQuery.trim().toLowerCase())) {
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
            return this.searchQuery.trim() !== '';
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
            }];
        }
    },
    created() {
        this.demoComponents = demoComponents;
    }
};
</script>

<template>
  <main>
    <section>
      <div class="grid-container header">
        <div class="grid-item-12">
          <h1>KNIME WebApps Common</h1>
          <p>
            This page gives an overview of shared CSS, assets like icons and Vue-based UI components.
            To use them, it's recommended to integrate them as Git submodule as described in the
            <a href="https://bitbucket.org/KNIME/webapps-common/src/master/README.md">README.md</a>.
          </p>

          <div class="categories">
            <TabBar
              :disabled="isSearchActive"
              :value.sync="activeTab"
              :possible-values="possibleTabValues"
            />
            <SearchField
              v-model="searchQuery"
              autofocus
              type="search"
              placeholder="Filter by component name…"
              class="search"
            >
              <template #icon><SearchIcon /></template>
            </SearchField>
          </div>
        </div>
      </div>
    </section>

    <template v-for="(componentByName, category) in filteredDemoComponents">
      <div
        v-if="activeTab === category || isSearchActive"
        :key="category"
      >
        <component
          :is="name"
          v-for="(component, name) in componentByName"
          :key="category+name"
        />
      </div>
    </template>
  </main>
</template>

<style scoped lang="postcss">
main {
  margin-bottom: 10em;
}

.header {
  margin-bottom: -30px;
}

section {
  & >>> .shadow-wrapper::before {
    background-image: linear-gradient(270deg, hsla(0, 0%, 100%, 0) 0%, var(--knime-white) 100%);
  }

  & >>> .shadow-wrapper::after {
    background-image: linear-gradient(90deg, hsla(0, 0%, 100%, 0) 0%, var(--knime-white) 100%);
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
