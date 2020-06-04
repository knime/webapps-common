<script>

export default {
    props: {
        /**
         * the text to be shown
         */
        text: {
            type: String,
            default: null
        },
        /**
         * whether the provided `text` should be rendered as HTML or plain text
         */
        renderAsHtml: {
            type: Boolean,
            default: false
        }
    }
};
</script>

<template>
  <div
    v-if="$slots.default"
    class="description"
  >
    <!-- @slot if content is provided via slot, the `text` and `renderAsHtml` props will be ignored -->
    <slot />
  </div>
  <!-- eslint-disable vue/no-v-html -->
  <div
    v-else-if="!$slots.default && renderAsHtml"
    class="description"
    v-html="text"
  />
  <div
    v-else
    class="description plain"
    v-text="text"
  />
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

.description {
  font-size: 18px;
  line-height: 26px;
  overflow-wrap: break-word;
  font-family: var(--theme-text-normal-font-family);
  color: var(--theme-text-normal-color);

  /*
    possible markup in Node description: a,b,br,h3,h4,hr,i,li,ol,p,pre,sub,sup,table,td,th,tr,tt,u,ul
    see https://bitbucket.org/KNIME/knime-core/src/3207ad3e20e242550d4c775e1af6d69cd521d9fd/org.knime.core/src/eclipse/org/knime/core/node/Node_v3.6.xsd#lines-334
    possible markup in Port description: a,b,br,hr,i,ol,p,pre,sub,sup,tt,u,ul
    see https://bitbucket.org/KNIME/knime-core/src/3207ad3e20e242550d4c775e1af6d69cd521d9fd/org.knime.core/src/eclipse/org/knime/core/node/Node_v3.6.xsd#lines-316
  */
  & >>> p {
    margin: 0 0 20px;
  }

  & >>> a {
    color: var(--theme-text-link-foreground-color);
    background: var(--theme-text-link-background-color);

    @supports (mask: url("") no-repeat 50% 50%) {
      &[href^="http"]::after {
        content: "";
        mask: url("../assets/img/icons/link-external.svg?data") no-repeat 50% 50%;
        mask-size: cover;
        background-color: var(--knime-masala); /* defines icon color */
        width: 16px;
        height: 16px;
        display: inline-block;
        margin-left: 4px;
        vertical-align: -2px;
      }
    }

    &:hover {
      outline: none;
      color: var(--theme-text-link-foreground-color-hover);
      background-color: var(--theme-text-link-background-color-hover);
      text-decoration: none;

      &::after {
        background-color: var(--theme-text-link-foreground-color-hover); /* defines icon color */
      }
    }

    &:focus,
    &:active {
      outline: none;
      color: var(--theme-text-link-foreground-color-focus);
      background-color: var(--theme-text-link-background-color-focus);
      text-decoration: none;

      &::after {
        background-color: var(--theme-text-link-foreground-color-focus); /* defines icon color */
      }
    }
  }

  & >>> pre,
  & >>> code, /* in case it will be used in the future since <tt> is deprecated */
  & >>> tt {
    background-color: var(--knime-white);
    border: 1px solid var(--knime-silver-sand);
    padding: 0 5px;
    font-size: 17px;
  }

  & >>> pre {
    padding: 3px 8px;
    white-space: pre-wrap;
    overflow: hidden; /* for nicer floating around node icon */
  }

  & >>> hr {
    border: 0;
    border-top: 1px solid var(--knime-silver-sand);
  }

  & >>> ul,
  & >>> ol {
    overflow: hidden; /* for nicer floating around node icon */
  }

  & >>> table {
    border-spacing: 15px 0;
    width: calc(100% + 2 * 15px);
    text-align: left;
    margin: 20px 0;
    position: relative;
    left: -15px;


    & th {
      font-weight: 500;
      font-family: var(--theme-text-medium-font-family);
      color: var(--theme-text-medium-color);
      border-bottom: solid 2px var(--knime-masala);
      text-align: inherit; /* IE11 */
    }

    & th,
    & td {
      padding: 4px 8px;
    }

    & td {
      border-bottom: solid 1px var(--knime-masala);
    }

    & colgroup {
      font-size: 16px;
      font-weight: 700;
      border-bottom: solid 3px var(--knime-masala);
    }
  }

  & >>> dt,
  & >>> b {
    font-weight: bold;
  }

  & >>> dd {
    margin-left: 15px;
  }
}

.plain {
  white-space: pre-line;
}

@media only screen and (max-width: 900px) {
  .plain {
    white-space: normal;
  }
}
</style>
