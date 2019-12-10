<template>
  <section>
    <div class="chat" v-if="user && chatClosed">
      <!-- <div class="chat" v-if="members && members.length"> -->
      <button class="close-chat" @click="closeChat">X</button>
      <div class="chat-title">
        <h1>{{this.user.owner.fullName}}</h1>
        <figure class="avatar">
          <img :src="this.user.profileImg" />
        </figure>
      </div>
      <div class="messages">
        <div class="messages-content">
          <ul v-for="(message,idx) in messagess" :key="idx">
            <li :class="{ 'message-from': message.from === user.owner.fullName }"
            >{{message.from}} : {{message.txt}} </li>
          </ul>
          <p>{{msgUserTyping}}</p>
          <!-- <div v-for="(message,idx) in messagess" :key="idx" class="message new">
          <figure class="avatar">
              <img :src="this.user.profileImg" />
          </figure>{{message.txt}} -->
          <!-- <div class="timestamp">{{timeAgo(Date.now())}}</div> -->
          <!-- </div> -->
        </div>
      </div>
      <form @submit.prevent="sendMsg">
        <div class="message-box">
          <input
            v-model="txt"
            @input="userIsTyping"
            type="text"
            class="message-input"
            placeholder="Type message..."
          />
          <button type="submit" class="message-submit">Send</button>
        </div>
      </form>
    </div>
    <div class="bg"></div>
  </section>
</template>



<script>
import eventBus from "../eventBus.js";
import socket from "../services/socket.service.js";
export default {
  data() {
    return {
      user: null,
      members: null,
      txt: "",
      messagess: [],
      msgUserTyping: "",
      chatClosed: true,
    };
  },
  created() {
    eventBus.$on("chatOpen", (dog, loggedUser) => {
      this.user = dog;
      const members = [dog, loggedUser];
      this.members = members;
          //make the room
      socket.emit("test users chat", members);
    });
    //got msg 
    socket.on("test got msg", msg => {
      this.messagess.push(msg);
    });
    socket.on("chat history", msgs => {
      // console.log('chat history on', msgs)
      this.messagess = msgs;

    });
    var timeOut = false;
    socket.on("user isTyping", msg => {
      if (timeOut) clearTimeout(timeOut);
      this.msgUserTyping = msg;
      timeOut = setTimeout(() => {
        this.msgUserTyping = "";
      }, 2500);
    });
  },
  destroyed() {
    socket.removeListener("chat newMsg");
    socket.removeListener("chat history");
    socket.removeListener("user typing");
  },
  methods: {
    sendMsg() {
      const currUserLogin = this.$store.getters.getcurrLoggedinUser.owner
        .fullName;

      const msg = {
        from: currUserLogin,
        txt: this.txt
      };
//send a msg
      socket.emit("chat msg", { members: this.members, msg });
      console.log("chat notification chat cmp", currUserLogin, this.user)
      socket.emit("chat notification", currUserLogin, this.user);
      this.txt = "";
    },
    userIsTyping() {
      const currUserLogin = this.$store.getters.getcurrLoggedinUser.owner
        .fullName;
      // console.log(currUserLogin);
      socket.emit("user typing", {
        members: this.members,
        user: currUserLogin
      });
    },
    closeChat() {
      this.chatClosed = !this.chatClosed;
    }
  }
};
</script>





<style lang="scss" scoped>

/*--------------------
Mixins
--------------------*/
@mixin center {
  position: fixed;
  top: 60%;
  left: 88%;
  transform: translate(-50%, -50%);
}

@mixin ball {
  @include center;
  content: "";
  display: block;
  width: 3px;
  height: 3px;
  border-radius: 25%;
  background: rgba(255, 255, 255, 0.7);
  z-index: 2;
  margin-top: 4px;
  animation: ball 0.45s cubic-bezier(0, 0, 0.15, 1) alternate infinite;
}

/*--------------------
Body
--------------------*/
*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body {
  height: 100%;
}

