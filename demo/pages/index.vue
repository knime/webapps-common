<script>
import 'prismjs';

import Fonts from '../components/Fonts';
import Colors from '../components/Colors';
import Grid from '../components/Grid';
import Icons from '../components/Icons';
import Images from '../components/Images';
import Breadcrumb from '../components/Breadcrumb';
import Buttons from '../components/Buttons';
import SplitButton from '../components/SplitButton';
import Collapser from '../components/Collapser';
import Description from '../components/Description';
import TabBar from '../components/TabBar';
import Message from '../components/Message';
import Messages from '../components/Messages';
import SubMenu from '../components/SubMenu';
import Headlines from '../components/Headlines';
import IdleReadyButton from '../components/IdleReadyButton';
import Label from '../components/Label';
import Fieldset from '../components/Fieldset';
import InputField from '../components/InputField';
import TextArea from '../components/TextArea';
import NumberInput from '../components/NumberInput';
import Checkbox from '../components/Checkbox';
import RadioButtons from '../components/RadioButtons';
import ListBox from '../components/ListBox';
import Dropdown from '../components/Dropdown';
import Multiselect from '../components/Multiselect';
import MultiselectListBox from '../components/MultiselectListBox';
import Checkboxes from '../components/Checkboxes';
import Twinlist from '../components/Twinlist';


export default {
    components: {
        Fonts,
        Colors,
        Grid,
        Images,
        Breadcrumb,
        Buttons,
        SplitButton,
        Collapser,
        Description,
        Headlines,
        TabBar,
        Icons,
        Message,
        Messages,
        SubMenu,
        IdleReadyButton,
        Label,
        Fieldset,
        InputField,
        TextArea,
        NumberInput,
        Checkbox,
        RadioButtons,
        ListBox,
        Dropdown,
        Multiselect,
        MultiselectListBox,
        Checkboxes,
        Twinlist
    }
};
</script>

<template>
  <main>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <h1>Web Apps Common Components</h1>
          <p>
            This page gives an overview of shared CSS, assets like icons and UI components.
            It's recommended to integrate them as Git submodule as described in the
            <a href="https://bitbucket.org/KNIME/webapps-common/src/master/README.md">README.md</a>.
          </p>
        </div>
      </div>
    </section>
    <Fonts />
    <Colors />
    <Headlines />
    <Description />
    <Grid />
    <Images />
    <Icons />
    <Breadcrumb />
    <Buttons />
    <SplitButton />
    <Collapser />
    <TabBar />
    <Message />
    <Messages />
    <SubMenu />
    <IdleReadyButton />
    <Label />
    <Fieldset />
    <InputField />
    <TextArea />
    <NumberInput />
    <Checkbox />
    <RadioButtons />
    <ListBox />
    <Dropdown />
    <Multiselect />
    <MultiselectListBox />
    <Checkboxes />
    <Twinlist />
  </main>
</template>

<style scoped lang="postcss">
main {
  margin-bottom: 10em;
}
</style>
