<script>
/**
 * This component uses the <template> HTML tag to show a message banner only in outdated browsers.
 * Modern browsers will not render the <template> tag by default.
 */
export default {
    props: {
        text: {
            type: String,
            default: 'You are using an outdated browser.'
        }
    },
    data() {
        return {
            banner: `<template>
                <div class="legacy-browser-wrapper">
                  <label for="close-legacy-browser-warning">
                    Close
                  </label>
                  <input id="close-legacy-browser-warning" class="visually-hidden" type="checkbox">
                  <div class="legacy-browser-banner">
                    ${this.text}
                    <a href="https://browser-update.org/update-browser.html">Please update your browser</a>
                  </div>
                </div>
              </template>`
        };
    }
};
</script>

<template>
  <div
    v-once
    class="legacy-browser-banner"
    v-html="banner"
  />
</template>

<style lang="postcss">
/* We allow hex colors to not rely on css variables for old browser */
/* stylelint-disable color-no-hex */

.legacy-browser-banner template {
  /* This is needed as normalize.css usually hides template tags */
  display: block;
}

.legacy-browser-wrapper {
  pointer-events: none;
  position: fixed;
  bottom: 0;
  width: 100%;
  font-size: 16px;
  box-sizing: border-box;
  z-index: 999;
}

.legacy-browser-banner {
  height: 100%;
  min-height: 60px;
  padding: 20px;
  color: #fff;
  background-color: #3e3a39;
}

.legacy-browser-wrapper label {
  cursor: pointer;
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  font-weight: 500;
  padding: 15px;
  color: #fff;
}

.legacy-browser-wrapper input[type="checkbox"]:checked ~ .legacy-browser-banner,
.legacy-browser-wrapper input[type="checkbox"]:checked {
  display: none;
}

.legacy-browser-wrapper a {
  font-weight: 500;
}

template * {
  pointer-events: all;
}

</style>
