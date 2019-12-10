<template>
  <section v-if="dog && comp">
    <div class="profile-section">
      <user-gallery :user="dog"></user-gallery>
    </div>
    <!-- {{dog.friends}} -->
    <div class="container">
      <main>
        <div class="row">
          <div class="left col-lg-4">
            <div class="photo-left">
              <div class="contain-flex">
                <div class="user-profile-img">
                  <img class="photo" :src="imgToLoad" />
                  <h4 class="name">{{dog.owner.fullName}} and {{dog.preference.name}}</h4>
                  <div
                    class="btn-wrapper"
                    :class="{alerdyFriend : isFriends}"
                    v-if="notMyProfile || !dog"
                  >
                    <span @click="addFriend(dog._id)" class="add-friend">Add Friend</span>
                  </div>
                  <span class="like-friend">Likes ({{dog.gotLikes.length}})</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="btn-wrapper" v-if="notMyProfile || !dog">
          <!-- <span @click="addLike(dog._id)" class="like-friend">Like ({{dog.gotLikes.length}})</span> -->
        </div>

        <div class="row-comp">
          <v-subheader>About Me</v-subheader>
          <v-divider inset></v-divider>
          <p class="desc">
            {{dog.owner.fullName}},
            {{dog.owner.age}} year old
            {{dog.preference.name}} is my dog
            {{gender}} is {{dog.preference.type}}
            <span
              v-if="notMyProfile"
              class="meta more"
              tooltip="chat"
            >
              <button @click.prevent="openChat(dog)">
                <b-icon icon="chat-processing"></b-icon>
              </button>
            </span>
          </p>

          <v-subheader>Friends</v-subheader>
          <v-divider inset></v-divider>

          <div style="width: 100%;">
            <user-friends @openChat="openChat" @removeUser="removeUser" @goTO="onGoTo" :user="dog"></user-friends>
          </div>

          <v-subheader>Messages</v-subheader>
          <v-divider inset></v-divider>
          <div style="width: 100%;">
            <user-messages :user="dog"></user-messages>
          </div>

          <v-subheader>Notfication</v-subheader>
          <v-divider inset></v-divider>
          <a id="notfication" name="notfication" style="width: 100%;">
            <user-notfication
              v-if="!notMyProfile || !dog"
              @rejectReq="rejectFriendReq"
              @makeFriends="makeFriendship"
              :user="dog"
            ></user-notfication>
          </a>
        </div>
      </main>
    </div>
  </section>
  <!-- <div v-if="dog && comp" class="container">
    <header  :style="{ 'background-image': 'url(' + backImgToLoad + ')',
     'background-size': 'cover',
     'background-position': 'center'}">
    </header>
    <main>
      <div class="row">
        <div class="left col-lg-4">
          <div class="photo-left">
            <img class="photo" :src="imgToLoad" />
            <div class="active"></div>
          </div>
          <h4 class="name">{{dog.owner.fullName}} and {{dog.preference.name}}</h4>

          <div class="btn-wrapper" v-if="notMyProfile || !dog">
            <span @click="addFriend(dog._id)" class="add-friend">Add Friend</span>
            <span @click="addLike(dog._id)" class="like-friend">Like ({{dog.gotLikes.length}})</span>
          </div>
          <div class="btn-wrapper" v-if="!notMyProfile || !dog">
            <span class="like-friend">{{dog.gotLikes.length}} Likes</span>
          </div>
          <p class="desc">
            Hi ! My name is {{dog.owner.fullName}}
            I am {{dog.owner.age}} year old,
            {{dog.preference.name}} is my dog ,
            {{gender}} is {{dog.preference.type}} and
            {{gender}} liks to
            <span
              v-for="hobby in dog.preference.hobbies"
              :key="hobby._id"
            >{{hobby}},</span>
            and so.
            We are living in {{dog.address}}
          </p>
            <span v-if="notMyProfile" class="meta more" tooltip="chat">
            <button @click.prevent="openChat(dog)">
              <b-icon icon="chat-processing"></b-icon>
            </button>
          </span>

          <div class="social">
            <i>
              <b-icon icon="facebook-box"></b-icon>
            </i>
            <i>
              <b-icon icon="twitter-box"></b-icon>
            </i>
            <i>
              <b-icon icon="pinterest-box"></b-icon>
            </i>
            <i>
              <b-icon icon="tumblr-box"></b-icon>
            </i>
          </div>
        </div>
        <div class="right col-lg-8">
      
          <a
            v-on:click="toggleNav"
            role="button"
            class="navbar-burger burger"
            v-bind:class="{ 'is-active': isActive}"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>

          <div id="navbarBasicExample" class="navbar-menu" v-bind:class="{ 'is-active': isActive}">
            <ul class="nav">
              <li @click="openCopm('Gallery')">
                <b-icon icon="image"></b-icon>Gallery
              </li>
              <li @click="openCopm('Friends')">
                <b-icon icon="account-group"></b-icon>Friends
              </li>
              <li v-if="!notMyProfile || !dog" @click="openCopm('Messages')">
                <b-icon icon="message-bulleted"></b-icon>Messages
              </li>
              <li v-if="!notMyProfile || !dog" @click="openCopm('Notfication')">
                <b-icon icon="bell-ring"></b-icon>Notfication
              </li>
            </ul>
          </div>

          <div class="row comp">
            <div style="width: 100%;" v-if="this.comp ==='Gallery'">
              <user-gallery :user="dog"></user-gallery>
            </div>
            <div style="width: 100%;" v-if="this.comp==='Friends'">
              <user-friends @openChat ="openChat" @removeUser="removeUser" @goTO="onGoTo" :user="dog"></user-friends>
            </div>
            <div style="width: 100%;" v-if="this.comp==='Messages'">
              <user-messages :user="dog"></user-messages>
            </div>
            <div style="width: 100%;" v-if="this.comp ==='Notfication'">
              <user-notfication
                @rejectReq="rejectFriendReq"
                @makeFriends="makeFriendship"
                :user="dog"
              ></user-notfication>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>-->
