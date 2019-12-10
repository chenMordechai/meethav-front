<template>
  <div class="grid" v-touch:swipe="swipeHandler" v-if="dog">
    <div class="card">
      <div
        @click="openProfile(dog._id)"
        class="card__thumbnail"
        :style="{ 'background-image': 'url(' + imgToLoad + ')'}"
      ></div>
      <div class="card__content">
        <button class="plus onlyCell" @click="plusDivs(-1)">&#10094;</button>
        <button class="minus onlyCell" @click="plusDivs(1)">&#10095;</button>
        <h3>{{dog.owner.fullName}} and {{dog.preference.name}}</h3>
        <span class="ago">{{dog.preference.name}} is {{dog.preference.type}}</span>
        <p>{{distanceFromCurrUser}} km from you</p>
      </div>
      <div class="card__footer">
        <div class="card__footer__meta">
          <span class="meta" tooltip="Like">
            <button @click="addLike(dog._id)">
              <b-icon class="color" icon="thumb-up"></b-icon>
            </button>
          </span>
          <span class="meta more" tooltip="Likes">
            {{dog.gotLikes.length}}
            <i class="fa fa-eye"></i>
          </span>
          <span class="meta" tooltip="Friendog">
            <button @click="addFriend(dog._id)">
              <b-icon class="color" icon="account-plus"></b-icon>
            </button>
          </span>
          <span class="meta more" tooltip="Friends">
            {{dog.friends.length}}
            <i class="fa fa-share"></i>
          </span>
          <span class="meta" tooltip="chat">
            <button @click.prevent="openChat(dog)">
              <b-icon class="color" icon="chat-processing"></b-icon>
            </button>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import socket from "../services/socket.service.js";

export default {
  props: ["dog", "loggedinUser", "userLoc"],
  data() {
    return {};
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
      this.$emit("openChat", dog);
    },

    plusDivs(diff) {
      this.$emit("nextDog", diff);
    },
    swipeHandler(direction) {
      if (direction === "right") this.plusDivs(1);
      else if (direction === "left") this.plusDivs(-1);
    },

    addFriend(dogId) {
      if (this.loggedinUser === null) {
        this.$toast.open({
          message: "You need to login",
          type: "is-danger",
          duration: 2000
        });
      } else {
        const userFriends = this.loggedinUser.friends;
        const userSentFriendReq = this.loggedinUser.sentFriendsReq;
        if (userFriends.find(friend => friend.userId === this.dog._id)) {
          this.$toast.open({
            message: "You are already friends",
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
            socket.emit(
              "friend req",
              this.dog,
              this.$store.getters.getcurrLoggedinUser
            );
            this.$toast.open({
              message: "friend request successfully sent!",
              type: "is-success",
              duration: 2000
            });
          });
        }
      }
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
            socket.emit(
              "friend like",
              this.dog,
              this.$store.getters.getcurrLoggedinUser
            );
          });
        }
      }
    },
    goToEdit(dogId) {
      this.$router.push(`/user/edit/${dogId}`);
    },
    emitDeleteDog(dogId) {
      this.$emit("delete", dogId);
    },
    openProfile(dogId) {
      this.$store.dispatch({ type: "loadCompInProfile", comp: "Gallery" });
      this.$router.push(`/user/${dogId}`);
    }
  },
  computed: {
    distanceFromCurrUser() {
      var lat1 = this.dog.location.lat;
      var lon1 = this.dog.location.lng;
      var lat2 = this.userLoc.position.lat;
      var lon2 = this.userLoc.position.lng;
      var R = 6371; // km
      var dLat = toRad(lat2 - lat1);
      var dLon = toRad(lon2 - lon1);
      lat1 = toRad(lat1);
      lat2 = toRad(lat2);

      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) *
          Math.sin(dLon / 2) *
          Math.cos(lat1) *
          Math.cos(lat2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var distance = R * c;
      function toRad(Value) {
        return (Value * Math.PI) / 180;
      }
      var shortDistance = distance.toString().substring(0, 4);
      return shortDistance;
    },

    gender() {
      if (this.dog.preference.gender === "female") return "she";
      else return "he";
    },
    getLocation() {
      var location = this.dog.location;
    },
    imgToLoad() {
      if (this.dog.profileImg) {
        return this.dog.profileImg;
      } else {
        return "https://cdn1.medicalnewstoday.com/content/images/articles/322/322868/golden-retriever-puppy.jpg";
      }
    }
  },
  components: {}
};
</script>
<style scoped lang="scss">
// @import url('https://fonts.googleapis.com/css?family=Lato:400');

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  grid-auto-flow: row dense;
  grid-gap: 1.9vw;
  margin: 20px;
}
.minus {
  position: relative;
  right: -131px;
  display: inline;
}

