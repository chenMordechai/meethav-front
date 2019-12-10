<template>
  <div>
    <section class="gallery">
      <div v-for="(img,idx) in user.gallery" :key="img._id" :class="'gallery_item'+ ++idx">
        <img :src="img" />
      </div>
    </section>
    <!-- This is Mobile -->
    <div class="mobile-gallery">
      <v-carousel>
        <v-carousel-item v-for="(img,idx) in user.gallery" :key="idx" :src="img"></v-carousel-item>
      </v-carousel>
    </div>
  </div>
  <!-- END MOBILE -->
</template>

<script>
export default {
  props: ["user"],
  data() {
    return {
      num: 0,
    };
  },
  methods: {},
  computed: {}
};
</script>
<style scoped>
img {
  width: 150px;
}

/* ------ */

/*GRID GALLERY START HERE*/
.gallery {
  display: none;
}

.mobile-gallery{
    display: none;
}

.gallery_item1 {
  grid-column: 1/2;
  grid-row: 1/2;
}

.gallery_item2 {
  grid-column: 2/3;
  grid-row: 1/2;
}

.gallery_item3 {
  grid-column: 1/3;
  grid-row: 2/3;
}

.gallery_item4 {
  grid-column: 1/2;
  grid-row: 3/5;
}

.gallery_item5 {
  grid-column: 2/3;
  grid-row: 3/4;
}

.gallery_item6 {
  grid-column: 2/3;
  grid-row: 4/5;
}

@media (max-width: 768px) {
    .mobile-gallery{
        display: block;
    }
}

@media (min-width: 768px) {
  .gallery {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(2, 150px);
    grid-gap: 15px;
  }

  .gallery_item1 {
    grid-column: 1/2;
    grid-row: 1/2;
  }

  .gallery_item2 {
    grid-column: 2/3;
    grid-row: 1/2;
  }

  .gallery_item3 {
    grid-column: 1/3;
    grid-row: 2/3;
  }

  .gallery_item4 {
    grid-column: 3/4;
    grid-row: 1/3;
  }

  .gallery_item5 {
    grid-column: 4/5;
    grid-row: 1/2;
  }

  .gallery_item6 {
    grid-column: 4/5;
    grid-row: 2/3;
  }
}

.gallery img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>