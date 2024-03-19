import{C as b}from"./CodeExample-i56rDI5D.js";import{Y as k,A as V}from"./knimeColors-ZxOyY6H5.js";import{_ as p,o as s,c as l,b as t,n as m,l as o,h as f,t as u,r as v,d as r,w as y,e as x,p as _,f as w}from"./index-o67LSUhU.js";const S=k,L=V,D={props:{value:{type:[Number,Object],required:!0},secondaryValue:{type:[Number,Object],default:0},maxValue:{type:Number,required:!0},acceptValuesLargerThanMax:{type:Boolean,default:!1},radius:{type:Number,default:50},innerRadius:{type:Number,default:30},displayValues:{type:Boolean,default:!1},additionalLabel:{type:String,default:null},animate:{type:Boolean,default:!0}},data(){return{backgroundStrokeOffset:.5,smallLabelFontSize:20,regularLabelFontSize:30,regularLabelMaxValue:999}},computed:{primarySegment(){return typeof this.value=="number"?{value:this.value,color:S}:this.value},secondarySegment(){return typeof this.secondaryValue=="number"?{value:this.secondaryValue,color:L}:this.secondaryValue},clippedValue(){let n=Math.max(0,this.primarySegment.value);return this.acceptValuesLargerThanMax?n:Math.min(n,this.maxValue)},secondaryClippedValue(){let n=Math.max(0,this.secondarySegment.value+this.clippedValue);return this.acceptValuesLargerThanMax?n:Math.min(n,this.maxValue)},strokeWidth(){return this.radius-this.innerRadius},backgroundStrokeWidth(){return this.strokeWidth-this.backgroundStrokeOffset},r(){return this.radius-this.strokeWidth/2},diameter(){return 2*this.radius},viewBox(){return`0 0 ${this.diameter} ${this.diameter}`},circumference(){return 2*Math.PI*this.r},strokeDashOffset(){return this.calcStrokeDashOffset(this.clippedValue)},secondaryStrokeDashOffset(){return this.calcStrokeDashOffset(this.secondaryClippedValue)},transformWedge(){return`rotate(-90, ${this.radius}, ${this.radius})`},displayLabel(){return!!(this.displayValues&&this.additionalLabel)},maxValueString(){return Number.isFinite(this.maxValue)?String(this.maxValue):"∞"},containerStyle(){return`width: ${this.diameter}px; height: ${this.diameter}px;`},labelStyle(){let n=this.clippedValue>this.regularLabelMaxValue,d=Number.isFinite(this.maxValue)&&this.maxValue>this.regularLabelMaxValue,a=n||d?this.smallLabelFontSize:this.regularLabelFontSize;return`font-size: ${a}px; line-height: ${a}px;`},disabled(){return!Number.isFinite(this.maxValue)}},methods:{calcStrokeDashOffset(n){if(this.maxValue<=0||!Number.isFinite(this.maxValue))return this.circumference;const d=Math.min(n/this.maxValue*this.circumference,this.circumference);return Math.max(this.circumference-d,0)}}},O=["height","width","viewBox"],C=["cx","cy","r"],M=["cx","cy","r"],N=["height","width","viewBox"],B=["cx","cy","r","stroke-width"],F=["cx","cy","r","stroke","stroke-width","stroke-dasharray","stroke-dashoffset","transform"],W=["cx","cy","r","stroke","stroke-width","stroke-dasharray","stroke-dashoffset","transform"],E={class:"label-container"},R={key:1,class:"additional-label"};function z(n,d,a,g,c,e){return s(),l("div",{class:"donut-container",style:f(e.containerStyle)},[e.disabled?(s(),l("svg",{key:0,height:e.diameter,width:e.diameter,viewBox:e.viewBox,class:"donut-chart"},[t("circle",{class:"disabled-circle",cx:a.radius,cy:a.radius,r:a.radius-.5,"stroke-width":"1",fill:"transparent"},null,8,C),t("circle",{class:"disabled-inner-circle",cx:a.radius,cy:a.radius,r:a.innerRadius+.5,"stroke-width":"1",fill:"transparent"},null,8,M)],8,O)):(s(),l("svg",{key:1,height:e.diameter,width:e.diameter,viewBox:e.viewBox,class:"donut-chart"},[t("circle",{class:"background-circle",cx:a.radius,cy:a.radius,r:e.r,"stroke-width":e.backgroundStrokeWidth,fill:"transparent"},null,8,B),e.secondarySegment?(s(),l("circle",{key:0,class:m(["value-wedge",{animate:a.animate}]),cx:a.radius,cy:a.radius,r:e.r,stroke:e.secondarySegment.color,"stroke-width":e.strokeWidth,"stroke-dasharray":e.circumference,"stroke-dashoffset":e.secondaryStrokeDashOffset,fill:"transparent",transform:e.transformWedge},null,10,F)):o("",!0),t("circle",{class:m(["value-wedge",{animate:a.animate}]),cx:a.radius,cy:a.radius,r:e.r,stroke:e.primarySegment.color,"stroke-width":e.strokeWidth,"stroke-dasharray":e.circumference,"stroke-dashoffset":e.strokeDashOffset,fill:"transparent",transform:e.transformWedge},null,10,W)],8,N)),t("div",E,[a.displayValues?(s(),l("div",{key:0,class:"value-label",style:f(e.labelStyle)},u(`${e.clippedValue} / ${e.maxValueString}`),5)):o("",!0),e.displayLabel?(s(),l("div",R,u(a.additionalLabel),1)):o("",!0)])],4)}const A=p(D,[["render",z],["__scopeId","data-v-9ad84761"]]),T=`<script>
import { Yellow, AquamarineDark } from "../colors/knimeColors.mjs";

const DEFAULT_PRIMARY_COLOR = Yellow;
const DEFAULT_SECONDARY_COLOR = AquamarineDark;

export default {
  props: {
    /** The value of the wedge to be displayed, can exceed the maximum value */
    value: {
      type: [Number, Object],
      required: true,
    },
    /**
     * An optional secondary value for a second wedge to be displayed, can exceed the maximum value.
     * Note this will not be displayed as inner value.
     */
    secondaryValue: {
      type: [Number, Object],
      default: 0,
    },
    /** The maximum value on which the wedge size is calculated. Also 'Infinity' can be passed here */
    maxValue: {
      type: Number,
      required: true,
    },
    /** Wether or not values larger than the maximum are allowed. If this is false larger values will be clipped to
     * the maxValue. */
    acceptValuesLargerThanMax: {
      type: Boolean,
      default: false,
    },
    /** The outside radius of the donut chart. This also determines the overall size of the component. */
    radius: {
      type: Number,
      default: 50,
    },
    /** The inner radius. This can be seen as the radius of the donut hole. */
    innerRadius: {
      type: Number,
      default: 30,
    },
    /** Whether or not the wedge and max values are displayed as a label inside the donut hole. */
    displayValues: {
      type: Boolean,
      default: false,
    },
    /** An additional label string, which is shown beneath the value label, if present. Does not display
     * if 'displayValues === false' */
    additionalLabel: {
      type: String,
      default: null,
    },
    /** optional parameter wether the transition between values should be animated or not */
    animate: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      backgroundStrokeOffset: 0.5,
      smallLabelFontSize: 20,
      regularLabelFontSize: 30,
      regularLabelMaxValue: 999,
    };
  },

  computed: {
    primarySegment() {
      return typeof this.value === "number"
        ? {
            value: this.value,
            color: DEFAULT_PRIMARY_COLOR,
          }
        : this.value;
    },
    secondarySegment() {
      return typeof this.secondaryValue === "number"
        ? {
            value: this.secondaryValue,
            color: DEFAULT_SECONDARY_COLOR,
          }
        : this.secondaryValue;
    },
    clippedValue() {
      let value = Math.max(0, this.primarySegment.value);
      return this.acceptValuesLargerThanMax
        ? value
        : Math.min(value, this.maxValue);
    },
    secondaryClippedValue() {
      // calculate secondary value including the first value (to overlap the two svgs)
      let value = Math.max(0, this.secondarySegment.value + this.clippedValue);
      return this.acceptValuesLargerThanMax
        ? value
        : Math.min(value, this.maxValue);
    },
    strokeWidth() {
      return this.radius - this.innerRadius;
    },
    backgroundStrokeWidth() {
      // to account for rendering inaccuracies the background stroke is slightly smaller than the wedge stroke
      return this.strokeWidth - this.backgroundStrokeOffset;
    },
    r() {
      return this.radius - this.strokeWidth / 2;
    },
    diameter() {
      return 2 * this.radius;
    },
    viewBox() {
      return \`0 0 \${this.diameter} \${this.diameter}\`;
    },
    circumference() {
      return 2 * Math.PI * this.r;
    },
    strokeDashOffset() {
      return this.calcStrokeDashOffset(this.clippedValue);
    },
    secondaryStrokeDashOffset() {
      return this.calcStrokeDashOffset(this.secondaryClippedValue);
    },
    transformWedge() {
      return \`rotate(-90, \${this.radius}, \${this.radius})\`;
    },
    displayLabel() {
      return Boolean(this.displayValues && this.additionalLabel);
    },
    maxValueString() {
      return Number.isFinite(this.maxValue) ? String(this.maxValue) : "∞";
    },
    containerStyle() {
      return \`width: \${this.diameter}px; height: \${this.diameter}px;\`;
    },
    labelStyle() {
      // simple approach to account for larger numbers as the label inside the donut hole
      let valueExceedsLarge = this.clippedValue > this.regularLabelMaxValue;
      let maxValueExceedsLarge =
        Number.isFinite(this.maxValue) &&
        this.maxValue > this.regularLabelMaxValue;
      let size =
        valueExceedsLarge || maxValueExceedsLarge
          ? this.smallLabelFontSize
          : this.regularLabelFontSize;
      return \`font-size: \${size}px; line-height: \${size}px;\`;
    },
    disabled() {
      return !Number.isFinite(this.maxValue);
    },
  },
  methods: {
    calcStrokeDashOffset(value) {
      // if the maximum is 0 or infinity, the circle is never filled
      if (this.maxValue <= 0 || !Number.isFinite(this.maxValue)) {
        return this.circumference;
      }
      // otherwise calculate the difference
      const strokeDiff = Math.min(
        (value / this.maxValue) * this.circumference,
        this.circumference,
      );
      return Math.max(this.circumference - strokeDiff, 0);
    },
  },
};
<\/script>

<template>
  <div class="donut-container" :style="containerStyle">
    <svg
      v-if="disabled"
      :height="diameter"
      :width="diameter"
      :viewBox="viewBox"
      class="donut-chart"
    >
      <circle
        class="disabled-circle"
        :cx="radius"
        :cy="radius"
        :r="radius - 0.5"
        stroke-width="1"
        fill="transparent"
      />
      <circle
        class="disabled-inner-circle"
        :cx="radius"
        :cy="radius"
        :r="innerRadius + 0.5"
        stroke-width="1"
        fill="transparent"
      />
    </svg>
    <svg
      v-else
      :height="diameter"
      :width="diameter"
      :viewBox="viewBox"
      class="donut-chart"
    >
      <circle
        class="background-circle"
        :cx="radius"
        :cy="radius"
        :r="r"
        :stroke-width="backgroundStrokeWidth"
        fill="transparent"
      />
      <circle
        v-if="secondarySegment"
        :class="['value-wedge', { animate }]"
        :cx="radius"
        :cy="radius"
        :r="r"
        :stroke="secondarySegment.color"
        :stroke-width="strokeWidth"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="secondaryStrokeDashOffset"
        fill="transparent"
        :transform="transformWedge"
      />
      <circle
        :class="['value-wedge', { animate }]"
        :cx="radius"
        :cy="radius"
        :r="r"
        :stroke="primarySegment.color"
        :stroke-width="strokeWidth"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="strokeDashOffset"
        fill="transparent"
        :transform="transformWedge"
      />
    </svg>

    <div class="label-container">
      <div v-if="displayValues" class="value-label" :style="labelStyle">
        {{ \`\${clippedValue} / \${maxValueString}\` }}
      </div>
      <div v-if="displayLabel" class="additional-label">
        {{ additionalLabel }}
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.donut-container {
  position: relative;

  & .background-circle {
    stroke: var(--theme-donut-chart-background-color);
  }

  & .disabled-circle {
    stroke: var(--theme-donut-chart-disabled-color);
  }

  & .disabled-inner-circle {
    stroke: var(--theme-donut-chart-disabled-color);
  }
}

svg {
  display: block;

  & circle.value-wedge {
    &.animate {
      transition:
        stroke-dashoffset 0.5s,
        stroke 0.5s;
    }
  }
}

.label-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.value-label {
  font-family: var(--theme-text-bold-font-family);
  color: var(--theme-text-bold-color);
  font-size: 20px;
  line-height: 20px;
  font-weight: 700;
  width: 100%;
  text-align: center;
}

.additional-label {
  font-family: var(--theme-text-normal-font-family);
  color: var(--theme-text-normal-color);
  font-size: 15px;
  line-height: 30px;
  font-weight: 300;
  width: 100%;
  text-align: center;
}
</style>
`,I=`<DonutChart
  :value="3"
  :max-value="5"
  display-values
  additional-label="some metric"
  :inner-radius="70"
  :radius="100"
/>`,Y={components:{DonutChart:A,CodeExample:b},data(){return{codeExample:I}},computed:{code(){return T}}},j=n=>(_("data-v-594381f0"),n=n(),w(),n),q=j(()=>t("section",null,[t("div",{class:"grid-container"},[t("div",{class:"grid-item-12"},[t("p",null," Displays a donut chart. It can display the current and max value as well as display an additional label. Also supports a secondary value to be displayed. Passed values can either be a number or an object containing the value and color. ")])])],-1)),P={class:"grid-container"},U={class:"grid-item-12 demo"},G={class:"grid-container"},H={class:"grid-item-12 demo"},J={class:"grid-container"},K={class:"grid-item-12"};function Q(n,d,a,g,c,e){const i=v("DonutChart",!0),h=v("CodeExample");return s(),l("div",null,[q,t("section",null,[t("div",P,[t("div",U,[r(i,{value:1,"max-value":6,"inner-radius":70,radius:100}),r(i,{value:2,"max-value":6,"inner-radius":70,radius:100,"display-values":""}),r(i,{value:3,"max-value":5,"display-values":"","additional-label":"some metric","inner-radius":70,radius:100}),r(i,{value:8,"max-value":1/0,"display-values":"","additional-label":"some metric","inner-radius":70,radius:100,"accept-values-larger-than-max":""}),r(i,{value:{value:33,color:"hsl(206, 74%, 90%)"},"secondary-value":{value:33,color:"hsl(263, 40.4%, 77.6%)"},"display-values":"","additional-label":"custom colors","max-value":100,"inner-radius":70,radius:100},null,8,["value","secondary-value"])])])]),t("section",null,[t("div",G,[t("div",H,[r(i,{value:1,"max-value":6,radius:22.5,"inner-radius":11}),r(i,{value:2,"secondary-value":2.5,"max-value":6,radius:22.5,"inner-radius":11}),r(i,{value:3,"max-value":5,"additional-label":"some metric",radius:22.5,"inner-radius":11}),r(i,{value:8,"max-value":1/0,"additional-label":"some metric",radius:22.5,"inner-radius":11,"accept-values-larger-than-max":""})])])]),t("section",null,[t("div",J,[t("div",K,[r(h,{summary:"Show usage example"},{default:y(()=>[x(u(c.codeExample),1)]),_:1}),r(h,{summary:"Show DonutChart.vue source code"},{default:y(()=>[x(u(e.code),1)]),_:1})])])])])}const ee=p(Y,[["render",Q],["__scopeId","data-v-594381f0"]]);export{ee as default};
