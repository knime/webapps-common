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
  display: inline-block;
  position: relative;

  & > img {
    padding: 10px;
    margin: 10px;
  }

  & > img.checkerboard {
    --checkerboard-color: var(--knime-silver-sand);
    --checkerboard-size: 15px;

    border: 1px solid var(--checkerboard-color);
    background-image: linear-gradient(
        45deg,
        var(--checkerboard-color) 25%,
        transparent 25%
      ),
      linear-gradient(-45deg, var(--checkerboard-color) 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, var(--checkerboard-color) 75%),
      linear-gradient(-45deg, transparent 75%, var(--checkerboard-color) 75%);
    background-size: var(--checkerboard-size) var(--checkerboard-size);
    background-position:
      0 0,
      0 calc(var(--checkerboard-size) / 2),
      calc(var(--checkerboard-size) / 2) calc(var(--checkerboard-size) / 2 * -1),
      calc(var(--checkerboard-size) / 2 * -1) 0;
  }

  &:hover > img {
    background-color: var(--knime-silver-sand);
    background-image: none;
  }

  & > span {
    display: none;
    position: absolute;
    bottom: -20px;
    transform: translate(-50%, 0);
    left: 50%;
    padding: 8px;
    z-index: 1;
    background-color: var(--knime-masala);
    color: var(--knime-white);
    text-align: center;
    white-space: nowrap;
  }

  &:hover > span {
    display: block;
  }
}
</style>
