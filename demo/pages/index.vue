<script>
import 'prismjs';

import Fonts from '../components/Fonts';
import Colors from '../components/Colors';
import Headlines from '../components/Headlines';
import Description from '../components/Description';
import Grid from '../components/Grid';
import Images from '../components/Images';
import Icons from '../components/Icons';
import Breadcrumb from '../components/Breadcrumb';
import Button from '../components/Button';
import FunctionButton from '../components/FunctionButton';
import SubMenu from '../components/SubMenu';
import SplitButton from '../components/SplitButton';
import IdleReadyButton from '../components/IdleReadyButton';
import Collapser from '../components/Collapser';
import TabBar from '../components/TabBar';
import Carousel from '../components/Carousel';
import Message from '../components/Message';
import CollapsibleMessage from '../components/CollapsibleMessage';
import Messages from '../components/Messages';
import Label from '../components/Label';
import Fieldset from '../components/Fieldset';
import InputField from '../components/InputField';
import TextArea from '../components/TextArea';
import NumberInput from '../components/NumberInput';
import Checkbox from '../components/Checkbox';
import Checkboxes from '../components/Checkboxes';
import RadioButtons from '../components/RadioButtons';
import ListBox from '../components/ListBox';
import Dropdown from '../components/Dropdown';
import Multiselect from '../components/Multiselect';
import MultiselectListBox from '../components/MultiselectListBox';
import Twinlist from '../components/Twinlist';
import OpenSourceCredits from '../components/OpenSourceCredits';

export default {
    components: {
        Fonts,
        Colors,
        Headlines,
        Description,
        Grid,
        Images,
        Icons,
        Breadcrumb,
        Button,
        FunctionButton,
        SubMenu,
        SplitButton,
        IdleReadyButton,
        Collapser,
        TabBar,
        Carousel,
        Message,
        CollapsibleMessage,
        Messages,
        Label,
        Fieldset,
        InputField,
        TextArea,
        NumberInput,
        Checkbox,
        Checkboxes,
        RadioButtons,
        ListBox,
        Dropdown,
        Multiselect,
        MultiselectListBox,
        Twinlist,
        OpenSourceCredits
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
    <Button />
    <FunctionButton />
    <SubMenu />
    <SplitButton />
    <IdleReadyButton />
    <Collapser />
    <TabBar />
    <Carousel />
    <Message />
    <CollapsibleMessage />
    <Messages />
    <Label />
    <Fieldset />
    <InputField />
    <TextArea />
    <NumberInput />
    <Checkbox />
    <Checkboxes />
    <RadioButtons />
    <ListBox />
    <Dropdown />
    <Multiselect />
    <MultiselectListBox />
    <Twinlist />
    <OpenSourceCredits />
  </main>
</template>

<style scoped lang="postcss">
main {
  margin-bottom: 10em;
}
</style>
