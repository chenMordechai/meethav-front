
<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <img
        class="logo"
        @click="goHome"
        src="https://i.imgur.com/d7kCfoE.png"
        width="170"
      />
      <!-- https://i.ibb.co/n8DtFs5/logo.png -->
      <a
        v-on:click="toggleNav"
        role="button"
        class="navbar-burger burger"
        v-bind:class="{ 'is-active': isActive}"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasicExample"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div id="navbarBasicExample" class="navbar-menu" v-bind:class="{ 'is-active': isActive}">
      <div class="navbar-start">
      </div>
      <div class="navbar-end">
      <div v-if="getUser === null">
        <div class="navbar-item">
          <div class="buttons" style="justify-content: center;">
        <router-link @click.native="toggleNav" class="navbar-item home" to="/">Home</router-link>
        <router-link @click.native="toggleNav" class="navbar-item" to="/user">Dogs around</router-link>
            <router-link  @click.native="toggleNav"  class="navbar-item " to="/signup">Sign Up</router-link>
            <button class="navbar-item login" v-on:click="toggleNav" @click="cardModal()" >Log In</button>
          </div>
        </div>
      </div>
      <div v-if="getUser !== null" class="navbar-menu" v-bind:class="{ 'is-active': isActive}">
        <router-link @click.native="toggleNav" class="navbar-item home" to="/">Home</router-link>
        <router-link  @click.native="toggleNav" class="navbar-item" to="/user">Dogs around</router-link>
            <p class="navbar-item"><b> {{getUser.owner.fullName}}</b></p>
          <b-dropdown position="is-bottom-left" aria-role="menu">
            <a class="navbar-item" slot="trigger" role="button">
              <v-badge left>
                <template v-slot:badge>
                  <span v-if="getNotfications">{{getNotfications.length}} </span>
                </template>
              </v-badge>
              <span> Menu</span>
              <b-icon icon="menu-down"></b-icon>
            </a>
            <!-- <b-dropdown-item  aria-role="menuitem">
              <b-icon icon="bell"></b-icon><router-link :to="getLink" name="notfication">Notification's</router-link> <span v-if="getNotfications">({{getNotfications.length}}) </span> -->
            <b-dropdown-item @click.native="toggleNav" @click="goToMyNotfication" aria-role="menuitem">
              <b-icon icon="bell"></b-icon>Notification's <span v-if="getNotfications">({{getNotfications.length}}) </span>
            </b-dropdown-item>
            <b-dropdown-item  @click.native="toggleNav" @click="goToMyProfile" value="settings">
              <b-icon icon="settings"></b-icon>Profile
            </b-dropdown-item>
            <hr class="dropdown-divider" aria-role="menuitem" />
            <b-dropdown-item value="logout"  @click.native="toggleNav" @click="userLogout" aria-role="menuitem">
              <b-icon  icon="logout"></b-icon>Logout
            </b-dropdown-item>
          </b-dropdown>
          </div>
        </div>
        </div>
  </nav>
</template>

<script>
import Login from "./Login";
import eventBus from "../eventBus.js"

export default {
  data() {
    return {
      isActive: false,
      user: {
        name: "",
        pass: ""
      }
    };
  },
  methods: {
    toggleNav() {
      this.isActive = !this.isActive;
    },
    goHome() {
      this.$router.push("/");
    },
    goToMyNotfication() {
      this.$store.dispatch({ type: "loadCompInProfile", comp: "Notfication" });
      this.$router.push(`/user/${this.getUser._id}/#notfication`);
    },
    goToMyProfile() {
      this.$store.dispatch({ type: "loadCompInProfile", comp: "Gallery" });

      this.$router.push(`/user/${this.getUser._id}`);
    },
    cardModal() {
      this.$modal.open({
        parent: this,
        component: Login,
        hasModalCard: true,
        customClass: "custom-class custom-class-2"
      });
    },
    userLogout() {
      this.$store.dispatch({ type: "userLogout" }).then(() => {
        eventBus.$emit('userLoggedOut')
        this.$toast.open({
          message: "You have logout",
          type: "is-danger",
          duration: 2000
        });
      });
    }
  },
  computed: {
    getUser() {
      return this.$store.getters.getcurrLoggedinUser;
    },
    getNotfications() {
      return this.$store.getters.getNotfications;
    },
    getLink(){
      return `/user/${this.getUser._id}`
    }
  }
};
</script>


<style scoped >
 a.home{
  color: #5ec8aa
}
.navbar-end a.navbar-item:hover{
color: #5ec8aa;
background-color: white;
}
.navbar-end a.navbar-item:focus-within{
color:#4a4a4a;
background-color: white;
}
.navbar-end a.home:focus-within{
color:#5ec8aa;
background-color: white;
}
p.navbar-item{
  padding:0;
  margin: 0;
}
b{
  padding-left: 10.5px;
  padding-right: 30px;
}
.navbar{
  height: 50px;
  padding: 0 10px;
}
.login{
border: 1px solid rgb(48, 47, 47);
border-radius: 3px;
padding: 4px 6px;
margin-left: 10.5px;
}
.login:hover{
  background-color: #5ec8aa;
  color: #FFF;
}
.logo img{
  height: 70px;
}
.logo:hover {
  cursor: pointer;
}
.buttons{
  justify-content: center;
  align-items: baseline;
}
 @media screen and (max-width: 1024px){
b{
  padding:0
 }
 }
 </style>