body {
  background: linear-gradient(135deg, #044f48, #2a7561);
  background-size: cover;
  font-family: "Open Sans", sans-serif;
  font-size: 12px;
  line-height: 1.3;
  overflow: hidden;
}

li {
  text-align: left;
}
.message-from{
 color: #6135a0;
  text-align: right;
  
}

ul{
  padding-right: 24px;
}
.bg {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
  background: url("https://images.unsplash.com/photo-1451186859696-371d9477be93?crop=entropy&fit=crop&fm=jpg&h=975&ixjsv=2.1.0&ixlib=rb-0.3.5&q=80&w=1925")
    no-repeat 0 0;
  filter: blur(80px);
  transform: scale(1.2);
}

/*--------------------
Chat
--------------------*/
.chat {
  @include center;
  width: 300px;
  height: 80vh;
  max-height: 500px;
  z-index: 2;
  overflow: hidden;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.2);
  // background: rgba(0, 0, 0, 0.5);
  background-color: white;
  border-radius: 2px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}

/*--------------------
Chat Title
--------------------*/
.chat-title {
  flex: 0 1 45px;
  position: relative;
  z-index: 2;
  // background: rgba(0, 0, 0, 0.2);
   background-color: #5ec8aa;
  // color: #fff;
  color: black;
  text-transform: uppercase;
  text-align: left;
  padding: 10px 10px 10px 50px;

  h1 {
    font-weight: normal;
    font-size: 13px;
    // margin: 0;
    // padding: 0;
    padding-left: 19px;
    padding-top: 5px;
  }

  .avatar {
    position: absolute;
    z-index: 1;
    top: 8px;
    left: 9px;
    // border-radius: 30px;
    width: 46px;
    // height: 30px;
    overflow: hidden;
    margin: 0;
    padding: 0;
    // border: 2px solid rgba(255, 255, 255, 0.24);

    img {
      width: 100%;
      height: auto;
    }
  }
}

/*--------------------
Messages
--------------------*/

@media screen and(max-width: 1025px) {
  .chat {
    left: 82%;
    top: 60%;
  }
}

@media screen and(max-width: 769px) {
  .chat {
    left: 80%;
    top: 60%;
  }
}
@media screen and(max-width: 415px) {
  .chat {
    left: 50%;
    top: 60%;
  }
}
@media screen and(max-width: 376px) {
  .chat {
    left: 50%;
    top: 60%;
  }
}
.close-chat {
  // background-color: #eee;
  position: absolute;
  right: 17px;
  color: black;
  top: 14px;
  z-index: 999;
}

.messages {
  flex: 1 1 auto;
  // color: rgba(255, 255, 255, 0.5);
  color: black;
  overflow: hidden;
  position: relative;
  width: 100%;

  & .messages-content {
    position: absolute;
    top: 0;
    left: 0;
    height: 101%;
    width: 100%;
  }

  .message {
    clear: both;
    float: left;
    padding: 6px 10px 7px;
    border-radius: 10px 10px 10px 0;
    background: rgba(0, 0, 0, 0.3);
    margin: 8px 0;
    font-size: 11px;
    line-height: 1.4;
    margin-left: 35px;
    position: relative;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);

    .timestamp {
      position: absolute;
      bottom: -15px;
      font-size: 9px;
      // color: rgba(255, 255, 255, 0.3);
      color: gray;
    }

    &::before {
      content: "";
      position: absolute;
      bottom: -6px;
      border-top: 6px solid rgba(0, 0, 0, 0.3);
      left: 0;
      border-right: 7px solid transparent;
    }

    .avatar {
      position: absolute;
      z-index: 1;
      bottom: -15px;
      left: -35px;
      border-radius: 30px;
      width: 30px;
      height: 30px;
      overflow: hidden;
      margin: 0;
      padding: 0;
      border: 2px solid rgba(255, 255, 255, 0.24);

      img {
        width: 100%;
        height: auto;
      }
    }

    &.message-personal {
      float: right;
      // color: #fff;
      color: black;
      text-align: right;
      background: linear-gradient(120deg, #248a52, #257287);
      border-radius: 10px 10px 0 10px;

      &::before {
        left: auto;
        right: 0;
        border-right: none;
        border-left: 5px solid transparent;
        border-top: 4px solid #257287;
        bottom: -4px;
      }
    }

    &:last-child {
      margin-bottom: 30px;
    }

    &.new {
      transform: scale(0);
      transform-origin: 0 0;
      animation: bounce 500ms linear both;
    }

    &.loading {
      &::before {
        @include ball;
        border: none;
        animation-delay: 0.15s;
      }

      & span {
        display: block;
        font-size: 0;
        width: 20px;
        height: 10px;
        position: relative;

        &::before {
          @include ball;
          margin-left: -7px;
        }

        &::after {
          @include ball;
          margin-left: 7px;
          animation-delay: 0.3s;
        }
      }
    }
  }
}