</template>

<script>
import UserGallery from "../components/UserGallery.cmp.vue";
import UserFriends from "../components/UserFriends.cmp.vue";
import UserMessages from "../components/UserMessages.cmp.vue";
import UserNotfication from "../components/UserNotfication.cmp.vue";
import socket from "../services/socket.service.js";
import eventBus from "../eventBus.js";

export default {
  name: "profile",
  data() {
    return {
      isActive: false,
      comp: "",
      loggedinUser: null,
      isFriends: false
    };
  },
  mounted() {},
  created() {
    this.comp = this.$store.getters.compToShoe;
    var dogId = this.$route.params.id;
    this.$store.dispatch({
      type: "loadDogById",
      dogId
    });
    this.$store.dispatch({ type: "loggedInUser" }).then(() => {
      this.loggedinUser = this.$store.getters.getcurrLoggedinUser;
    });
  },
  methods: {
    openChat(dog) {
      if (this.loggedinUser === null) {
        this.$toast.open({
          message: "You need to login",
          type: "is-danger",
          duration: 2000
        });
        return;
      }
      this.$store
        .dispatch({ type: "loadDogById", dogId: dog.userId })
        .then(() => {
          const curDog = this.$store.getters.getDog;
          console.log("curr dog", curDog);
          this.$store.dispatch({ type: "isChatOpen", curDog }).then(() => {
            const loggedUser = this.$store.getters.getcurrLoggedinUser;
            if (this.$store.getters.isChatOpen)
              eventBus.$emit("chatOpen", curDog, loggedUser);
            socket.emit("chat join", this.$store.getters.getcurrLoggedinUser);
          });
        });
    },

    toggleNav() {
      this.isActive = !this.isActive;
    },

    addLike(dogId) {
      if (this.loggedinUser === null) {
        this.$toast.open({
          message: "You need to login",
          type: "is-danger",
          duration: 2000
        });
      } else {
        const userSentLikes = this.loggedinUser.sentLikes;
        if (userSentLikes.find(id => id === this.dog._id)) {
          this.$toast.open({
            message: "You are already Liked",
            type: "is-danger",
            duration: 2000
          });
        } else {
          this.$store.dispatch({ type: "updateFriendLike", dogId }).then(() => {
            this.$toast.open({
              message: "Like successfully!",
              type: "is-success",
              duration: 2000
            });
          });
        }
      }
    },
    addFriend(dogId) {
      if (this.loggedinUser === null) {
        this.$toast.open({
          message: "You need to login",
          type: "is-danger",
          duration: 2000
        });
        return;
      } else {
        const userFriends = this.loggedinUser.friends;
        const userSentFriendReq = this.loggedinUser.sentFriendsReq;
        if (userFriends.find(friend => friend.userId === this.dog._id)) {
          this.isFriends = false;
          this.$toast.open({
            message: "You are already friend",
            type: "is-danger",
            duration: 2000
          });
        } else if (userSentFriendReq.find(id => id === this.dog._id)) {
          this.$toast.open({
            message: "You have already sent friend request",
            type: "is-danger",
            duration: 2000
          });
        } else {
          this.$store.dispatch({ type: "updateFriendReq", dogId }).then(() => {
            this.$toast.open({
              message: "friend request successfully sent!",
              type: "is-success",
              duration: 2000
            });
          });
        }
      }
    },
    openCopm(cmp) {
      this.comp = cmp;
    },
    onGoTo(dogId) {
      this.$store.dispatch({
        type: "loadDogById",
        dogId
      });
      this.$router.push(`/user/${dogId}`);
    },

    makeFriendship(sentUser) {
      this.$store.dispatch({ type: "makeFriendShip", dog: sentUser });
    },
    rejectFriendReq(sentUser) {
      this.$store.dispatch({ type: "rejectFriendShip", dog: sentUser });
    },
    removeUser(dogId) {
      console.log(dogId);
      this.$store.dispatch({ type: "removeFriend", dogId });
      this.$toast.open({
        message: "Remove friend successfully",
        type: "is-success",
        duration: 2000
      });
    }
  },
  computed: {
    notMyProfile() {
      if (!this.loggedinUser) return true;
      else {
        if (this.loggedinUser._id === this.dog._id) return false;
        else return true;
      }
    },

    dog() {
      return this.$store.getters.getDog;
    },
    gender() {
      if (this.dog.preference.gender === "female") return "she";
      else return "he";
    },
    who() {
      return this.dog.owner.fullName;
    },
    imgToLoad() {
      if (this.dog.profileImg) return this.dog.profileImg;
      else return "https://www.sunnyskyz.com/uploads/2016/12/nlf37-dog.jpg";
    },
    backImgToLoad() {
      if (this.dog.profileImg) return this.dog.backImg;
      else return "https://www.sunnyskyz.com/uploads/2016/12/nlf37-dog.jpg";
    }
  },
  components: {
    UserGallery,
    UserFriends,
    UserMessages,
    UserNotfication
  }
};
</script>
<style scoped>
.contain-flex {
  display: flex;
  flex-direction: column;
  position: fixed;
}
.alerdyFriend {
  background-color: #888;
  color: #fff;
}
.row-comp {
  grid-column: 4/9;
  grid-row: 1/5;
}

