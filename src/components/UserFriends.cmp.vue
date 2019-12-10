<template>
  <div class="friends-container" v-if="user">
    <div class="card" v-for="dog in user.friends" :key="dog.userId">
      <img @click="goToUser(dog.userId)" :src="dog.userImg" alt="Avatar" />
      <div class="container">
        <h4>
          <b class="dogName" @click="goToUser(dog.userId)">{{dog.userName}}</b>
        </h4>
        <br />
         <span v-if="myProfile" class="meta more chat" tooltip="chat">
            <button @click.stop.prevent="openChat(dog)">
              <b-icon icon="chat-processing"></b-icon>
            </button>
          </span>
           <span v-if="myProfile" class="meta more remove" tooltip="remove">
            <button @click="removeUser(dog.userId)">
              <b-icon icon="account-remove"></b-icon>
            </button>
          </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    show: false
  }),
  props: ["user"],
  methods: {
    openChat(dog) {
      this.$emit('openChat', dog)
      console.log('prev open')
    },
    //   openChat(dog) {
    //    console.log('lalalal', dog)
    //   this.$store.dispatch({type:"loadDogById" , dogId: dog.userId})
    //   .then(()=>{
    //     const curDog = this.$store.getters.getDog
    //     console.log('curr dog', curDog)
    //   this.$store.dispatch({ type: "isChatOpen", curDog }).then(() => {
    //     const loggedUser = this.$store.getters.getcurrLoggedinUser[0];
    //     if (this.$store.getters.isChatOpen)
    //       eventBus.$emit("chatOpen", curDog, loggedUser);
    //     socket.emit("chat join", this.$store.getters.getcurrLoggedinUser[0]);
    //   });
    //   }) 
    // },
    goToUser(dogId) {
      this.$emit("goTO", dogId);
    },
    removeUser(dogId) {
      this.$emit("removeUser", dogId);
    }
  },
   computed: {
    myProfile() {
      if(!this.loggedinUser) return false
    else{
      if (this.loggedinUser._id === this.user._id) return true;
      else return false;
    }
    },
     loggedinUser() {
      if (!this.$store.getters.getcurrLoggedinUser) return;
      return this.$store.getters.getcurrLoggedinUser;
    },
   }
}
</script>


<style scoped lang="scss">
.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  margin: 10px;
  max-width: 150px;
  height: fit-content
}
@media (max-width: 550px) {
  .card{
    max-width: 147px;
  }
}
.chat{
  position: relative;
  bottom: 0px;
  right: 41px;
}
.remove {
  cursor: pointer;
  position: relative;
  bottom: 0px;
  right: -41px;
}

.dogName {
  cursor: pointer;
}

.card:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}

.container {
  padding: 2px 16px;
}

.friends-container {
  display: flex;
  flex-wrap: wrap;
}

img {
  width: 100%;
  height: 90px;
  cursor: pointer;
}
</style>
