<script>
import { ProgressBar } from "@knime/components";

export default {
  components: {
    ProgressBar,
  },
  data() {
    return {
      progress: 0,
      progressing: false,
      intervalId: null,
    };
  },
  methods: {
    startProgress() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
      this.progress = 0;
      this.progressing = true;

      this.intervalId = setInterval(() => {
        if (this.progress < 100) {
          this.progress += 1;
        } else {
          clearInterval(this.intervalId);
          this.progressing = false;
        }
      }, 100);
    },
  },
};
</script>

<template>
  <div>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <button :disabled="progressing" @click="startProgress">
            Start progress
          </button>
        </div>
      </div>
      <br />
      <div class="grid-container">
        <div class="grid-item-12">
          <div class="grid-item-6">
            <p>Progress bar</p>
          </div>
          <div class="grid-item-6">
            <ProgressBar :percentage="progress" />
          </div>
        </div>
      </div>
      <br />
      <div class="grid-container">
        <div class="grid-item-12">
          <div class="grid-item-6">
            <p>Progress bar with compact mode</p>
          </div>
          <div class="grid-item-6">
            <ProgressBar :percentage="progress" :compact="true" />
          </div>
        </div>
      </div>
      <br />
      <div class="grid-container">
        <div class="grid-item-12">
          <div class="grid-item-6">
            <p>Progress bar with indeterminate progress</p>
          </div>
          <div class="grid-item-6">
            <ProgressBar :percentage="progress" :indeterminate="true" />
          </div>
        </div>
      </div>
      <br />
      <div class="grid-container">
        <div class="grid-item-12">
          <div class="grid-item-6">
            <p>Indeterminate progress bar with compact mode</p>
          </div>
          <div class="grid-item-6">
            <ProgressBar
              :percentage="progress"
              :indeterminate="true"
              :compact="true"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