/* _-------------_ */
html,
body {
  background: #efefef;
  font-family: "Arial";
}

.container {
  max-width: 1220px;
  margin: 30px auto 30px;
  padding: 0 !important;
  width: 100%;
  background-color: #fafafa;
}

header {
  height: 250px;
  /* background-color: #97debe; */
}

header i {
  position: absolute;
  cursor: pointer;
  right: -90%;
  top: 25px;
  font-size: 18px !important;
  color: #fff;
}
header img {
  height: 250px;
  width: 100%;
}

.b-tabs {
  grid-column: 3/8;
  grid-row: 1/4;
}

main {
  padding: 20px 20px 0px 20px;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 100px);
}

.left {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.photo {
  height: 200px;
  margin-top: -120px;
  border: 4px solid #fff;
}

.btn-wrapper {
  padding: 20px;
  text-align: left;
  margin: 0 81px;
}

@media (max-width: 575px) {
  .contain-flex {
    display: grid;
    position: static;
  }
  .btn-wrapper {
    margin: 0 54px;
  }
  .row {
    display: grid;
    grid-column: 4;
  }
  main {
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: repeat(12, 100px);
  }
  .row-comp {
    grid-column: 1/9;
    grid-row: 5/5;
  }
}

@media (max-width: 800px) {
  header {
    height: 150px;
  }

  header img {
    height: 200px;
  }
  .photo {
    margin-top: 0;
  }
}

.active {
  width: 20px;
  height: 20px;
  border-radius: 20px;
  position: absolute;
  right: calc(50% - 70px);
  top: 75px;
  background-color: #ffc107;
  border: 3px solid #fff;
}

@media (max-width: 990px) {
  .active {
    right: calc(50% - 60px);
    top: 50px;
  }
  header i {
    /* position: absolute;
    top: -266px; */
    color: rgb(255, 255, 255);
    position: absolute;
    top: 20px;
    right: 20px;
  }
  .right {
    width: 100%;
  }
}
@media (min-width: 990px) {
  .row {
    flex-wrap: nowrap;
  }
  .main {
    padding: 30px;
  }
  .left {
    width: 35%;
  }
  .right {
    width: 65%;
  }
}

.name {
  margin-top: 20px;
  font-family: "Open Sans";
  font-weight: 600;
  font-size: 24pt;
  color: #777;
}

.info {
  margin-top: -5px;
  margin-bottom: 5px;
  font-family: "Montserrat", sans-serif;
  font-size: 11pt;
  color: #aaa;
}

.stats {
  margin-top: 25px;
  text-align: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #ededed;
  font-family: "Montserrat", sans-serif;
}

.number-stat {
  padding: 0px;
  font-size: 14pt;
  font-weight: bold;
  font-family: "Montserrat", sans-serif;
  color: #aaa;
}

.desc-stat {
  margin-top: -15px;
  font-size: 10pt;
  color: #bbb;
}

.desc {
  text-align: left;
  font-size: 16pt;
  font-family: "Open Sans";
  grid-column: 7/4;
}

.social {
  margin: 5px 0 12px 0;
  text-align: center;
  display: inline-block;
  font-size: 20pt;
}

.social i {
  cursor: pointer;
  margin: 0 15px;
}

.social i:nth-child(1) {
  color: #4267b2;
}
.social i:nth-child(2) {
  color: #1da1f2;
}
.social i:nth-child(3) {
  color: #bd081c;
}
.social i:nth-child(4) {
  color: #36465d;
}

.right {
  padding: 0 25px 25px 25px !important;
}

.nav {
  display: inline-flex;
}

.nav li {
  margin: 40px 30px 0 10px;
  cursor: pointer;
  font-size: 13pt;
  text-transform: uppercase;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  color: #888;
  border-bottom: 2px solid rgb(255, 254, 254);
}

.nav li:hover {
  color: #999;
  border-bottom: 2px solid #999;
}

.add-friend {
  /* position: absolute;
  right: 8%; */
  /* top: 35px; */
  font-size: 21px;
  background-color: #42b1fa;
  color: #fff;
  padding: 8px 15px;
  cursor: pointer;
  transition: all 0.4s;
  font-family: "Montserrat", sans-serif;
  font-weight: 400;
  width: 250px;
}
.like-friend {
  font-size: 11pt;
  background-color: #fa4270;
  color: #fff;
  padding: 8px 15px;
  cursor: pointer;
  transition: all 0.4s;
  font-family: "Montserrat", sans-serif;
  font-weight: 400;
  width: 250px;
}

@media (max-width: 990px) {
  .nav {
    flex-direction: column;
    /* display: none; */
  }
}
</style>