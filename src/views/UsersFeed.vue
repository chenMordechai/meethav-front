
<template>
  <section v-if="dogs && userLoc">
    <UsersFilter @setFilter="setFilter"></UsersFilter>
    <dog-list
      :userLoc="userLoc"
      @openChat="openChat"
      :loggedinUser="currUser"
      :dogs="dogs"
      @delete="deleteDog"
      @chatWith="userChatWith"
    ></dog-list>
  </section>
</template>

<script>
import dogList from "../components/DogList.cmp.vue";
import UsersFilter from "../components/UsersFilter.cmp";
import socket from "../services/socket.service.js";
import eventBus from "../eventBus.js";

export default {
  data() {
    return {
      userLoc: null,
      sortDog: false,
      currUser: null
    };
  },
  created() {
    this.$store.dispatch({ type: "loadCompInProfile", comp: "gallery" });
    this.$store.dispatch({ type: "loggedInUser" }).then(() => {
      this.currUser = this.$store.getters.getcurrLoggedinUser;
    });
    this.$store.dispatch({ type: "loadDogs" }).then(() => {
      this.$store.dispatch({ type: "loadUserLoc" }).then(() => {
        this.userLoc = this.$store.getters.getUserLoc;
        this.$store.dispatch({ type: "loadSortDogs" }).then(() => {
          this.sortDog = true;
        });
      });
    });
  },
  methods: {
    openChat(dog) {
      this.$store.dispatch({ type: "isChatOpen", dog }).then(() => {
        const loggedUser = this.$store.getters.getcurrLoggedinUser;
        if (this.$store.getters.isChatOpen)
          eventBus.$emit("chatOpen", dog, loggedUser);
        socket.emit("chat join", this.$store.getters.getcurrLoggedinUser);
      });
    },
    setFilter(filterBy) {
      this.$store.dispatch({ type: "setFilter", filterBy });
      this.$store.dispatch({ type: "loadDogs" });
    },
    deleteDog(dogId) {
      this.$store.dispatch({
        type: "deleteDog",
        dogId
      });
    },
    userChatWith(dog) {
      this.$emit("chatWith", dog);
    }
  },

  computed: {
    dogs() {
      const dogs = this.$store.getters.getDogs;
      if (this.currUser === null) return dogs;
      else {
        const dogsToShow = dogs.filter(dog => dog._id !== this.currUser._id);
        return dogsToShow;
      }
    }
  },
  components: {
    dogList,
    UsersFilter
  }
};
</script>

<style scoped>
</style>