/*--------------------
Message Box
--------------------*/
.message-box {
  flex: 0 1 40px;
  width: 100%;
  background-color: #5ec8aa;
  // background: rgba(0, 0, 0, 0.3);
  padding: 10px;
  position: relative;

  & .message-input {
    background: none;
    border: none;
    outline: none !important;
    resize: none;
    // color: rgba(255, 255, 255, 0.7);
    color: black;
    font-size: 13px;
    height: 24px;
    margin: 0;
    padding-right: 20px;
    width: 265px;
  }

  textarea:focus:-webkit-placeholder {
    color: transparent;
  }

  & .message-submit {
    position: absolute;
    z-index: 1;
    top: 9px;
    right: 10px;
    color: #fff;
    border: none;
    background: #248a52;
    font-size: 10px;
    text-transform: uppercase;
    line-height: 1;
    padding: 6px 10px;
    border-radius: 10px;
    outline: none !important;
    transition: background 0.2s ease;
    z-index: 999;

    &:hover {
      background: #1d7745;
    }
  }
}

/*--------------------
Custom Srollbar
--------------------*/
.mCSB_scrollTools {
  margin: 1px -3px 1px 0;
  opacity: 0;
}

.mCSB_inside > .mCSB_container {
  margin-right: 0px;
  padding: 0 10px;
}

.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar {
  background-color: rgba(0, 0, 0, 0.5) !important;
}

/*--------------------
Bounce
--------------------*/
@keyframes bounce {
  0% {
    transform: matrix3d(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }
  4.7% {
    transform: matrix3d(0.45, 0, 0, 0, 0, 0.45, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }
  9.41% {
    transform: matrix3d(0.883, 0, 0, 0, 0, 0.883, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }
  14.11% {
    transform: matrix3d(1.141, 0, 0, 0, 0, 1.141, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }
  18.72% {
    transform: matrix3d(1.212, 0, 0, 0, 0, 1.212, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }
  24.32% {
    transform: matrix3d(1.151, 0, 0, 0, 0, 1.151, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }
  29.93% {
    transform: matrix3d(1.048, 0, 0, 0, 0, 1.048, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }
  35.54% {
    transform: matrix3d(0.979, 0, 0, 0, 0, 0.979, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }
  41.04% {
    transform: matrix3d(0.961, 0, 0, 0, 0, 0.961, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }
  52.15% {
    transform: matrix3d(0.991, 0, 0, 0, 0, 0.991, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }
  63.26% {
    transform: matrix3d(1.007, 0, 0, 0, 0, 1.007, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }
  85.49% {
    transform: matrix3d(0.999, 0, 0, 0, 0, 0.999, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }
  100% {
    transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }
}

@keyframes ball {
  from {
    transform: translateY(0) scaleY(0.8);
  }
  to {
    transform: translateY(-10px);
  }
}
</style>
