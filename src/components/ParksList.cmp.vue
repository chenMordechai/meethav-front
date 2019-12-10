<template>
  <section class="parksList" v-if="gardens">
    <v-layout row wrap style="justify-content: space-between; padding:25px;">
      <div class="onlyDesk" v-for="nearestGarden in gardens" :key="nearestGarden.id">
        <parkPrev style="margin-bottom: 20px;" v-if="nearestGarden" :park="nearestGarden"></parkPrev>
      </div>

      <div class="onlyCell prev-container" >
        <parkPrev v-if="park" @nextPark="plusDivs" :park="park"></parkPrev>
      </div>
    </v-layout>
  </section>
</template>

<script>
import parkPrev from "../components/ParkPrev.cmp.vue";

export default {
  props: ["park", "gardens"],
  name: "parksList",
  data() {
    return {};
  },
  components: {
    parkPrev
  },
  methods: {
    plusDivs(diff) {
      this.$emit("nextPark", diff);
    }
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

