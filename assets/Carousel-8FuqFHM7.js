import{C as p}from"./CodeExample-XcerHC48.js";import{_ as u,C as h,r as l,o as g,c as m,b as e,d as s,w as a,e as i,t as d,p as f,f as w}from"./index-UFcGC5SI.js";const v=`<script lang="ts">
import { defineComponent } from "vue";
/**
 * Displays shadows on both sides of a carousel
 * indicate content being hidden which can be scrolled to
 */
const scrollThreshold = 5; // to prevent clicks not being bubbled to child by accident
let startX: number, scrollLeft: number, slider: HTMLDivElement;

export default defineComponent({
  data() {
    return {
      isMouseDown: false,
      wasDragged: false,
    };
  },
  /**
   * following methods allow dragging via mouse
   */
  methods: {
    onMouseDown(e: MouseEvent) {
      slider = this.$refs.carousel as HTMLDivElement;
      this.isMouseDown = true;
      this.wasDragged = false;
      startX = e.pageX;
      scrollLeft = slider.scrollLeft;
    },
    onMouseEnd(e: MouseEvent) {
      if (this.wasDragged) {
        e.preventDefault();
      }
      this.isMouseDown = false;
    },
    onMouseMove(e: MouseEvent) {
      if (!this.isMouseDown) {
        return;
      }
      e.preventDefault();
      const x = e.pageX;
      const walk = x - startX;
      if (this.wasDragged || Math.abs(walk) > scrollThreshold) {
        this.wasDragged = true;
        slider.scrollLeft = scrollLeft - walk;
      }
    },
    onDragStart(e: MouseEvent) {
      e.preventDefault();
    },
  },
});
<\/script>

<template>
  <div class="shadow-wrapper">
    <div
      ref="carousel"
      class="carousel"
      :class="{ 'is-mouse-down': isMouseDown }"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @mouseup="onMouseEnd"
      @click.capture="onMouseEnd"
      @mouseleave="onMouseEnd"
      @dragstart="onDragStart"
    >
      <slot />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.shadow-wrapper {
  position: relative;
  isolation: isolate;
  margin-left: calc(var(--grid-gap-width) * -1);
  margin-right: calc(var(--grid-gap-width) * -1);

  &::before,
  &::after {
    content: "";
    position: absolute;
    display: block;
    height: 100%;
    width: 12px;
    top: 0;
    z-index: 2; /* shadows should be on top of the content */
  }

  &::before {
    left: 0;
    background-image: linear-gradient(
      270deg,
      hsl(0deg 0% 100% / 0%) 0%,
      var(--knime-porcelain) 100%
    );
  }

  &::after {
    right: 0;
    background-image: linear-gradient(
      90deg,
      hsl(0deg 0% 100% / 0%) 0%,
      var(--knime-porcelain) 100%
    );
  }
}

.carousel {
  overflow-x: auto;
  white-space: nowrap;
  -ms-overflow-style: none; /* needed to hide scroll bar in edge */
  scrollbar-width: none; /* for firefox */
  padding-left: var(--grid-gap-width);
  padding-right: var(--grid-gap-width);
  user-select: none;

  &.is-mouse-down {
    cursor: grabbing;
  }

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
`,b=`
  <Carousel>
      <Statistics class="wrapper" />
  </Carousel>

<style>
  .wrapper {
    display: inline-flex; /* or inline-block */
    padding-left: 20px;
    margin-left: -20px; /* values might need to be adjusted according to content */

    & .child-elements:last-child {
      border-right: 15px solid transparent;
      /* might need to be set on last child of content to ensure that all the content is scrolled into the viewport*/
    }
  }
/* overwrite shadow color */
  section {
    & :deep(.shadow-wrapper::before) {
      background-image: linear-gradient(270deg, hsla(0, 0%, 100%, 0) 0%, var(--knime-white) 100%);
    }

    & :deep(.shadow-wrapper::after) {
      background-image: linear-gradient(90deg, hsla(0, 0%, 100%, 0) 0%, var(--knime-white) 100%);
    }
  }
</style>`,_={components:{Carousel:h,CodeExample:p},data(){return{carouselCode:v,codeExample:b}}},o=n=>(f("data-v-8b979860"),n=n(),w(),n),x={class:"grid-container"},M={class:"grid-item-12"},D=o(()=>e("p",null," The carousel can fit items of any size and creates shadows on each side of the viewport to indicate that scrolling is possible. When one side of the items inside of the carousel is reached the shadow should disappear. ",-1)),k=o(()=>e("p",null," The color of the shadow can be adjusted to the background by setting the .shadow-color's before and after elements background-image (example below) ",-1)),C=o(()=>e("p",null,"See usage example for more CSS adjustments.",-1)),E=o(()=>e("div",{class:"wrapper"},[e("div",{class:"card card1"}),e("div",{class:"card card2"}),e("div",{class:"card card3"}),e("div",{class:"card card1"}),e("div",{class:"card card2"}),e("div",{class:"card card3"})],-1));function y(n,S,L,T,t,X){const c=l("Carousel",!0),r=l("CodeExample");return g(),m("section",null,[e("div",x,[e("div",M,[D,k,C,e("section",null,[s(c,null,{default:a(()=>[E]),_:1})]),s(r,{summary:"Show usage example"},{default:a(()=>[i(d(t.codeExample),1)]),_:1}),s(r,{summary:"Show Carousel.vue source code"},{default:a(()=>[i(d(t.carouselCode),1)]),_:1})])])])}const j=u(_,[["render",y],["__scopeId","data-v-8b979860"]]);export{j as default};
