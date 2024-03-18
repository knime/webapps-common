import{C as S}from"./CodeExample-rABFehML.js";import{g as p}from"./localTimezone-ZY_8qibQ.js";import{_,o as T,c as D,t as d,n as v,r as h,b as t,e as s,d as r,w as u}from"./index-3TViJsqC.js";const g=(e,n=!1)=>{let a=new Date(e);if(isNaN(a))throw Error("Invalid Date format");let o={day:"numeric",month:"short",year:"numeric"};return n&&(o.timeZone=p()),a.toLocaleDateString("en-US",o)},L=(e,n=!1)=>{let a=new Date(e);if(isNaN(a))throw Error("Invalid Date format");let o={hour:"numeric",minute:"2-digit"};return n&&(o.timeZone=p()),a.toLocaleTimeString("en-US",o)},w=(e,n=!1)=>`${g(e,n)} ${L(e,n)}`,f=(e,n)=>n?w(e,!0):g(e,!0),x={props:{date:{type:String,default:""},showTime:{type:Boolean,default:!0}},data(){return{localDateTime:w(this.date,this.showTime),hidden:!0}},watch:{date(e,n){e!==n&&(this.localDateTime=f(e,this.showTime))}},mounted(){this.localDateTime=f(this.date,this.showTime),this.hidden=!1}},y=["title","datetime"];function C(e,n,a,o,i,l){return T(),D("time",{title:a.date,datetime:a.date,class:v({hidden:i.hidden})},d(i.localDateTime),11,y)}const E=_(x,[["render",C],["__scopeId","data-v-2bfe73cb"]]),$=`<script>
import {
  formatDateTimeString,
  formatLocalDateTimeString,
} from "./../../util/format";

export default {
  props: {
    date: {
      type: String,
      default: "",
    },
    showTime: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      // formatting and hiding the date first to reserve the correct space and avoid content jumping once date is mounted.
      localDateTime: formatDateTimeString(this.date, this.showTime),
      hidden: true,
    };
  },

  watch: {
    date(newDate, oldDate) {
      if (newDate !== oldDate) {
        this.localDateTime = formatLocalDateTimeString(newDate, this.showTime);
      }
    },
  },
  mounted() {
    this.localDateTime = formatLocalDateTimeString(this.date, this.showTime);
    // after mounted the date is shown and hidden set to false
    this.hidden = false;
  },
};
<\/script>

<template>
  <time :title="date" :datetime="date" :class="{ hidden: hidden }">{{
    localDateTime
  }}</time>
</template>

<style scoped>
.hidden {
  visibility: hidden;
}
</style>
`,N='<LocalDateTime date="2023-10-27T11:17:42.460Z" :show-time="true"/>',B={components:{LocalDateTime:E,CodeExample:S},data(){return{codeExample:N}},computed:{code(){return $}}},Z={class:"grid-container"},b={class:"grid-item-12"},O=t("p",null,[t("strong",null," UTC date format")],-1),I=t("p",null,"Original Date: 2023-10-27T11:17:42.460Z",-1),U=t("p",null,[t("strong",null,"Timezone with offset date format")],-1),V=t("p",null,"Original Date: 2023-01-23T09:15:28+00:00",-1),k={class:"grid-container"},z={class:"grid-item-12"};function j(e,n,a,o,i,l){const c=h("LocalDateTime",!0),m=h("CodeExample");return T(),D("div",null,[t("section",null,[t("div",Z,[t("div",b,[O,I,t("p",null,[s(" Converted to local time: "),r(c,{date:"2023-10-27T11:17:42.460Z"})]),U,V,t("p",null,[s(" Converted to local time: "),r(c,{date:"2023-01-23T09:15:28+00:00"})])])])]),t("section",null,[t("div",k,[t("div",z,[r(m,{summary:"Show usage example"},{default:u(()=>[s(d(i.codeExample),1)]),_:1}),r(m,{summary:"Show LocalDateTime.vue source code"},{default:u(()=>[s(d(l.code),1)]),_:1})])])])])}const G=_(B,[["render",j]]);export{G as default};
