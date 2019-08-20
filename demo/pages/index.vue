<script>
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
        TabBar,
        Icons
    }
};
</script>

<template>
  <main>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <h1>Webapps Common Components</h1>
          <p>TODO</p>
        </div>
      </div>
    </section>
    <Fonts />
    <Colors />
    <Grid />
    <Images />
    <Icons />
    <Breadcrumb />
    <Buttons />
    <Collapser />
    <Description />
    <TabBar />
  </main>
</template>

<style lang="postcss">
main > * {
  margin-bottom: 5vmin;
}
</style>
