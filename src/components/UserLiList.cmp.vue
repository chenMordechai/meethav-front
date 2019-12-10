<template>
  <section class="userLiList" v-if="dogs && currPark">
    <v-layout row>
      <v-flex class="containor">
        <v-card>
          <v-toolbar color="teal" dark>
            <!-- <v-toolbar-side-icon></v-toolbar-side-icon> -->

            <v-toolbar-title class="text-xs-center">{{currPark.name}}</v-toolbar-title>

            <v-spacer></v-spacer>
          </v-toolbar>

          <v-list subheader>
            <v-subheader>Dogs in the park</v-subheader>
            <v-list-tile
              v-for="dog in dogsToShow"
              :key="dog._id"
              avatar
              @click="goToUserProfile(dog._id)"
            >
              <v-list-tile-avatar>
                <img :src="dog.profileImg" />
              </v-list-tile-avatar>
              <v-list-tile-content v-if="dog.distanceTextFromUser">
                <v-list-tile-title
                  v-html="dog.preference.name  + ' & '+  dog.owner.fullName + ' ' + '(' + (dog.distanceValueFromUser/1000) + 'km from you'+ ')'"
                ></v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-content v-else>
                <v-list-tile-title v-html="dog.preference.name  + ' & '+  dog.owner.fullName "></v-list-tile-title>
              </v-list-tile-content>

              <!-- <v-list-tile-action>
                <v-icon :color="item.active ? 'teal' : 'grey'">Online</v-icon>
              </v-list-tile-action>-->
            </v-list-tile>
          </v-list>

          <v-divider></v-divider>
        </v-card>
      </v-flex>
    </v-layout>
  </section>
</template>

<script>
import dogsService from "../services/dogs.service";
import googleMapsService from "../services/googleMaps.service.js";

// todo : filter dogs by 2 mi from park, filter already is on dog.distanceValueFromMap - just do it !! ;

export default {
  name: "usersList",
  data() {
    return {
      userLoc: null,
      dogs: null,
      dogsList: []
    };
  },
  props: ["currPark"],

  computed: {
    distanceInKm(dog) {
      return dog.distanceValueFromUser / 1000;
    },
    dogsToShow() {
      var dogsInPark = [];
      for (var i = 0; i < this.dogs.length; i++) {
        var lat1 = this.dogs[i].location.lat;
        var lon1 = this.dogs[i].location.lng;
        var lat2 = this.currPark.geometry.location.lat;
        var lon2 = this.currPark.geometry.location.lng;
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
        if (distance < 0.7) dogsInPark.push(this.dogs[i]);
        function toRad(Value) {
          return (Value * Math.PI) / 180;
        }
      }
      return dogsInPark;

      // Converts numeric degrees to radians
    }
  },
  methods: {
    goToUserProfile(dogId) {
      this.$store.dispatch({ type: "loadCompInProfile", comp: "Gallery" });
      this.$router.push(`/user/${dogId}`);
    }
  },
  components: {},
  created() {
    this.$store.dispatch({ type: "loadDogs" }).then(() => {
      this.$store.dispatch({ type: "loadUserLoc" }).then(() => {
        this.$store.dispatch({ type: "loadSortDogs" }).then(() => {
          this.dogs = this.$store.getters.dogsToShow;
        });
      });
    });
  }
};
</script>

<style>
.container {
  padding-right: 40px;
  padding-left: 40px;
  min-width: 300px;
}

@media only screen and (max-width: 700px) {
  .containor {
    margin-top: 25px;
    padding-left: 0;
    padding-right: 0;
  }
}
</style>