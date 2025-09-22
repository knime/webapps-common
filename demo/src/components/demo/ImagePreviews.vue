<script>
export default {
  props: {
    images: {
      type: Array,
      default: () => [],
    },
    width: {
      type: String,
      default: "60px",
    },
    height: {
      type: String,
      default: "60px",
    },
    checkerboard: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<template>
  <div class="wrapper">
    <div v-for="(image, index) of images" :key="index" class="image">
      <img
        :src="image.src"
        :class="{ checkerboard }"
        :style="{ width, height }"
      />
      <span>{{ image.name }}</span>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.wrapper {
  margin: 0 -10px;
}

.image {
  position: relative;
  display: inline-block;

  & > img {
    padding: 10px;
    margin: 10px;
  }

  & > img.checkerboard {
    --checkerboard-color: var(--knime-silver-sand);
    --checkerboard-size: 15px;

    background-image: linear-gradient(
        45deg,
        var(--checkerboard-color) 25%,
        transparent 25%
      ),
      linear-gradient(-45deg, var(--checkerboard-color) 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, var(--checkerboard-color) 75%),
      linear-gradient(-45deg, transparent 75%, var(--checkerboard-color) 75%);
    background-position:
      0 0,
      0 calc(var(--checkerboard-size) / 2),
      calc(var(--checkerboard-size) / 2) calc(var(--checkerboard-size) / 2 * -1),
      calc(var(--checkerboard-size) / 2 * -1) 0;
    background-size: var(--checkerboard-size) var(--checkerboard-size);
    border: 1px solid var(--checkerboard-color);
  }

  &:hover > img {
    background-color: var(--knime-silver-sand);
    background-image: none;
  }

  & > span {
    position: absolute;
    bottom: -20px;
    left: 50%;
    z-index: 1;
    display: none;
    padding: 8px;
    color: var(--knime-white);
    text-align: center;
    white-space: nowrap;
    background-color: var(--knime-masala);
    transform: translate(-50%, 0);
  }

  &:hover > span {
    display: block;
  }
}
</style>
