<script>
/**
 * Generic error page content component with props
 * for status code and message. To be used with addtional
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
            default: '?'
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
            stroke="#aaa"
            stroke-dasharray="2 6"
            stroke-width="2"
            d="M281.72 181.98h57.44c46.7 0 29.3 80.04 79.53 62.06s113.86-59.85 61.12-68.22c-52.74-8.37-99.63-19.66
              -80.37 24.28 19.26 43.94-7.53 56.93 46.05 62.79 53.58 5.86 71.09 2.7 45.21-18.85-25.88-21.55-41.86 10.01
              -44.37-37.06s-16.74-68.83 12.56-68 77.02-8.37 76.19 25.12c-.84 33.49 12.56 56.3-15.91 54.94-28.47-1.36
              -43.53 5.34-56.09 38.83-12.56 33.49-20.93 46.88 12.56 60.28 33.49 13.4 65.97 12.56 61.87-20.93S406.13
              181.98 475.62 93.77c46.17-58.6 149.02 12.56 138.14 46.88s-85.4 135.63-12.56 169.95 99.38-5.51 97.95
              -34.36c-1.43-28.84-66.78-91.68 0-91.68"
          />
          <path
            stroke="#aaa"
            stroke-width="1.5"
            d="M222.79 173.32h-27.57v-54.5H92.42M222.79 190.65h-27.57v49.8h-35.07"
          />
          <path
            fill="#ff9632"
            d="M88.42 143.82h-42c-2.2 0-4-1.8-4-4v-42c0-2.2 1.8-4 4-4h42c2.2 0 4 1.8 4 4v42c0 2.2-1.8 4-4 4zM156.15
               265.45h-42c-2.2 0-4-1.8-4-4v-42c0-2.2 1.8-4 4-4h42c2.2 0 4 1.8 4 4v42c0 2.2-1.8 4-4 4z"
          />
          <path
            fill="#ffd800"
            d="M276.29 206.98h-42c-2.2 0-4-1.8-4-4v-42c0-2.2 1.8-4 4-4h42c2.2 0 4 1.8 4 4v42c0 2.2-1.8 4-4 4z"
          />
          <path
            fill="#3e3a39"
            d="M99.92 118.82l-7.5-4.33v8.66zM287.79 181.98l-7.5-4.33v8.66zM230.29 190.65l-7.5-4.33v8.66zM230.29
               173.32l-7.5-4.33v8.66zM167.73 240.45l-7.5-4.34v8.67z"
          />
          <path
            fill="#469990"
            d="M743.73 206.98h-42c-2.2 0-4-1.8-4-4v-42c0-2.2 1.8-4 4-4h42c2.2 0 4 1.8 4 4v42c0 2.2-1.8 4-4 4z"
          />
          <path
            stroke="#fff"
            d="M70.93 105.32l5.42 5.42h-5.42z"
          />
          <path
            stroke="#fff"
            d="M76.35 132.32H55.2v-27h15.73l5.42 5.42v4.03"
          />
          <path
            stroke="#fff"
            d="M74.21 118.36l5.43 5.44-5.43 5.43M79.64 123.8h-12M241.29 172.65h28v6.67h-28zM241.29 184.65h28v6.67h
                  -28zM255.29 172.65v6.66M262.29 172.65v6.66M248.29 172.65v6.66M255.29 184.49v6.66M262.29 184.49v6
                  .66M248.29 184.49v6.66"
          />
          <ellipse
            stroke="#fff"
            cx="135.15"
            cy="233.74"
            rx="11"
            ry="5.63"
          />
          <path
            stroke="#fff"
            d="M146.15 240.38c0 3.11-4.92 5.63-11 5.63s-11-2.52-11-5.63M146.15 247.15c0 3.11-4.92 5.63-11 5.63s
               -11-2.52-11-5.63"
          />
          <text
            x="722"
            y="182"
            class="error-status"
            dy=".35em"
            text-anchor="middle"
          >{{ statusCode }}</text>
        </svg>
        <h2>Oops!</h2>
        <p class="error-message">{{ message }}</p>
      </div>
    </div>
  </section>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

.top {
  text-align: center;
  background-color: var(--theme-color-white);
}

.grid-container {
  justify-content: center;
  overflow: hidden; /* IE11 */
}

svg {
  margin-top: 40px;
  width: 800px; /* IE11 / old Edge */
  height: 400px; /* IE11 / old Edge */

  @supports not (-ms-ime-align:auto) { /* actual browsers */
    width: 100%;
    height: auto;
  }

  & .error-status {
    font: 30px sans-serif;
    font-weight: 300;
    font-size: 18px;
    fill: var(--theme-color-white);
  }
}

.error-message {
  font-size: 22px;
  font-weight: 300;
  line-height: 33px;
  margin-bottom: 40px;
  margin-top: -10px;
}
</style>
