import{B as C,M as L,a as $}from"./Message-2887afb0.js";import{_ as w,r as m,o as s,j as t,w as a,c as f,F as M,g as D,k as h,n as v,e as y,t as k,l as E,Z as I,m as d,d as g,b as n}from"./index-25ad40af.js";import{B as u}from"./bulb-55e6a38e.js";import{C as S}from"./CodeExample-9a320293.js";import"./Button-a21d3abd.js";import"./Collapser-34c4994e.js";import"./arrow-dropdown-9bc8c7d9.js";import"./ExpandTransition-64163e5b.js";const T={components:{BaseMessage:C,Message:L,MessageLink:$},props:{messages:{type:Array,default:()=>[]}},emits:["copied","dismiss"]};function V(o,i,c,b,r,_){const p=m("BaseMessage"),l=m("MessageLink"),x=m("Message");return s(),t(I,{class:v([{active:c.messages.length>0},"messages"]),tag:"div",name:"messages"},{default:a(()=>[(s(!0),f(M,null,D(c.messages,e=>(s(),f(M,{key:e.id},[e.content?(s(),t(p,{key:0,type:e.type.toLowerCase()},{default:a(()=>[(s(),t(h(e.content)))]),_:2},1032,["type"])):(s(),t(x,{key:1,type:e.type.toLowerCase(),count:e.count,button:e.button,details:e.details,"show-close-button":e.showCloseButton,"show-collapser":e.showCollapser,class:v({"offset-details":e.icon}),onCopied:i[0]||(i[0]=B=>o.$emit("copied")),onDismiss:B=>o.$emit("dismiss",e.id)},{icon:a(()=>[(s(),t(h(e.icon)))]),default:a(()=>[y(" "+k(e.message)+" ",1),e.link?(s(),t(l,{key:0,link:e.link},null,8,["link"])):E("",!0)]),_:2},1032,["type","count","button","details","show-close-button","show-collapser","class","onDismiss"]))],64))),128))]),_:1},8,["class"])}const N=w(T,[["render",V],["__scopeId","data-v-ad8de576"]]),W=`<script>
import BaseMessage from './BaseMessage.vue';
import Message from './Message.vue';
import MessageLink from './MessageLink.vue';

/**
 * Displays multiple stacked messages. If a message is added or removed (e.g. dismissed), a smooth animation is shown.
 */
export default {
    components: {
        BaseMessage,
        Message,
        MessageLink
    },
    props: {
        /**
         * Array with message configuration objects.
         *
         * @example
         * [{
         *    id
         *    type (see Message component for supported values)
         *    icon (Component)
         *    button (optional button text)
         *    message (actual message String)
         *    content (optional Vue component to render instead of text message, icon, etc.)
         *    link: { (optional link that will be displayed after the message)
         *       text
         *       href (external links, will become <a></a>)
         *       to (internal links, will become <nuxt-link></nuxt-link>)
         *    }
         * }]
         */
        messages: {
            type: Array,
            default: () => []
        }
    },
    emits: ['copied', 'dismiss']
};
<\/script>

<template>
  <TransitionGroup
    :class="[{'active': messages.length > 0}, 'messages' ]"
    tag="div"
    name="messages"
  >
    <template
      v-for="message in messages"
      :key="message.id"
    >
      <BaseMessage
        v-if="message.content"
        :type="message.type.toLowerCase()"
      >
        <Component :is="message.content" />
      </BaseMessage>
      <Message
        v-else
        :type="message.type.toLowerCase()"
        :count="message.count"
        :button="message.button"
        :details="message.details"
        :show-close-button="message.showCloseButton"
        :show-collapser="message.showCollapser"
        :class="{ 'offset-details': message.icon }"
        @copied="$emit('copied')"
        @dismiss="$emit('dismiss', message.id)"
      >
        <template #icon>
          <Component
            :is="message.icon"
          />
        </template>
        {{ message.message }}
        <MessageLink
          v-if="message.link"
          :link="message.link"
        />
      </Message>
    </template>
  </TransitionGroup>
</template>

<style lang="postcss" scoped>
.messages {
  pointer-events: none;

  &.active {
    pointer-events: all;
  }

  & .offset-details :deep(.details) {
    padding-left: 47px;
  }
}

.message-link {
  text-decoration: underline;
  cursor: pointer;
}

.messages-enter-active,
.messages-leave-active {
  transition: all 0.3s;
}

.messages-enter-from,
.messages-leave-to {
  opacity: 0;
  transform: translateY(50px);
}
</style>
`,A=`<script>
import Messages from 'webapps-common/ui/components/Messages';
import BulbIcon from '~/webapps-common/ui/assets/img/icons/bulb.svg';

export default {
    components: {
        Messages
    },
    data() {
        return {
            messages: [{
                id: 1,
                type: 'info',
                message: 'Info message'
            }, {
                id: 2,
                type: 'warn',
                message: 'Warning message'
            }, {
                id: 3,
                type: 'success',
                message: 'Success message',
                icon: BulbIcon
            }, {
                id: 4,
                type: 'error',
                message: 'Error message',
                icon: BulbIcon,
                button: 'Okily Dokily!'
            }, {
                id: 5,
                type: 'error',
                message: 'Error message.',
                icon: BulbIcon,
                details: 'These are details',
                link: {
                    text: 'With appended link and details.',
                    href: 'https://www.knime.com/'
                }
            }]
        };
    },
    methods: {
        removeMessage(id) {
            this.messages = this.messages.filter(message => message.id !== id);
        }
    }
};
<\/script>

<template>
  <Messages
    :messages="messages"
    @dismiss="removeMessage"
  />
</template>`,G={components:{Messages:N,CodeExample:S},data(){return{codeExample:A,code:W,messages:[{id:1,type:"info",message:"Info message"},{id:2,type:"warn",count:3,message:"Warning message"},{id:3,type:"success",message:"Success message",icon:d(u)},{id:4,type:"error",message:"Error message",icon:d(u),button:"Okily Dokily!"},{id:5,type:"error",message:"Error message.",icon:d(u),details:"These are details",link:{text:"With appended link and details.",href:"https://www.knime.com/"}}]}},methods:{removeMessage(o){this.messages=this.messages.filter(i=>i.id!==o)}}},j=n("section",null,[n("div",{class:"grid-container"},[n("div",{class:"grid-item-12"},[n("h2",null,"Messages"),n("p",null," Displays multiple stacked messages and animates if a message is added or removed (e.g. dismissed). ")])])],-1),F={class:"grid-container"},O={class:"grid-item-12"};function z(o,i,c,b,r,_){const p=m("Messages",!0),l=m("CodeExample");return s(),f("div",null,[j,g(p,{messages:r.messages,onDismiss:_.removeMessage},null,8,["messages","onDismiss"]),n("section",null,[n("div",F,[n("div",O,[g(l,{summary:"Show usage example"},{default:a(()=>[y(k(r.codeExample),1)]),_:1}),g(l,{summary:"Show Messages.vue source code"},{default:a(()=>[y(k(r.code),1)]),_:1})])])])])}const Q=w(G,[["render",z]]);export{Q as default};
