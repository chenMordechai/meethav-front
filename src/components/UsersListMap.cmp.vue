<template>
  <div id="mapTo">
    <GmapMap
      v-if="dogs && userLoc"
      ref="mapRef"
      :center="{lat:currPark.geometry.location.lat, lng:currPark.geometry.location.lng}"
      :zoom="zoomIn"
      map-type-id="terrain"
    >
      <gmap-info-window
        :options="infoOptions"
        :position="infoWindowPos"
        :opened="infoWinOpen"
        @closeclick="infoWinOpen=false"
      ></gmap-info-window>
      <GmapMarker
        v-for="(m, index) in dogsToShowNotFriends"
        :key="m._id"
        :position="m.position"
        :clickable="true"
        :draggable="true"
        :icon="usersIcons"
        @click="setCenter(m.position,15,$event) & toggleInfoWindow(m, index)"
      />

       <GmapMarker
        v-for="(m, index) in dogsToShowFriends"
        :key="index"
        :position="m.position"
        :clickable="true"
        :draggable="true"
        :icon="friendsIcon"
        @click="setCenter(m.position,15,$event) & toggleInfoWindow(m, index)"
      />

      <GmapMarker
        userLocation
        :position="userLoc.position"
        :clickable="true"
        :draggable="true"
        :icon="myIcon"
        @click="setCenter(userLoc.position,15,$event) & toggleInfoWindow(userLoc, 0)"
      />

      <GmapMarker
        userLocation
        :position="currPark.geometry.location"
        :clickable="true"
        :draggable="true"
        @click="setCenter(currPark.geometry.location,15,$event) & toggleInfoWindow(currPark.geometry, 0)"
      />
    </GmapMap>
  </div>
</template>



<script>
import dogsService from "../services/dogs.service";
import userLiList from "../components/UserLiList.cmp";
export default {
  name: "usersMap",
  data() {
    return {
      userLoc: null,
      currUser: null,
      dogs: null,
      langs: ["he", "en"],
      times: [1552552892953, 1552552891953, 1552522892953],
      zoomIn: 18,
      posIsrael: { lat: 32.088007, lng: 34.8031678 },
      infoWindowPos: null,
      infoWinOpen: false,
      currentMidx: null,
      notFriends: [],
      friends: [],

      infoOptions: {
        content: "",
        //optional: offset infowindow so it visually sits nicely on top of our marker
        pixelOffset: {
          width: 0,
          height: -35
        }
      }
    };
  },
  props: ["currPark"],

  computed: {
    dogsToShowNotFriends() {
      var marker = [];
      for (var i = 0; i < this.notFriends.length; i++) {
        marker.push({
          position: {
            lat: this.notFriends[i].location.lat,
            lng: this.notFriends[i].location.lng
          },
          infoText: `<p>${this.notFriends[i].owner.fullName}</p>`
        });
      }
      return marker;
    },
    dogsToShowFriends() {
      if(this.currUser ===null) return;
      var marker = [];
      for (var i = 0; i < this.friends.length; i++) {
        marker.push({
          position: {
            lat: this.friends[i].location.lat,
            lng: this.friends[i].location.lng
          },
          infoText: `<p>${this.friends[i].owner.fullName}</p>`
        });
      }
      return marker;
    },
    userLocation() {
      return this.userLoc;
    },
    usersIcons() {
      return "https://img.icons8.com/carbon-copy/40/000000/dog.png";
     
    },
    myIcon() {
      return "https://img.icons8.com/ultraviolet/40/000000/dog.png";
    },
    friendsIcon() {
      return " https://img.icons8.com/color/40/000000/dog.png";
    }
  },
  methods: {
    setCenter(pos, zoom = 15, event) {
      this.$refs.mapRef.$mapPromise.then(map => {
        map.panTo(pos);
        this.zoomIn = zoom;
      });
    },
    toggleInfoWindow(marker, idx) {
      if (!marker.position) marker.position = marker.location;
      this.infoWindowPos = marker.position;
      if (!marker.infoText) marker.infoText = this.currPark.name;
      this.infoOptions.content = marker.infoText;
3
      //check if its the same marker that was selected if yes toggle
      if (this.currentMidx == idx) {
        this.infoWinOpen = !this.infoWinOpen;
      }
      //if different marker set infowindow to open and reset current marker index
      else {
        this.infoWinOpen = true;
        this.currentMidx = idx;
      }
    }
  },
  components: {},
  created() {
    this.$store.dispatch({ type: "loadDogs" }).then(() => {
      this.$store.dispatch({ type: "loggedInUser" }).then(() => {
        this.dogs = this.$store.getters.dogsToShow;
        this.currUser = this.$store.getters.getLoggedinUser;
        if(this.currUser === null) { 
          this.currUser = {friends:[]};
        }
        if (this.currUser.friends.length > 0) {
          for (var i = 0; i < this.currUser.friends.length; i++) {
            for (var j = 0; j < this.dogs.length; j++) {
              if (this.currUser.friends[i].userId === this.dogs[j]._id)
                this.friends.push(this.dogs[j]);
              else this.notFriends.push(this.dogs[j]);
            }
          }
        } else
        this.notFriends = this.dogs.map(dog=> { 
          return dog
        })
        dogsService.getPosition().then(pos => {
          if (this.currUser !== null)
            var toShow = `<p style="margin:0 auto">${this.currUser.owner.fullName}</p>`;
          else var toShow = `<p>Guest</p>`;
          console.log(this.userLoc)
          this.userLoc = {
            position: {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude
            },
            infoText: toShow
          };
        });
      });
    });
  }
};
</script>

<style scoped>
/* p{
  color: red;

} */
.mapTo {
  max-width: 500px !important;
}
.vue-map-container {
  height: 90vh;
}
</style>
