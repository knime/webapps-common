import{P as v}from"./circle-play-B2WzYmNc.js";import{C as y}from"./CodeExample-CoNj0z7n.js";import{_,G as w,r as n,o as g,c as M,b as t,d as i,w as s,e,t as m,p as x,f as A}from"./index-CrNhIGJr.js";import{M as C}from"./Modal-DxXWdp-w.js";import{C as b}from"./Checkbox-Bq6oMTXU.js";const k="",B="",S=`<script>
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
`,I={components:{Modal:C,PlayIcon:v,Button:w,CodeExample:y,Checkbox:b},data(){return{codeExample:S,code:k,baseModalCode:B,modalActive:!1,modalStyleType:"info",animate:!0,implicitDismiss:!0}}},u=c=>(x("data-v-1ad353cf"),c=c(),A(),c),T={class:"grid-container"},V={class:"grid-item-12"},E=u(()=>t("p",null,[e(" Offers multiple optional slots for content to show inside a "),t("a",{href:"https://en.wikipedia.org/wiki/Modal_window"},"modal dialog"),e(". Multiple styles are supported by the "),t("code",null,"styleType"),e(" prop. See source code for possible values. The modal emits a "),t("code",null,"cancel"),e(" event which is triggered by clicking the overlay, the ESC key or the close button. Also on tab, the focus is trapped inside the modal. ")],-1)),P=u(()=>t("p",null,[e(" For the rare cases where more design freedom is needed, please use the "),t("code",null,"BaseModal"),e(" component which comes without a header and styled slots. But please be aware of "),t("a",{href:"https://www.w3.org/TR/wai-aria-practices-1.1/examples/dialog-modal/dialog.html"},"W3C best practices for modal dialogs"),e(". ")],-1)),D={class:"options"},N={class:"grid-container"},U={class:"grid-item-12"};function j(c,l,F,G,o,O){const p=n("Button"),r=n("Checkbox"),f=n("PlayIcon"),h=n("Modal",!0),d=n("CodeExample");return g(),M("div",null,[t("section",null,[t("div",T,[t("div",V,[E,P,t("div",D,[i(p,{primary:"",onClick:l[0]||(l[0]=a=>o.modalActive=!0)},{default:s(()=>[e(" Trigger modal ")]),_:1}),i(r,{modelValue:o.animate,"onUpdate:modelValue":l[1]||(l[1]=a=>o.animate=a)},{default:s(()=>[e(" Animate on enter ")]),_:1},8,["modelValue"]),i(r,{modelValue:o.implicitDismiss,"onUpdate:modelValue":l[2]||(l[2]=a=>o.implicitDismiss=a)},{default:s(()=>[e(' Autodismiss via "Esc" or clicking on backdrop ')]),_:1},8,["modelValue"])]),i(h,{active:o.modalActive,title:"Modal title",class:"modal","style-type":o.modalStyleType,animate:o.animate,"implicit-dismiss":o.implicitDismiss,onCancel:l[4]||(l[4]=a=>o.modalActive=!1)},{icon:s(()=>[i(f)]),notice:s(()=>[e("This is the notice slot.")]),confirmation:s(()=>[e("And this is content in the confirmation slot.")]),controls:s(()=>[i(p,{primary:"",onClick:l[3]||(l[3]=a=>o.modalActive=!1)},{default:s(()=>[e(" Accept and close ")]),_:1})]),_:1},8,["active","style-type","animate","implicit-dismiss"])])])]),t("section",null,[t("div",N,[t("div",U,[i(d,{summary:"Show usage example"},{default:s(()=>[e(m(o.codeExample),1)]),_:1}),i(d,{summary:"Show Modal.vue source code"},{default:s(()=>[e(m(o.code),1)]),_:1}),i(d,{summary:"Show BaseModal.vue source code"},{default:s(()=>[e(m(o.baseModalCode),1)]),_:1})])])])])}const J=_(I,[["render",j],["__scopeId","data-v-1ad353cf"]]);export{J as default};
