<template>
  <v-layout row wrap v-if="dogs">
    <div class="prev-container">
      <dog-preview
        style="width:307px;"
        class="onlyCell"
        @nextDog="plusDivs"
        :loggedinUser="loggedinUser"
        :dog="dogToShow"
        @delete="emitDeleteDog"
        @chatWith="userChatWith"
        @openChat="openChat"
        :userLoc="userLoc"
      ></dog-preview>
    </div>
    <v-flex  class="onlyDesk" xs12 sm6 mb4 lg3  v-for="dog in dogs" :key="dog._id" >
      <dog-preview
        @openChat="openChat"
        @chatWith="userChatWith"
        :loggedinUser="loggedinUser"
        :dog="dog"
        @delete="emitDeleteDog"
        :userLoc="userLoc"
      ></dog-preview>
    </v-flex>
  </v-layout>
</template>

<script>
import DogPreview from "./DogPreview.cmp.vue";

export default {
  props: ["dogs", "loggedinUser", "userLoc"],
  data() {
    return {
      indexRoll: 0
    };
  },
  computed: {
    dogToShow() {
      return this.dogs[this.indexRoll];
    }
  },
  methods: {
    openChat(dog) {
      this.$emit("openChat", dog);
      console.log("list open");
    },

    emitDeleteDog(dogId) {
      this.$emit("delete", dogId);
    },
    plusDivs(diff) {
      if (this.indexRoll >= 0 && this.indexRoll < this.dogs.length) {
        if (diff === 1 && this.indexRoll === this.dogs.length-1) {
          this.indexRoll = 0;
          this.dogToShow;
        } else if (diff === -1 && this.indexRoll === 0) {
          this.indexRoll = this.dogs.length -1;
          this.dogToShow;
        } else {
          this.indexRoll += diff;
          this.dogToShow;
        }
      }
    },
    userChatWith(dog) {
      // console.log('this is list', dog)
      this.$emit("chatWith", dog);
    }
  },

  components: {
    DogPreview
  }
};
</script>

<style scoped lang="scss">
.prev-container{
  margin: 0 auto;

}
.hide {
  display: none;
}
.show {
  display: block;
}

.onlyDesk {
  display: block;
    margin: 0 auto;

}

.onlyCell {
  display: none;
}

@media only screen and (max-width: 550px) {
  .onlyDesk {
    display: none;
  }

  .onlyCell {
    display: block;
  }
}
</style>
