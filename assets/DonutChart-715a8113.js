import{C as g}from"./CodeExample-36f77db0.js";import{_ as y,o as s,c as l,b as t,l as c,h as m,t as u,r as f,d as r,w as v,e as x,p as b,f as k}from"./index-388202f0.js";const _={props:{value:{type:Number,required:!0},secondaryValue:{type:Number,default:0},maxValue:{type:Number,required:!0},acceptValuesLargerThanMax:{type:Boolean,default:!1},radius:{type:Number,default:50},innerRadius:{type:Number,default:30},displayValues:{type:Boolean,default:!1},additionalLabel:{type:String,default:null}},data(){return{backgroundStrokeOffset:.5,smallLabelFontSize:20,regularLabelFontSize:30,regularLabelMaxValue:999}},computed:{clippedValue(){let n=Math.max(0,this.value);return this.acceptValuesLargerThanMax?n:Math.min(n,this.maxValue)},secondaryClippedValue(){let n=Math.max(0,this.secondaryValue+this.clippedValue);return this.acceptValuesLargerThanMax?n:Math.min(n,this.maxValue)},strokeWidth(){return this.radius-this.innerRadius},backgroundStrokeWidth(){return this.strokeWidth-this.backgroundStrokeOffset},r(){return this.radius-this.strokeWidth/2},diameter(){return 2*this.radius},viewBox(){return`0 0 ${this.diameter} ${this.diameter}`},circumference(){return 2*Math.PI*this.r},strokeDashOffset(){return this.calcStrokeDashOffset(this.clippedValue)},secondaryStrokeDashOffset(){return this.calcStrokeDashOffset(this.secondaryClippedValue)},transformWedge(){return`rotate(-90, ${this.radius}, ${this.radius})`},displayLabel(){return Boolean(this.displayValues&&this.additionalLabel)},maxValueString(){return Number.isFinite(this.maxValue)?String(this.maxValue):"∞"},containerStyle(){return`width: ${this.diameter}px; height: ${this.diameter}px;`},labelStyle(){let n=this.clippedValue>this.regularLabelMaxValue,d=Number.isFinite(this.maxValue)&&this.maxValue>this.regularLabelMaxValue,a=n||d?this.smallLabelFontSize:this.regularLabelFontSize;return`font-size: ${a}px; line-height: ${a}px;`},disabled(){return!Number.isFinite(this.maxValue)}},methods:{calcStrokeDashOffset(n){if(this.maxValue<=0||!Number.isFinite(this.maxValue))return this.circumference;const d=Math.min(n/this.maxValue*this.circumference,this.circumference);return Math.max(this.circumference-d,0)}}},V=["height","width","viewBox"],w=["cx","cy","r"],S=["cx","cy","r"],L=["height","width","viewBox"],D=["cx","cy","r","stroke-width"],M=["cx","cy","r","stroke-width","stroke-dasharray","stroke-dashoffset","transform"],N=["cx","cy","r","stroke-width","stroke-dasharray","stroke-dashoffset","transform"],W={class:"label-container"},B={key:1,class:"additional-label"};function C(n,d,a,p,o,e){return s(),l("div",{class:"donut-container",style:m(e.containerStyle)},[e.disabled?(s(),l("svg",{key:0,height:e.diameter,width:e.diameter,viewBox:e.viewBox,class:"donut-chart"},[t("circle",{class:"disabled-circle",cx:a.radius,cy:a.radius,r:a.radius-.5,"stroke-width":"1",fill:"transparent"},null,8,w),t("circle",{class:"disabled-inner-circle",cx:a.radius,cy:a.radius,r:a.innerRadius+.5,"stroke-width":"1",fill:"transparent"},null,8,S)],8,V)):(s(),l("svg",{key:1,height:e.diameter,width:e.diameter,viewBox:e.viewBox,class:"donut-chart"},[t("circle",{class:"background-circle",cx:a.radius,cy:a.radius,r:e.r,"stroke-width":e.backgroundStrokeWidth,fill:"transparent"},null,8,D),a.secondaryValue?(s(),l("circle",{key:0,class:"value-wedge secondary-value-wedge",cx:a.radius,cy:a.radius,r:e.r,"stroke-width":e.strokeWidth,"stroke-dasharray":e.circumference,"stroke-dashoffset":e.secondaryStrokeDashOffset,fill:"transparent",transform:e.transformWedge},null,8,M)):c("",!0),t("circle",{class:"value-wedge primary-value-wedge",cx:a.radius,cy:a.radius,r:e.r,"stroke-width":e.strokeWidth,"stroke-dasharray":e.circumference,"stroke-dashoffset":e.strokeDashOffset,fill:"transparent",transform:e.transformWedge},null,8,N)],8,L)),t("div",W,[a.displayValues?(s(),l("div",{key:0,class:"value-label",style:m(e.labelStyle)},u(`${e.clippedValue} / ${e.maxValueString}`),5)):c("",!0),e.displayLabel?(s(),l("div",B,u(a.additionalLabel),1)):c("",!0)])],4)}const z=y(_,[["render",C],["__scopeId","data-v-9feca41f"]]),O=`<script>
export default {
  props: {
    /** The value of the wedge to be displayed, can exceed the maximum value */
    value: {
      type: Number,
      required: true,
    },
    /**
     * An optional secondary value for a second wedge to be displayed, can exceed the maximum value.
     * Note this will not be displayed as inner value.
     */
    secondaryValue: {
      type: Number,
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
    clippedValue() {
      let value = Math.max(0, this.value);
      return this.acceptValuesLargerThanMax
        ? value
        : Math.min(value, this.maxValue);
    },
    secondaryClippedValue() {
      // calculate secondary value including the first value (to overlap the two svgs)
      let value = Math.max(0, this.secondaryValue + this.clippedValue);
      return this.acceptValuesLargerThanMax
        ? value
        : Math.min(value, this.maxValue);
    },
    strokeWidth() {
      return this.radius - this.innerRadius;
    },
    backgroundStrokeWidth() {
      // to account for rendering inacuracies the background stroke is slightly smaller than the wedge stroke
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
        this.circumference
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
        v-if="secondaryValue"
        class="value-wedge secondary-value-wedge"
        :cx="radius"
        :cy="radius"
        :r="r"
        :stroke-width="strokeWidth"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="secondaryStrokeDashOffset"
        fill="transparent"
        :transform="transformWedge"
      />
      <circle
        class="value-wedge primary-value-wedge"
        :cx="radius"
        :cy="radius"
        :r="r"
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

  & .primary-value-wedge {
    stroke: var(--theme-donut-chart-value-color);
  }

  & .secondary-value-wedge {
    stroke: var(--knime-aquamarine-dark);
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
    transition: stroke-dashoffset 0.5s;
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
`;const F=`<DonutChart
  :value="3"
  :max-value="5"
  display-values
  additional-label="some metric"
  :inner-radius="70"
  :radius="100"
/>`,T={components:{DonutChart:z,CodeExample:g},data(){return{codeExample:F}},computed:{code(){return O}}},E=n=>(b("data-v-ecdfa991"),n=n(),k(),n),I=E(()=>t("section",null,[t("div",{class:"grid-container"},[t("div",{class:"grid-item-12"},[t("p",null," Displays a donut chart. It can display the current and max value as well as display an additional label. Also supports a secondary value to be displayed. ")])])],-1)),R={class:"grid-container"},q={class:"grid-item-12 demo"},A={class:"grid-container"},P={class:"grid-item-12 demo"},j={class:"grid-container"},G={class:"grid-item-12"};function H(n,d,a,p,o,e){const i=f("DonutChart",!0),h=f("CodeExample");return s(),l("div",null,[I,t("section",null,[t("div",R,[t("div",q,[r(i,{value:1,"max-value":6,"inner-radius":70,radius:100}),r(i,{value:2,"max-value":6,"inner-radius":70,radius:100,"display-values":""}),r(i,{value:3,"max-value":5,"display-values":"","additional-label":"some metric","inner-radius":70,radius:100}),r(i,{value:8,"max-value":1/0,"display-values":"","additional-label":"some metric","inner-radius":70,radius:100,"accept-values-larger-than-max":""})])])]),t("section",null,[t("div",A,[t("div",P,[r(i,{value:1,"max-value":6,radius:22.5,"inner-radius":11}),r(i,{value:2,"secondary-value":2.5,"max-value":6,radius:22.5,"inner-radius":11}),r(i,{value:3,"max-value":5,"additional-label":"some metric",radius:22.5,"inner-radius":11}),r(i,{value:8,"max-value":1/0,"additional-label":"some metric",radius:22.5,"inner-radius":11,"accept-values-larger-than-max":""})])])]),t("section",null,[t("div",j,[t("div",G,[r(h,{summary:"Show usage example"},{default:v(()=>[x(u(o.codeExample),1)]),_:1}),r(h,{summary:"Show DonutChart.vue source code"},{default:v(()=>[x(u(e.code),1)]),_:1})])])])])}const Q=y(T,[["render",H],["__scopeId","data-v-ecdfa991"]]);export{Q as default};
