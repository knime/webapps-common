import{C as p}from"./CodeExample-c495b379.js";import{_ as u,C as h,r as l,o as g,c as f,b as e,d as s,w as a,e as d,t as i,p as w,f as m}from"./index-02da3112.js";const v=`<script>
/**
 * Displays shadows on both sides of a carousel
 * indicate content being hidden which can be scrolled to
 */
let isMouseDown = false;
let wasDragged = false;
const scrollThreshold = 5; // to prevent clicks not being bubbled to child by accident
let startX, scrollLeft, slider;

export default {
  /**
   * following methods allow dragging via mouse
   */
  methods: {
    onMouseDown(e) {
      slider = this.$refs.carousel;
      isMouseDown = true;
      wasDragged = false;
      startX = e.pageX;
      scrollLeft = slider.scrollLeft;
    },
    onMouseEnd(e) {
      if (wasDragged) {
        e.preventDefault();
      }
      isMouseDown = false;
    },
    onMouseMove(e) {
      if (!isMouseDown) {
        return;
      }
      e.preventDefault();
      const x = e.pageX;
      const walk = x - startX;
      if (wasDragged || Math.abs(walk) > scrollThreshold) {
        wasDragged = true;
        slider.scrollLeft = scrollLeft - walk;
      }
    },
    onDragStart(e) {
      e.preventDefault();
    },
  },
};
<\/script>

<template>
  <div class="shadow-wrapper">
    <div
      ref="carousel"
      class="carousel"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
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

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
`;const _=`
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
</style>`,b={components:{Carousel:h,CodeExample:p},data(){return{carouselCode:v,codeExample:_}}},o=n=>(w("data-v-8b979860"),n=n(),m(),n),x={class:"grid-container"},k={class:"grid-item-12"},C=o(()=>e("p",null," The carousel can fit items of any size and creates shadows on each side of the viewport to indicate that scrolling is possible. When one side of the items inside of the carousel is reached the shadow should disappear. ",-1)),D=o(()=>e("p",null," The color of the shadow can be adjusted to the background by setting the .shadow-color's before and after elements background-image (example below) ",-1)),y=o(()=>e("p",null,"See usage example for more CSS adjustments.",-1)),M=o(()=>e("div",{class:"wrapper"},[e("div",{class:"card card1"}),e("div",{class:"card card2"}),e("div",{class:"card card3"}),e("div",{class:"card card1"}),e("div",{class:"card card2"}),e("div",{class:"card card3"})],-1));function S(n,E,L,T,t,X){const c=l("Carousel",!0),r=l("CodeExample");return g(),f("section",null,[e("div",x,[e("div",k,[C,D,y,e("section",null,[s(c,null,{default:a(()=>[M]),_:1})]),s(r,{summary:"Show usage example"},{default:a(()=>[d(i(t.codeExample),1)]),_:1}),s(r,{summary:"Show Carousel.vue source code"},{default:a(()=>[d(i(t.carouselCode),1)]),_:1})])])])}const j=u(b,[["render",S],["__scopeId","data-v-8b979860"]]);export{j as default};
