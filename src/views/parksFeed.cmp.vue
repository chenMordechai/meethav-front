<template>
  <section class="parksFeed" v-if="userLoc" style="mar">
    <park-list :userLoc="userLoc" :park="parkToShow" @nextPark="plusDivs" :gardens="gardens"></park-list>
    <!-- <v-layout row wrap> -->
    <!-- <v-flex  xs12 sm6 mb4 lg3 v-for="nearestGarden in gardens" :key="nearestGarden.id">
        <parkPrev :park="nearestGarden"></parkPrev>
    </v-flex>-->
    <!-- </v-layout> -->
  </section>
</template>

<script>
import googleMapsService from "../services/googleMaps.service.js";
import dogsService from "../services/dogs.service";
import parkList from "../components/ParksList.cmp.vue";
const googleKey = "AIzaSyDg8EFZZ2HBS2X6aqRzwRwfEbPO9SJLPfc";

export default {
  name: "parksFeed",
  data() {
    return {
      distance: "",
      userLoc: null,
      gardens: [],
      photos: [],
      indexRoll: 0
    };
  },
  components: {
    parkList
  },
  created() {
    dogsService.getPosition().then(pos => {
      this.userLoc = {
        position: {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        }
      };
      googleMapsService.getInfo(this.userLoc.position).then(pos => {
        for (var i = 0; i < pos.length; i++) {
          this.gardens.push(pos[i]);
          if (this.gardens[i].photos.length > 0)
            this.photos.push(this.gardens[i].photos[0].photo_reference);
          else
            this.photos.push(
              "https://farm66.static.flickr.com/65535/47022341624_c26416f670_b.jpg"
            );
          if (this.gardens[i].photos[0].photo_reference)
            this.gardens[
              i
            ].img = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${this.gardens[i].photos[0].photo_reference}&key=${googleKey}`;
        }
        var parking = JSON.parse(JSON.stringify(this.gardens));
        this.$store
          .dispatch({ type: "loadParks", gardens: parking })
          .then(() => {
            this.$store.dispatch({ type: "loadUserLoc" }).then(() => {
              this.$store
                .dispatch({ type: "loadParksLocFromUser" })
                .then(() => {
                  this.gardens = this.$store.getters.getParks;
                });
            });
          });
      });
    });
  },
  computed: {
    parkToShow() {
      if (this.gardens.length > 0) return this.gardens[this.indexRoll];
    }
  },
  methods: {
    plusDivs(diff) {
      if (this.indexRoll >= 0 && this.indexRoll < 4) {
        if (diff === 1 && this.indexRoll === 3) {
          this.indexRoll = 0;
          this.parkToShow;
        } else if (diff === -1 && this.indexRoll === 0) {
          this.indexRoll = 3;
          this.parkToShow;
        } else {
          this.indexRoll += diff;
          this.parkToShow;
        }
      }
    }
  }
};
</script>


<style>
</style>