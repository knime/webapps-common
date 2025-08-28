import{P as f}from"./circle-play-y0ntCnWN.js";import{C as v}from"./CodeExample-WFbXoV2a.js";import{_ as y,C as w,r as a,c as g,o as _,b as l,d as i,e as o,w as s,t as d}from"./index-DCjo0Rm6.js";import{C as h}from"./Checkbox-m7d8e2LM.js";import{M}from"./Modal-DjUzjjNc.js";import"./focus-trap-vue.esm-browser-DWGfksTu.js";const x="",C="",A=`<script>
import Modal from '~/webapps-common/ui/components/Modal.vue';
import PlayIcon from '~/@knime/styles/img/icons/circle-play.svg';
import Button from '~/webapps-common/ui/components/Button.vue';

export default {
    components: {
        Modal,
        PlayIcon,
        Button
    },
    data() {
        return {
            modalActive: false
        };
    }
};
<\/script>

<template>
  <div>
    <Button
      @click="modalActive = true"
      primary
    >
      Trigger modal
    </Button>
    <Modal
      :active="modalActive"
      title="Modal title"
      class="modal"
      style-type="info"
      @cancel="modalActive = false"
    >
      <template v-slot:icon><PlayIcon /></template>
      <template v-slot:notice>This is the notice slot.</template>
      <template v-slot:confirmation>And this is content in the confirmation slot.</template>
      <template v-slot:controls>
        <Button @click="modalActive = false">Accept and close</Button>
      </template>
    </Modal>
  </div>
</template>

<style lang="postcss" scoped>
.modal {
  --modal-width: 500px; /* optional, only needed in case you want to adjust the width. Default: 550px */
}
</style>
`,b={components:{Modal:M,PlayIcon:f,Button:w,CodeExample:v,Checkbox:h},data(){return{codeExample:A,code:x,baseModalCode:C,modalActive:!1,modalStyleType:"info",animate:!0,implicitDismiss:!0}}},k={class:"grid-container"},B={class:"grid-item-12"},T={class:"options"},V={class:"grid-container"},E={class:"grid-item-12"};function S(I,e,P,D,t,N){const r=a("Button"),c=a("Checkbox"),p=a("PlayIcon"),u=a("Modal",!0),m=a("CodeExample");return _(),g("div",null,[l("section",null,[l("div",k,[l("div",B,[e[11]||(e[11]=l("p",null,[o(" Offers multiple optional slots for content to show inside a "),l("a",{href:"https://en.wikipedia.org/wiki/Modal_window"},"modal dialog"),o(". Multiple styles are supported by the "),l("code",null,"styleType"),o(" prop. See source code for possible values. The modal emits a "),l("code",null,"cancel"),o(" event which is triggered by clicking the overlay, the ESC key or the close button. Also on tab, the focus is trapped inside the modal. ")],-1)),e[12]||(e[12]=l("p",null,[o(" For the rare cases where more design freedom is needed, please use the "),l("code",null,"BaseModal"),o(" component which comes without a header and styled slots. But please be aware of "),l("a",{href:"https://www.w3.org/TR/wai-aria-practices-1.1/examples/dialog-modal/dialog.html"},"W3C best practices for modal dialogs"),o(". ")],-1)),l("div",T,[i(r,{primary:"",onClick:e[0]||(e[0]=n=>t.modalActive=!0)},{default:s(()=>e[5]||(e[5]=[o(" Trigger modal ",-1)])),_:1,__:[5]}),i(c,{modelValue:t.animate,"onUpdate:modelValue":e[1]||(e[1]=n=>t.animate=n)},{default:s(()=>e[6]||(e[6]=[o(" Animate on enter ",-1)])),_:1,__:[6]},8,["modelValue"]),i(c,{modelValue:t.implicitDismiss,"onUpdate:modelValue":e[2]||(e[2]=n=>t.implicitDismiss=n)},{default:s(()=>e[7]||(e[7]=[o(' Autodismiss via "Esc" or clicking on backdrop ',-1)])),_:1,__:[7]},8,["modelValue"])]),i(u,{active:t.modalActive,title:"Modal title",class:"modal","style-type":t.modalStyleType,animate:t.animate,"implicit-dismiss":t.implicitDismiss,onCancel:e[4]||(e[4]=n=>t.modalActive=!1)},{icon:s(()=>[i(p)]),notice:s(()=>e[8]||(e[8]=[o("This is the notice slot.",-1)])),confirmation:s(()=>e[9]||(e[9]=[o("And this is content in the confirmation slot.",-1)])),controls:s(()=>[i(r,{primary:"",onClick:e[3]||(e[3]=n=>t.modalActive=!1)},{default:s(()=>e[10]||(e[10]=[o(" Accept and close ",-1)])),_:1,__:[10]})]),_:1},8,["active","style-type","animate","implicit-dismiss"])])])]),l("section",null,[l("div",V,[l("div",E,[i(m,{summary:"Show usage example"},{default:s(()=>[o(d(t.codeExample),1)]),_:1}),i(m,{summary:"Show Modal.vue source code"},{default:s(()=>[o(d(t.code),1)]),_:1}),i(m,{summary:"Show BaseModal.vue source code"},{default:s(()=>[o(d(t.baseModalCode),1)]),_:1})])])])])}const q=y(b,[["render",S],["__scopeId","data-v-1ad353cf"]]);export{q as default};
