import{C as c}from"./CodeExample-BahBHCbe.js";import{_ as p,G as u,r as d,c as m,o as h,b as e,d as s,w as o,e as l,t as n}from"./index-DNpEPGIF.js";const f="",g=`
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
</style>`,w={components:{Carousel:u,CodeExample:c},data(){return{carouselCode:f,codeExample:g}}},v={class:"grid-container"},x={class:"grid-item-12"};function C(_,a,b,k,t,y){const i=d("Carousel",!0),r=d("CodeExample");return h(),m("section",null,[e("div",v,[e("div",x,[a[1]||(a[1]=e("p",null," The carousel can fit items of any size and creates shadows on each side of the viewport to indicate that scrolling is possible. When one side of the items inside of the carousel is reached the shadow should disappear. ",-1)),a[2]||(a[2]=e("p",null," The color of the shadow can be adjusted to the background by setting the .shadow-color's before and after elements background-image (example below) ",-1)),a[3]||(a[3]=e("p",null,"See usage example for more CSS adjustments.",-1)),e("section",null,[s(i,null,{default:o(()=>a[0]||(a[0]=[e("div",{class:"wrapper"},[e("div",{class:"card card1"}),e("div",{class:"card card2"}),e("div",{class:"card card3"}),e("div",{class:"card card1"}),e("div",{class:"card card2"}),e("div",{class:"card card3"})],-1)])),_:1,__:[0]})]),s(r,{summary:"Show usage example"},{default:o(()=>[l(n(t.codeExample),1)]),_:1}),s(r,{summary:"Show Carousel.vue source code"},{default:o(()=>[l(n(t.carouselCode),1)]),_:1})])])])}const j=p(w,[["render",C],["__scopeId","data-v-d3691c63"]]);export{j as default};
