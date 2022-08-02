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

import ImageIcon from 'webapps-common/ui/assets/img/icons/media-image.svg?inline';
import InteractiveIcon from 'webapps-common/ui/assets/img/icons/interactive.svg?inline';
import PaletteIcon from 'webapps-common/ui/assets/img/icons/color-palette.svg?inline';
import CheckboxIcon from 'webapps-common/ui/assets/img/icons/checkboxes.svg?inline';
import TooltipIcon from 'webapps-common/ui/assets/img/icons/tooltip.svg?inline';
import UnknownIcon from 'webapps-common/ui/assets/img/icons/file-question.svg?inline';

export default {
    components: {
        Breadcrumb,
        Button,
        Carousel,
        Checkbox,
        Checkboxes,
        Collapser,
        Colors,
        DateTimeInput,
        Description,
        Dropdown,
        Fieldset,
        Fonts,
        FunctionButton,
        FileLink,
        Grid,
        Headlines,
        Icons,
        IdleReadyButton,
        Images,
        InputField,
        Label,
        LinkList,
        ListBox,
        Message,
        Messages,
        Modal,
        Multiselect,
        MultiselectListBox,
        NodeFeatureList,
        NodePreview,
        NumberInput,
        OpenSourceCredits,
        RadioButtons,
        ValueSwitch,
        SplitButton,
        SubMenu,
        TabBar,
        TabBarDemo,
        TagList,
        TextArea,
        TimePartInput,
        ToggleSwitch,
        Tooltip,
        Twinlist,
        LoadingIcon
    },
    mixins: [tabBarMixin],
    computed: {
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

          <TabBar
            :value.sync="activeTab"
            :possible-values="possibleTabValues"
          />
        </div>
      </div>
    </section>

    <template v-if="activeTab === 'layout'">
      <Fonts />
      <Colors />
      <Headlines />
      <Description />
      <Grid />
    </template>
    <template v-if="activeTab === 'images'">
      <Images />
      <Icons />
    </template>
    <template v-if="activeTab === 'interactive'">
      <Breadcrumb />
      <LinkList />
      <Button />
      <Carousel />
      <Collapser />
      <FunctionButton />
      <FileLink />
      <IdleReadyButton />
      <Modal />
      <SubMenu />
      <SplitButton />
      <Tooltip />
      <TabBarDemo />
      <TagList />
      <LoadingIcon />
    </template>
    <template v-if="activeTab === 'messages'">
      <Message />
      <Messages />
    </template>
    <template v-if="activeTab === 'forms'">
      <Label />
      <Fieldset />
      <InputField />
      <TextArea />
      <NumberInput />
      <Checkbox />
      <Checkboxes />
      <RadioButtons />
      <ValueSwitch />
      <DateTimeInput />
      <TimePartInput />
      <ListBox />
      <Dropdown />
      <Multiselect />
      <MultiselectListBox />
      <ToggleSwitch />
      <Twinlist />
    </template>
    <template v-if="activeTab === 'misc'">
      <NodePreview />
      <NodeFeatureList />
      <OpenSourceCredits />
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

</style>