.plus {
  position: relative;
  left: -157px;
  display: inline;
}

.onlyCell {
  visibility: hidden;
}

.card__thumbnail:hover {
  cursor: pointer;
}
.card {
  // background-color: white;
  box-shadow: 0 0.5px 0.5px rgba(10, 10, 10, 0.1),
    0 0 0 1px rgba(10, 10, 10, 0.1);
  // color: #4a4a4a;
  // max-width: 100%;
  // position: relative;
  // width: 300px;
  border-radius: 0;
  will-change: transform, box-shadow;
  background-color: #fff;
  &__thumbnail {
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    background-color: transparent;
    position: relative;
    height: 205px;
    &__share {
      width: 80px;
      position: absolute;
      opacity: 0;
      will-change: opacity;
      right: 10px;
      top: 10px;
      pointer-events: none;
      transition: opacity 0.35s 0.2s;
      ul {
        list-style-type: none;
        li {
          background-color: #fff;
          // border-radius: 50%;
          width: 25px;
          height: 25px;
          line-height: 25px;
          margin-bottom: 10px;
          text-align: center;
          color: #4f575b;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          i {
            font-size: 12px;
          }
          &:hover {
            color: #000;
          }
        }
      }
    }
  }
  &__content {
    font-family: Arial, sans-serif;
    position: relative;
    // padding: 20px 25px 20px 25px;
    h4 {
      font-size: 18x;
      font-weight: normal;
      color: #000;
      margin-top: 5px;
      margin-bottom: 5px;
    }
    p {
      font-size: 12px;
      position: relative;
      margin-top: 5px;
      margin-bottom: 5px;
      &:before {
        // content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 40px;
        box-shadow: inset 0px -50px 50px -15px rgba(255, 255, 255, 1);
      }
    }
    .read-more,
    .ago {
      color: rgb(122, 128, 133);
      font-size: 12px;
      text-align: left;
      transition: color 0.35s;
    }
    .read-more {
      cursor: pointer;
    }
    .author {
      width: 20px;
      height: 20px;
      position: absolute;
      top: -20px;
      background-color: #fff;
      border-radius: 50%;
      padding: 10px;
    }
  }
  &__footer {
    border-top: 1px solid #eaf1f6;
    min-height: 50px;
    &__meta {
      display: flex;
      align-items: center;
      // display: block;
      min-height: 50px;
      padding: 0px 15px;
      box-sizing: border-box;
      padding-top: 10px;

      .meta {
        cursor: pointer;
        display: block;
        width: 26px;
        height: 26px;
        float: left;
        color: #b2c0c8;
        line-height: 26px;
        text-align: center;
        // font-size: 12px;
        // border-radius: 50%;
        transition: color 0.35s, border 0.35s;
        box-sizing: border-box;
        &:hover {
          color: #778d99;
        }
        .color {
          color:#02626e70;
        }
      }
      .more {
        background-color: transparent;
        line-height: 26px;
        font-size: 16px;
        color:#02626e70;
        margin-bottom: 6px;
      }
      .stats {
        float: right;
        font-family: Arial, sans-serif;
        color: #b3c0c8;
        font-size: 15px;
        line-height: 20px;
        vertical-align: middle;
        margin-right: 5px;
        .fa {
          cursor: inherit;
          background-color: transparent;
          margin-left: 5px;
        }
      }
    }
  }
}
.card__content {
  h3 {
    font-weight: bold;
    font-size: 20px;
  }
  .ago,
  p,
  span {
    font-size: 16px;
    // padding: 7px;
  }
}
[tooltip] {
  position: relative;
  font-family: Arial, sans-serif;
  &:hover {
    &:before {
      opacity: 1;
    }
    &:after {
      opacity: 1;
    }
  }
  &:before {
    content: "";
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    border-width: 4px 6px 0 6px;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.7) transparent transparent transparent;
    z-index: 0;
    opacity: 0;
    will-change: opacity;
    transition: opacity 0.3s ease-out;
  }
  &:after {
    content: attr(tooltip);
    position: absolute;
    left: 50%;
    top: -6px;
    transform: translateX(-50%) translateY(-100%);
    background: rgba(0, 0, 0, 0.7);
    text-align: center;
    color: #fff;
    padding: 2px 8px;
    font-size: 11px;
    letter-spacing: 1px;
    border-radius: 3px;
    pointer-events: none;
    opacity: 0;
    will-change: opacity;
    transition: opacity 0.3s ease-out;
  }
}

@media only screen and (max-width: 550px) {
  .onlyDesk {
    display: none;
  }

  .onlyCell {
    visibility: visible;
  }
}
</style>

