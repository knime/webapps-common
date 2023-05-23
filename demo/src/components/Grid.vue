<script>
import Description from "webapps-common/ui/components/Description.vue";

export default {
  components: {
    Description,
  },
};
</script>

<template>
  <div>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <p>
            The grid system consists of 12 columns. You can use it by nesting a
            <code>&lt;section&gt;</code> and a <code>.grid-container</code> with
            up to twelve <code>.grid-item</code>s as shown below.
          </p>
          <p>
            The section stretches across the whole screen, and can be used for
            background-colors. The grid container limits the width of the actual
            content. The grid items need not necessarily add up to 12 columns.
          </p>
          <p>Grids items can be nested in another grid container.</p>
        </div>
      </div>
    </section>
    <section class="grid-demo">
      <div class="grid-container">
        <div class="grid-item-1" />
        <div class="grid-item-1" />
        <div class="grid-item-1" />
        <div class="grid-item-1" />
        <div class="grid-item-1" />
        <div class="grid-item-1" />
        <div class="grid-item-1" />
        <div class="grid-item-1" />
        <div class="grid-item-1" />
        <div class="grid-item-1" />
        <div class="grid-item-1" />
        <div class="grid-item-1" />
      </div>
    </section>
    <section class="grid-demo">
      <div class="grid-container">
        <div class="grid-item-3" />
        <div class="grid-item-2" />
        <div class="grid-item-7" />
      </div>
    </section>
    <section class="grid-demo">
      <div class="grid-container">
        <div class="grid-item-8" />
      </div>
    </section>
    <section class="grid-demo">
      <div class="grid-container">
        <div class="grid-item-6" />
        <div class="grid-item-6">
          Nested
          <div class="grid-container">
            <div class="grid-item-3" />
            <div class="grid-item-3" />
          </div>
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <Description class="grid-item-12">
          <h5>Responsiveness</h5>
          <p>
            The grid has a responsive design. Therefore two breakpoints are set.
            This reduces the number of columns the consists of to four (at
            1180px) and two (at 900px) respectively. Grid items will be grouped
            together equally to fit the scheme.
          </p>
          <figure>
            <figcaption class="h7" role="heading" aria-level="7">
              Grid item sizes at given resolution
            </figcaption>
            <table>
              <tbody>
                <tr>
                  <th>Resolution</th>
                  <th>.grid-item-1</th>
                  <th>.grid-item-2</th>
                  <th>.grid-item-3</th>
                  <th>.grid-item-4</th>
                  <th>.grid-item-5</th>
                  <th>.grid-item-6</th>
                  <th>.grid-item-7</th>
                  <th>.grid-item-8</th>
                  <th>.grid-item-9</th>
                  <th>.grid-item-10</th>
                  <th>.grid-item-11</th>
                  <th>.grid-item-12</th>
                </tr>
                <tr>
                  <td>&gt; 1180px</td>
                  <td>1 / 12</td>
                  <td>2 / 12</td>
                  <td>3 / 12</td>
                  <td>4 / 12</td>
                  <td>5 / 12</td>
                  <td>6 / 12</td>
                  <td>7 / 12</td>
                  <td>8 / 12</td>
                  <td>9 / 12</td>
                  <td>10 / 12</td>
                  <td>11 / 12</td>
                  <td>12 / 12</td>
                </tr>
                <tr>
                  <td>901px … 1180px</td>
                  <td colspan="3">1 / 4</td>
                  <td colspan="3">2 / 4</td>
                  <td colspan="3">3 / 4</td>
                  <td colspan="3">4 / 4</td>
                </tr>
                <tr>
                  <td>&le; 900px</td>
                  <td colspan="6">1 / 2</td>
                  <td colspan="6">2 / 2</td>
                </tr>
              </tbody>
            </table>
          </figure>
        </Description>
      </div>
    </section>
  </div>
</template>

<style scoped lang="postcss">
.grid-demo {
  font-weight: 500;
  min-height: 10vmin;
  background: rgb(0 0 0 / 10%);
  outline: 1px solid rgb(0 0 0 / 20%);
  margin-bottom: 2vmin;
  transition: box-shadow 0.2s linear;

  &:hover {
    box-shadow: 0 0 1vmin rgb(0 0 0 / 20%);
  }

  & .grid-container {
    outline: 2px dotted purple;
    background-image: linear-gradient(
      45deg,
      transparent 0%,
      transparent 25%,
      rgb(128 0 128 / 10%) 25%,
      rgb(128 0 128 / 10%) 50%,
      transparent 50%,
      transparent 75%,
      rgb(128 0 128 / 10%) 75%,
      rgb(128 0 128 / 10%) 100%
    );
    background-size: 4vmin 4vmin;
    position: relative;
    transition: background-color 0.2s linear;

    &:hover {
      background-color: rgb(255 0 255 / 10%);
    }

    &::before {
      content: ".grid-container";
      color: purple;
      position: absolute;
      left: 1vmin;
      top: 1vmin;
    }

    &::after {
      content: "section";
      position: absolute;
      line-height: 10vmin;
      left: calc(-3 * var(--grid-gap-width));
    }

    & .grid-container::after {
      content: "";
    }

    & [class^="grid-item-"] {
      border: 2px solid green;
      background-image: linear-gradient(
        135deg,
        transparent 0%,
        transparent 25%,
        rgb(0 200 0 / 10%) 25%,
        rgb(0 200 0 / 10%) 50%,
        transparent 50%,
        transparent 75%,
        rgb(0 200 0 / 10%) 75%,
        rgb(0 200 0 / 10%) 100%
      );
      background-size: 4vmin 4vmin;
      white-space: pre;
      overflow: visible;
      min-height: 10vmin;
      transition: background-color 0.2s linear;

      &::before {
        content: "." attr(class);
        position: absolute;
        color: green;
        line-height: 10vmin;
      }

      &:hover {
        background-color: rgb(0 255 0 / 50%);
      }
    }

    & [class^="grid-item-"] [class^="grid-item-"]::before {
      margin-top: 2vmin;
    }
  }
}

table {
  font-size: 15px;
  text-align: center;

  & th,
  & td {
    text-align: center !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
}

figure {
  margin: 0;
}
</style>
