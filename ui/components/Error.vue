<script>
/**
 * Generic error page content component with props
 * for status code and message. To be used with additional
 * logic in the error.vue layout of a nuxt web app.
 */

export default {
    props: {
        /**
         * Status code to be shown in the svg.
         * "?" default for runtime errors.
         */
        statusCode: {
            type: String,
            default: null
        },
        /**
         * Headline to display above the error message.
         */
        headline: {
            type: String,
            default: 'Something went wrong!'
        },
        /**
         * Status code specific message.
         */
        message: {
            type: String,
            default: 'An error occurred. Please try again.'
        }
    }
};
</script>

<template>
  <section class="top">
    <div class="grid-container">
      <div class="grid-item-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 800 400"
          fill="none"
          stroke-linejoin="round"
          preserveAspectRatio="xMidYMid meet"
          stroke-miterlimit="10"
        >
          <path
            stroke="#aaaaaa"
            stroke-dasharray="2,6"
            d="M271.4,179.9h65.1c53,0,33.2,95.8,90.2,74.3s129.1-71.7,69.3-81.7s-113-23.6-91.2,29.1s-8.5,68.2,52.2,75.2c
            60.8,7,80.6,3.2,51.3-22.6s-47.5,12-50.3-44.4s-19-82.4,14.2-81.4c33.2,1,87.4-10,86.4,30.1s14.2,67.4-18,65.8s
            -49.4,6.4-63.6,46.5s-23.7,56.1,14.2,72.2s74.8,15,70.2-25.1s-149-138-70.2-243.6c52.4-70.2,169,15,156.7,56.1s
            -96.9,162.4-14.3,203.5s112.7-6.6,111.1-41.1s-75.8-109.8,0-109.8"
          />
          <path
            stroke="#aaaaaa"
            stroke-width="1.5"
            d="M204.6,169.5h-31.3v-65.2H56.7 M204.6,190.2h-31.3v59.6h-39.8"
          />
          <path
            fill="#ff9632"
            d="M52.2,134.2H4.5C2,134.1-0.1,132,0,129.4V79.1c-0.1-2.6,2-4.7,4.5-4.8h47.6c2.6,0.1,4.6,2.2,4.5,4.8v50.3C
            56.8,132,54.7,134.1,52.2,134.2z M129,279.8H81.4c-2.6-0.1-4.6-2.2-4.5-4.8v-50.3c-0.1-2.6,2-4.7,4.5-4.8H129c
            2.6,0.1,4.6,2.2,4.5,4.8V275C133.6,277.6,131.6,279.7,129,279.8z"
          />
          <path
            fill="#ffd800"
            d="M265.3,209.8h-47.6c-2.6-0.1-4.6-2.2-4.5-4.8v-50.3c-0.1-2.6,2-4.7,4.5-4.8h47.6c2.6,0.1,4.6,2.2,4.5,4.8V205
            C269.9,207.6,267.8,209.7,265.3,209.8z"
          />
          <path
            fill="#3e3a39"
            d="M65.2,104.2l-8.5-5.2v10.4L65.2,104.2z M278.3,179.9l-8.5-5.2v10.4L278.3,179.9z M213.1,190.3l-8.5-5.2v10.4L
            213.1,190.3z M213.1,169.5l-8.5-5.2v10.4L213.1,169.5z M142.1,249.9l-8.5-5.2v10.4L142.1,249.9z"
          />
          <path
            fill="#469990"
            d="M795.5,209.8h-47.6c-2.6-0.1-4.6-2.2-4.5-4.8v-50.3c-0.1-2.6,2-4.7,4.5-4.8h47.6c2.6,0.1,4.6,2.2,4.5,4.8V205
            C800.1,207.6,798,209.7,795.5,209.8z"
          />
          <text
            v-if="statusCode"
            x="772"
            y="182"
            class="error-status"
            dy=".35em"
            text-anchor="middle"
          >{{ statusCode }}</text>
          <g
            v-else
            stroke="#ffffff"
          >
            <path d="M771.6,164.7L755.1,195 788.2,195zM771.6,174.1v10" />
            <line
              stroke-width="1.6"
              stroke-linecap="round"
              x1="771.6"
              y1="189.4"
              x2="771.6"
              y2="189.4"
            />
          </g>
        </svg>
        <h2>{{ headline }}</h2>
        <p class="error-message">{{ message }}</p>
      </div>
    </div>
  </section>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

.top {
  text-align: center;
  background-color: var(--knime-white);
}

.grid-container {
  justify-content: center;
  overflow: hidden; /* IE11 */
}

svg {
  margin-top: 40px;
  width: 800px; /* IE11 / old Edge */
  height: 400px; /* IE11 / old Edge */

  @supports not (-ms-ime-align:auto) {
    /* actual browsers */
    width: 100%;
    height: auto;
  }

  & .error-status {
    font: 30px sans-serif;
    font-weight: 300;
    font-size: 18px;
    fill: var(--knime-white);
  }
}

.error-message {
  font-size: 22px;
  font-weight: 300;
  line-height: 33px;
  margin-bottom: 100px;
  margin-top: -10px;
}
</style>
