<template>
  <section class="parkDetails">
    <!-- <img class="parkImg" :src="park.img" alt /> -->
    <user-list-map v-if="park" :currPark="park" class="map"></user-list-map>
    <user-li-list v-if="park" :currPark="park" class="list"></user-li-list>
  </section>
</template>

<script>
import UserListMap from "../components/UsersListMap.cmp";
import userLiList from "../components/UserLiList.cmp";

export default {
  name: "parkDetails",
  components: { UserListMap, userLiList },

  created() {
    this.park = this.$store.getters.getCurrPark;
  },
  data() {
    return {
      park: null
    };
  }
};
</script>
<style scoped>
.parkDetails {
  width: 100vw;
  height: 90vh;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.parkImg {
  max-height: 18rem;
  width: 30rem;
  align-self: center;
}

.map {
  flex-grow: 1;
  height: 90vh;
  position: static;
}

/* .map div { 
    width: 0; 
    height: 0;
} */

.list {
  flex-grow: 1;
  height: 90vh;
  max-width: 50vw;
}

@media only screen and (max-width: 700px) {
  .parkDetails {
    flex-direction: column;
  }

  .list {
    padding-left: 0;
    min-width: 100vw;
  }
  .parkDetails {
    height: 100vh;
  }
}
</style>