import{M as m}from"./Message-2e3bca97.js";import{B as g}from"./bulb-dfa4f421.js";import{C as u}from"./circle-check-8fbdfb5f.js";import{I as f}from"./circle-info-a445c433.js";import{C as w}from"./CodeExample-cb06e525.js";import{_ as y,o as b,c as x,d as e,w as n,e as t,b as o,y as v,t as r,a as k,r as i}from"./index-2c1c3ffa.js";import"./Button-67c08039.js";import"./Collapser-9a1e2de3.js";import"./arrow-dropdown-11bcb03f.js";import"./ExpandTransition-8792b9f0.js";const M=`<script>
import BaseMessage from './BaseMessage.vue';
import MessageTitle from './MessageTitle.vue';
import Collapser from './Collapser.vue';
import MessageLink from './MessageLink.vue';
import CopyIcon from '../assets/img/icons/copy.svg';
import { copyText } from '../../util/copyText';

/**
 * Message banner component with close button
 */
export default {
    components: {
        BaseMessage,
        MessageTitle,
        Collapser,
        MessageLink,
        CopyIcon
    },
    props: {
        /**
         * One of 'info', 'error', 'success', 'warn'. Defaults to 'info'.
         * This has no implication on functionality, only styling
         */
        type: {
            type: String,
            default: 'info',
            validator(type = 'info') {
                return ['info', 'error', 'success', 'warn'].includes(type);
            }
        },
        /**
         * Enable / disable rendering of close button.
         * Defaults to \`true\`.
         */
        showCloseButton: {
            type: Boolean,
            default: true
        },
        /**
         * Enable / disable collapser for details.
         * If true, details will be down inside of the collapser content area and accessed by clicking on the
         * expand icon.
         * If false, details will be shown in the main message body below the message itself.
         * This property has no effect if the message does not have details.
         * Defaults to \`true\`.
         */
        showCollapser: {
            type: Boolean,
            default: true
        },
        /**
         * Optional button text.
         * If set, renders a button instead of the 'x' that is used for closing the Message.
         * If left blank, the 'x' is rendered.
         * This property has no effect if \`showCloseButton\` is \`false\`.
         */
        button: {
            type: String,
            default: null
        },
        count: {
            type: Number,
            default: 1
        },
        details: {
            type: [String, Object],
            default: ''
        }
    },
    emits: ['copied', 'dismiss'],
    data() {
        return {
            active: true
        };
    },
    computed: {
        detailsText() {
            let detailsText = this.details;
            if (detailsText && typeof detailsText !== 'string') {
                detailsText = this.details.text;
            }
            return detailsText;
        },
        detailsLink() {
            if (!this.detailsText) {
                return false;
            }
            // avoid passing a Vue watcher function (which can be picked up a truthy).
            return this.details.link && this.details.link.text ? this.details.link : false;
        },
        showDetailsCollapser() {
            return this.detailsText && this.showCollapser;
        }
    },
    methods: {
        onDismiss() {
            consola.trace('dismissing message');
            this.active = false;
            /**
             * Dismiss event. Fired when the close button / 'x' is clicked.
             * The embedding component should use this to clean up the instance.
             * Otherwise the message will be visually hidden, but still in memory.
             *
             * @event dismiss
             */
            this.$emit('dismiss');
        },
        copyMessage(event) {
            copyText(this.details);
            /**
             * copied event. Fired when the copy button in the detail area is clicked.
             * The embedding component should use this to notify the user that the message was copied successfully.
             *
             * @event copied
             */
            this.$emit('copied');
            event.target.focus();
        }
    }
};
<\/script>

<template>
  <BaseMessage
    v-if="active"
    :type="type"
    :class="type"
  >
    <Component
      :is="showDetailsCollapser ? 'Collapser' : 'div'"
      :class="showDetailsCollapser ? 'collapser' : 'banner'"
    >
      <template
        v-if="showDetailsCollapser"
        #title
      >
        <MessageTitle
          :type="type"
          :button="button"
          :show-close-button="showCloseButton"
          :count="count"
          @dismiss="onDismiss"
        >
          <template #icon>
            <slot name="icon" />
          </template>
          <slot />
        </MessageTitle>
      </template>
      <div
        v-if="!showDetailsCollapser"
        class="title"
      >
        <MessageTitle
          :type="type"
          :button="button"
          :show-close-button="showCloseButton"
          :count="count"
          @dismiss="onDismiss"
        >
          <template #icon>
            <slot name="icon" />
          </template>
          <slot />
        </MessageTitle>
      </div>
      
      <div
        v-if="detailsText"
        class="details"
      >
        <span class="detail-text">
          {{ detailsText }}
          <MessageLink
            v-if="detailsLink"
            :link="detailsLink"
          />
        </span>
        <div
          v-if="showCollapser"
          class="copy-button"
          title="Copy to clipboard"
          tabindex="0"
          @click="copyMessage($event)"
          @keyup.space.prevent="copyMessage($event)"
        >
          <CopyIcon />
        </div>
      </div>
    </Component>
  </BaseMessage>
</template>

<style lang="postcss" scoped>
.banner {
  width: 100%;
}

.details {
  display: inline-block;
  font-size: 13px;
  font-weight: 300;
  line-height: 18px;
  margin: auto 0;
}

.title {
  display: flex;
  align-items: center;
}

.collapser :deep(svg),
.banner :deep(svg) {
  position: relative;
  width: 24px;
  height: 24px;
  stroke-width: calc(32px / 24);
  stroke: var(--knime-white);
  margin-right: 20px;
  flex-shrink: 0;
  top: 3px;
}

.collapser {
  width: 100%;
  pointer-events: all;

  & :deep(.button) {
    display: flex;
    align-content: center;

    & .message {
      font-size: 16px;
      line-height: 24px;
      font-weight: 700;
    }

    & .dropdown {
      width: 30px;
      height: 30px;
      margin-right: 15px;
      top: 0;

      &:hover {
        background-color: var(--knime-masala-semi);
      }

      & .dropdown-icon {
        stroke: var(--knime-white);
      }
    }

    &:focus .dropdown {
      /* whole button gets focus but only dropdown icon is styled */
      background-color: var(--knime-masala-semi);
    }
  }

  & :deep(.panel) {
    width: 100vw;
    max-width: 100vw;
    background-color: var(--knime-white);
    opacity: 0.9;
    min-height: 50px;
    max-height: 100px;
    margin-bottom: -15px;
    display: flex;
    align-content: center;
    margin-top: 15px;
    padding: 10px calc(3 * var(--grid-gap-width)) 5px calc(3 * var(--grid-gap-width));
    position: relative;
    left: calc((100% - 100vw) / 2);

    & .details {
      min-width: var(--grid-min-width);
      display: flex;
      justify-content: space-between;
      overflow-y: auto;
      width: 100%;
      margin: 0 auto;
      max-width: calc(var(--grid-max-width) - 6 * var(--grid-gap-width)); /* same as grid-container */

      & .detail-text {
        display: inline-block;
        color: var(--knime-masala);
        font-size: 13px;
        font-weight: 300;
        line-height: 18px;
        margin: auto 0;
        max-width: 80%;
      }

      & .copy-button {
        border-radius: 50%;
        height: 30px;
        width: 30px;
        text-align: center;
        margin-right: 23px; /* line-up with dropdown icon */
        outline: none;
        cursor: pointer;

        &:hover,
        &:focus {
          background-color: var(--knime-silver-sand-semi);
        }

        & svg {
          margin: auto;
          top: 6px;
          stroke: var(--knime-dove-gray);
          height: 18px;
          width: 18px;
          stroke-width: calc(32px / 18);
        }
      }
    }
  }
}

@media only screen and (max-width: 1180px) {
  .collapser {
    & :deep(.panel) {
      padding-left: var(--grid-gap-width);
      padding-right: var(--grid-gap-width);
    }
  }
}
</style>
`,T=`<script>
import Message from 'webapps-common/ui/components/Message';
import BulbIcon from '~/webapps-common/ui/assets/img/icons/bulb.svg';
import CheckIcon from '~/webapps-common/ui/assets/img/icons/circle-check.svg';

export default {
    components: {
        Message,
        BulbIcon,
        CheckIcon
    }
};
<\/script>

<Message>
  This is a simple message
</Message>
<Message>
  <BulbIcon slot="icon" />
  This is a simple message with an icon.<br>
  <!-- eslint-disable-next-line vue/max-attributes-per-line -->
  <a href="#" @click.prevent>It contains markup</a>
</Message>
<Message
  type="error"
  button="Okily Dokily!"
>
  This is an error message with a button
</Message>
<Message type="success">
  <CheckIcon slot="icon" />
  This is a success message with an icon
</Message>
<Message :show-close-button="false">
  This is a message without close button
</Message>
<Message
  type="error"
  details="Some example detail text"
>
  This is a message with further details
</Message>
<Message
  type="info"
  :details="({
    text: 'Some details.',
    link: {
      text: 'Some docs.',
      href: 'https://docs.knime.com'
    }
  })"
>
  This is a message with a detail link
</Message>
<Message
  type="success"
  details="Some details"
  :show-collapser="false"
>
  This is a message with a details in the main banner
</Message>
<Message
  type="error"
  :details="({
    text: 'Some details.',
    link: {
      text: 'Some docs.',
      href: 'https://docs.knime.com'
    }
  })"
  :show-collapser="false"
>
  This is a message with a details and a link in the main banner
</Message>
<Message
  type="info"
  :details="({
    text: '<-- spacing must be styled from parent component, as the icon is provided via slot and can be' +
      ' of arbitrary size or composition.',
    link: {
      text: '(read more)',
      href: 'https://www.telerik.com/blogs/understanding-vue-deep-css-selector'
    }
  })"
  :show-collapser="false"
>
  <InfoIcon slot="icon" />
  This is a message with an icon, details and a link in the main banner
</Message>`,C={components:{Message:m,BulbIcon:g,CheckIcon:u,InfoIcon:f,CodeExample:w},data(){return{codeExample:T,code:M}}},_=k('<section><div class="grid-container"><div class="grid-item-12"><h2>Message</h2><p> There are several types of messages: <code>info</code> (default), <code>success</code> and <code>error</code>. </p><p> Each message can have an icon in the <code>icon</code> slot. For spacing of text when using an icon, please use the parent component to style the text accordingly. </p><p> A message can have an &#39;x&#39; button (default), or a close button with text, controlled by the <code>button</code> property, or neither, which can be achieved by setting the <code>showCloseButton</code> property to <code>false</code>. In this case the <code>button</code> property has no effect, no controls will be displayed, and you must programmatically dismiss the message. </p><p> Pressing the button or the &#39;x&#39; closes the widget and fires the <code>dismiss</code> event. </p><p> In addition a message can also contain <code>details</code> which are hidden and only displayed when the collapser button &#39;^&#39; (pointing down) is clicked. It is then possible to click the copy button which will copy the detail text and fire the <code>copied</code> event. </p><p> Alternatively, <code>details</code> can be displayed in the main banner section by setting the <code>showCollapser</code> property to <code>false</code>. </p><p> Any <code>details</code> can also contain links. These are configured by providing details as an <code>Object</code> (instead of a <code>String</code>) with the <code>link</code> property set. This can be used in combination with any of the other <code>details</code> configuration options. </p></div></div></section>',1),I=o("br",null,null,-1),B={class:"grid-container"},S={class:"grid-item-12"};function D(E,a,L,O,l,$){const s=i("Message",!0),d=i("BulbIcon"),p=i("CheckIcon"),h=i("InfoIcon"),c=i("CodeExample");return b(),x("div",null,[_,e(s,null,{default:n(()=>[t(" This is a simple message ")]),_:1}),e(s,null,{icon:n(()=>[e(d)]),default:n(()=>[t(" This is a simple message with an icon."),I,o("a",{href:"#",onClick:a[0]||(a[0]=v(()=>{},["prevent"]))},"It contains markup")]),_:1}),e(s,{type:"error",button:"Okily Dokily!"},{default:n(()=>[t(" This is an error message with a button ")]),_:1}),e(s,{type:"success"},{icon:n(()=>[e(p)]),default:n(()=>[t(" This is a success message with an icon ")]),_:1}),e(s,{"show-close-button":!1},{default:n(()=>[t(" This is a message without close button ")]),_:1}),e(s,{type:"error",details:"Some example detail text"},{default:n(()=>[t(" This is a message with further details ")]),_:1}),e(s,{type:"info",details:{text:"Some details.",link:{text:"Some docs.",href:"https://docs.knime.com"}}},{default:n(()=>[t(" This is a message with a detail link ")]),_:1},8,["details"]),e(s,{type:"success",details:"Some details","show-collapser":!1},{default:n(()=>[t(" This is a message with a details in the main banner ")]),_:1}),e(s,{type:"error",details:{text:"Some details.",link:{text:"Some docs.",href:"https://docs.knime.com"}},"show-collapser":!1},{default:n(()=>[t(" This is a message with a details and a link in the main banner ")]),_:1},8,["details"]),e(s,{type:"info",details:{text:"<-- spacing must be styled from parent component, as the icon is provided via slot and can be of arbitrary size or composition.",link:{text:"(read more)",href:"https://www.telerik.com/blogs/understanding-vue-deep-css-selector"}},"show-collapser":!1},{icon:n(()=>[e(h)]),default:n(()=>[t(" This is a message with an icon, details and a link in the main banner ")]),_:1},8,["details"]),o("section",null,[o("div",B,[o("div",S,[e(c,{summary:"Show usage example"},{default:n(()=>[t(r(l.codeExample),1)]),_:1}),e(c,{summary:"Show Message.vue source code"},{default:n(()=>[t(r(l.code),1)]),_:1})])])])])}const J=y(C,[["render",D]]);export{J as default};
