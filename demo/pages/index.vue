<script>
import 'prismjs';

import Fonts from '../components/Fonts';
import Colors from '../components/Colors';
import Grid from '../components/Grid';
import Icons from '../components/Icons';
import Images from '../components/Images';
import Breadcrumb from '../components/Breadcrumb';
import Buttons from '../components/Buttons';
import Collapser from '../components/Collapser';
import Description from '../components/Description';
import TabBar from '../components/TabBar';
import Messages from '../components/Messages';
import SubMenu from '../components/SubMenu';
import Headlines from '../components/Headlines';

export default {
    components: {
        Fonts,
        Colors,
        Grid,
        Images,
        Breadcrumb,
        Buttons,
        Collapser,
        Description,
        Headlines,
        TabBar,
        Icons,
        Messages,
        SubMenu
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
    <Collapser />
    <TabBar />
    <Messages />
    <SubMenu />
  </main>
</template>
