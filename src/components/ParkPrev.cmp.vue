<template>
  <main v-if="park" v-touch:swipe="swipeHandler">
    <figure>
      <img @click="goParkDetails" aspect-ratio="1.75" :src="park.img" />
    </figure>
    <br />
    <div class="content-container">
      <a @click="goParkDetails">
        <h4 class="titlee">{{park.name}}</h4>
      </a>
      <section class="content">
        <button class="plus onlyCell" @click="plusDivs(-1)">&#10094;</button>
        <button class="minus onlyCell" @click="plusDivs(1)">&#10095;</button>
        <p class="subtitle padding">{{distance/100}} km from you</p>
        <br />
        <p class="subtitle">There are  dogs in park</p>
        <br />
        <p class="rate" v-if="park.rating" >
          <b-icon class="b-icon" icon="star"></b-icon>
          {{park.rating}} (1k+)
        </p>

      </section>
    </div>
  </main>
</template>

<script>
export default {
  props: {
    park: Object
  },
  data() {
    return {
      user: null,
      dogs: null,
      numOfStars: 3
    };
  },
  created() {
    this.numOfStars = this.park.rating;
   
  },

  methods: {
    goParkDetails() {
      this.$store.dispatch({ type: "goToPark", park: this.park }).then(() => {
        this.$router.push("/park-details");
      });
    },
    plusDivs(diff) {
      this.$emit("nextPark", diff);
    },
    swipeHandler(direction) {
      if (direction === "right") this.plusDivs(1);
      else if (direction === "left") this.plusDivs(-1);
    }
  },
  computed: {
    distance(){
      if(!this.park.distanceValueFromUser) return 
       var distance = this.park.distanceValueFromUser
       return distance.toString().substring(0, 3)
    },
    imgToLoad() {
      if (this.park.photos[1]) {
        return this.park.img;
      } else {
        return "http://eaawaj.com/wp-content/uploads/2018/06/4241508-park.jpg";
      }
    },
   
  }
};
</script>


<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css?family=Nunito+Sans");

$color: #44a3d9; // #2f559e;

.b-icon {
  color: gold;
}
.fullStar {
  visibility: hidden;
}

.goToPark {
  cursor: pointer;
}

.minus {
  position: relative;
  right: -194px;
  display: inline;
}

.plus {
  position: relative;
  left: -61px;
  display: inline;
}

.onlyCell {
  visibility: hidden;
  // display: none;
}

body {
  height: 100vh;

  background-color: #eceff1;
  font-family: "Nunito Sans", sans-serif;

  display: flex;
  align-items: center;
  justify-content: center;
}
.content-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  // height: 31%;
}
main {
  background: white;
  color: #263238;
  overflow: hidden;
  max-width: 300px;
  height: 326px;
  margin-bottom: 20px;
  box-shadow: 0 0.5px 0.5px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);

  figure {
    padding: 0;
    margin: 0;
    line-height: 0;
    img {
      image-rendering: crisp-edges;
      object-fit: cover;
      width: 100%;
      height: 198px;
    }
    img:hover {
      cursor: pointer;
    }
  }

  .titlee {
    color: #263238;
    // text-align: left;
    // font-weight: 600;
  }
  .content {
    a {
      text-decoration: none;
      color: $color;
      h2 {
        font-size: 1.75rem;
        display: inline;
        margin: 0;
        margin-left: -1px;
      }
      &:hover {
        color: darken($color, 10%);
      }
    }
    > p.subtitle {
      display: inline-block;
      font-size: 16px;
      color: #607d8b;
      margin: 0;
      margin-top: 0.3rem;
    }
    .rate {
      display: flex;
      align-items: center;
       font-size: 16px;
      color: #607d8b;
      margin: 0;
      margin-top: 0.25rem;
      justify-content: center
    }
    .padding{
      padding-right: 11px;
    }

    > p {
      line-height: 1.25rem;
      font-size: 0.95rem;
      text-align: left;
      margin: 0;
      margin-top: 1.25rem;
    }
  }
  footer {
    background: rgba($color, 0.1);
    a {
      display: flex;
      border-top: 1px solid rgba(grey, 0.1);
      font-size: 0.9rem;
      padding: 1rem 1.5rem;
      text-decoration: none;
      font-weight: 400;
      color: $color;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      flex-direction: row;
      align-items: center;
      &:hover {
        color: darken($color, 10%);
        background: rgba($color, 0.2);
      }
      &::after {
        content: " → ";
        margin-left: auto;
        transition: 0.3s;
        font-size: 1.25rem;
      }
    }
  }
}
@media only screen and (max-width: 550px) {
  .onlyDesk {
    display: none;
  }

  .onlyCell {
    visibility: visible;
    // display: block;
  }
}
</style>

