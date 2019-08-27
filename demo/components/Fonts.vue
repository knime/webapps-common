<template>
  <div>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <h2>Fonts</h2>
          <p>
            We use <a href="https://fonts.google.com/specimen/Roboto">Roboto</a>
            and <a href="https://fonts.google.com/specimen/Roboto+Mono">Roboto Mono</a>.
          </p>
          <p>
            The npm modules <samp>typeface-roboto</samp> and <samp>typeface-roboto-mono</samp> must be installed for
            this to work.
          </p>
        </div>
      </div>
    </section>
    <section class="demo">
      <div class="grid-container">
        <div class="grid-item-12">
          <p style="font-weight: 300;">
            This is Roboto Light (300).
          </p>
          <p style="font-weight: 400;">
            This is Roboto Regular (400).
          </p>
          <p style="font-weight: 500;">
            This is Roboto Medium (500).
          </p>
          <p style="font-weight: 700;">
            This is Roboto Bold (700).
          </p>
          <code>
            This is Roboto Mono (300).
          </code>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="postcss">
@import "../../ui/css/variables";

.demo {
  background: var(--theme-color-5);

  & .grid-item-12 {
    padding: 1em 0;
  }
}

code,
samp {
  font-family: "Roboto Mono", sans-serif;
}

code {
  display: inline-block;
  border: 1px solid var(--theme-color-6);
  font-weight: 300;
  background: white;
  padding: 0.5em;
}
</style>
