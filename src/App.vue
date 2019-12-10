<template>
  <v-app>
    <v-content>
      <app-header></app-header>
      <chat v-if="isChatOpen"></chat>
      <router-view />
    </v-content>
    <footer>
      <div class="content has-text-centered">
        MEET
        <strong>HAV</strong>
        <br />by Daniel Shokri, Idan Elbaz and Chen Mordechai
      </div>
    </footer>
  </v-app>
</template>

<script>
import AppHeader from "./components/AppHeader.vue";
import socket from "./services/socket.service.js";
import chat from "./components/chat.cmp.vue";
import eventBus from "./eventBus.js";

export default {
  components: {
    AppHeader,
    chat
  },
  data() {
    return {
      user: null,
      userChatWith: null
    };
  },
  methods: {},
  created() {
    this.$store.dispatch({ type: "loggedInUser" });
    socket.on("friend req sent", user => {
      console.log("Listen to emit");
      this.$toast.open({
        message: `You have got freind request from ${user}`,
        type: "is-success",
        duration: 2000
      });
    });

    socket.on("chat notification sent", user => {
      console.log("chat notification sent");
      this.$toast.open({
        message: `You have got message from ${user}`,
        type: "is-success",
        duration: 2000
      });
    });

    //  socket.on("you got notification", user => {
    //        this.$store.dispatch({ type: "loggedInUser" });
    //     });

    socket.on("friend like sent", user => {
      this.$toast.open({
        message: `You have got liked by ${user}`,
        type: "is-success"
      });
    });

    eventBus.$on("userLogin", () => {
      this.$store.dispatch({ type: "loggedInUser" });
    });

    eventBus.$on("userLoggedOut", () => {
      this.$store.dispatch({ type: "loggedInUser" });
    });
  },
  computed: {
    isChatOpen() {
      return this.$store.getters.isChatOpen;
    }
  }
};
</script>


<style lang="scss">
#app {
  // font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }

  footer {
    padding: 30px 10px;
  }
}
</style>
