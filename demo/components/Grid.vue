<template>
  <div>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <h2>Grid System</h2>
          <p>
            The grid system consists of 12 columns. You can use it by nesting a <code>&lt;section&gt;</code> and a
            <code>.grid-container</code> with up to twelve <code>.grid-item</code>s as shown below.
          </p>
          <p>
            The section stretches across the whole screen, and can be used for background-colors. The grid container
            limits the width of the actual content. The grid items need not necessarily add up to 12 columns.
          </p>
          <p>Grids items can be nested in another grid container.</p>
          <p>The grid has a responsive design. Threrefore two breakpoints are set. This reduces the number of columns
            the consists of to 4(at 1180px) and 2(at 900px) respectively. Grid items will be grouped together equally
            to fit the scheme.</p>
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
  </div>
</template>

<style scoped lang="postcss">
@import "webapps-common/ui/css/variables";

.grid-demo {
  font-weight: 500;
  min-height: 10vmin;
  background: rgba(0, 0, 0, 0.1);
  outline: 1px solid rgba(0, 0, 0, 0.2);
  margin-bottom: 2vmin;
  transition: box-shadow 0.2s linear;

  &:hover {
    box-shadow: 0 0 1vmin rgba(0, 0, 0, 0.2);
  }

  & .grid-container {
    outline: 2px dotted purple;
    background-image: linear-gradient(
      45deg,
      transparent 0%,
      transparent 25%,
      rgba(128, 0, 128, 0.1) 25%,
      rgba(128, 0, 128, 0.1) 50%,
      transparent 50%,
      transparent 75%,
      rgba(128, 0, 128, 0.1) 75%,
      rgba(128, 0, 128, 0.1) 100%
    );
    background-size: 4vmin 4vmin;
    position: relative;
    transition: background-color 0.2s linear;

    &:hover {
      background-color: rgba(255, 0, 255, 0.1);
    }

    &::before {
      content: '.grid-container';
      color: purple;
      position: absolute;
      left: 1vmin;
      top: 1vmin;
    }

    &::after {
      content: 'section';
      position: absolute;
      line-height: 10vmin;
      left: calc(-3 * var(--grid-gap-width));
    }

    & .grid-container::after {
      content: '';
    }

    & [class^="grid-item-"] {
      border: 2px solid green;
      background-image: linear-gradient(
        135deg,
        transparent 0%,
        transparent 25%,
        rgba(0, 200, 0, 0.1) 25%,
        rgba(0, 200, 0, 0.1) 50%,
        transparent 50%,
        transparent 75%,
        rgba(0, 200, 0, 0.1) 75%,
        rgba(0, 200, 0, 0.1) 100%
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
        background-color: rgba(0, 255, 0, 0.5);
      }
    }

    & [class^="grid-item-"] [class^="grid-item-"]::before {
      margin-top: 2vmin;
    }
  }
}
</style>
