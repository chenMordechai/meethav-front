<template>
  <section v-if="user" class="userLiList">
    <v-layout row>
      <v-flex>
        <v-card>
          <section v-if="user.gotFriendsReq.length">
            <v-toolbar dense expand dark>
              <v-toolbar-title class="text-xs-center">Notfications</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
          </section>
          <section v-else>
            <v-toolbar dense expand dark>
              <v-toolbar-title class="text-xs-center">Nothing Here.</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
          </section>
          <v-list subheader>
            <!-- <v-subheader>Dogs in the park</v-subheader> -->
            <v-list-tile
              v-for="notfication in user.gotFriendsReq"
              :key="notfication.userName"
              avatar
            >
              <v-list-tile-avatar>
                <img :src="notfication.userImg" />
              </v-list-tile-avatar>
              {{notfication.userName}} Has sent you friend request
              <v-list-tile-content></v-list-tile-content>
              <v-list-tile-action>
                <v-btn @click="confirmFriendShip(notfication)" icon ripple><b-icon icon="account-check"></b-icon></v-btn>
                <v-btn @click="rejectFriendReq(notfication)" icon ripple><b-icon icon="account-minus"></b-icon></v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>

          <v-divider></v-divider>
        </v-card>
      </v-flex>
    </v-layout>
  </section>
  <section v-else class="no-notification">Nothing here.</section>
</template>

<script>
export default {
  props: ["user"],
  data() {
    return {
      currUser: null
    };
  },
  methods: {
    confirmFriendShip(sentUser) {
      this.$emit("makeFriends", sentUser);
    },
    rejectFriendReq(sentUser) {
      this.$emit("rejectReq", sentUser);
    }
  },
  computed: {
    checkIfNotfications() {
      if (this.user.gotFriendsReq) return "Notfications";
      else return "Nothing Here.";
    }
  }
};
</script>


<style scoped>
.no-notification {
  margin: 0 auto;
}

.v-list__tile__action--stack{
      flex-direction: row;
}
</style>
