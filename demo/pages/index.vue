<script>
import 'prismjs';

import Breadcrumb from '../components/Breadcrumb';
import Button from '../components/Button';
import Carousel from '../components/Carousel';
import Checkbox from '../components/Checkbox';
import Checkboxes from '../components/Checkboxes';
import Collapser from '../components/Collapser';
import Colors from '../components/Colors';
import DateTimeInput from '../components/DateTimeInput';
import Description from '../components/Description';
import Dropdown from '../components/Dropdown';
import Fieldset from '../components/Fieldset';
import Fonts from '../components/Fonts';
import FunctionButton from '../components/FunctionButton';
import FileLink from '../components/FileLink';
import Grid from '../components/Grid';
import Headlines from '../components/Headlines';
import Icons from '../components/Icons';
import IdleReadyButton from '../components/IdleReadyButton';
import Images from '../components/Images';
import InputField from '../components/InputField';
import Label from '../components/Label';
import LinkList from '../components/LinkList';
import ListBox from '../components/ListBox';
import Message from '../components/Message';
import Messages from '../components/Messages';
import Modal from '../components/Modal';
import Multiselect from '../components/Multiselect';
import MultiselectListBox from '../components/MultiselectListBox';
import NodeFeatureList from '../components/NodeFeatureList';
import NodePreview from '../components/NodePreview';
import NumberInput from '../components/NumberInput';
import OpenSourceCredits from '../components/OpenSourceCredits';
import RadioButtons from '../components/RadioButtons';
import SplitButton from '../components/SplitButton';
import SubMenu from '../components/SubMenu';
import TabBarDemo from '../components/TabBar';
import TextArea from '../components/TextArea';
import TimePartInput from '../components/TimePartInut';
import ToggleSwitch from '../components/ToggleSwitch';
import Tooltip from '../components/Tooltip';
import Twinlist from '../components/Twinlist';
import TabBar, { tabBarMixin } from '../../ui/components/TabBar';

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
        SplitButton,
        SubMenu,
        TabBar,
        TabBarDemo,
        TextArea,
        TimePartInput,
        ToggleSwitch,
        Tooltip,
        Twinlist
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
                label: 'Images',
                icon: ImageIcon
            }, {
                value: 'interactive',
                label: 'Interactive UI',
                icon: InteractiveIcon
            }, {
                value: 'messages',
                label: 'Messages',
                icon: TooltipIcon
            }, {
                value: 'forms',
                label: 'Forms',
                icon: CheckboxIcon
            }, {
                value: 'widgets',
                label: 'Widgets',
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
          <h1>Web Apps Common Components</h1>
          <p>
            This page gives an overview of shared CSS, assets like icons and UI components.
            It's recommended to integrate them as Git submodule as described in the
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
      <DateTimeInput />
      <TimePartInput />
      <ListBox />
      <Dropdown />
      <Multiselect />
      <MultiselectListBox />
      <ToggleSwitch />
      <Twinlist />
    </template>
    <template v-if="activeTab === 'widgets'">
      <OpenSourceCredits />
      <NodePreview />
      <NodeFeatureList />
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
