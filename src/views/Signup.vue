<template>
  <div class="page-wrapper bg-red p-t-180 p-b-100 font-robo">
    <div class="wrapper wrapper--w960">
      <div class="card card-2">
        <div class="card-heading"></div>
        <div class="card-body">
          <h2 class="title">Registration</h2>

          <v-form @submit.prevent="saveUser" id="signup-form">
            <v-text-field v-model="user.userName" :rules="nameRules" label="UserName" required></v-text-field>
            <v-text-field
              v-model="user.password"
              name="input-10-2"
              label="Password"
              type="password"
              class="input-group--focused"
            ></v-text-field>
            <v-btn color="dark" type="submit" form="signup-form">Register</v-btn>
          </v-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
    owner : {
        fullName : "",
        age: 27.0,
        gender : "female"
    },
    preference : {
        name : "puki",
        age : 10.0,
        type : "doberman pinscher",
        gender : "male",
        hobbies : [ 
            "travel,play"
        ],
        favFood : "Bonzo"
    },
    userName : "",
    password : "",
    isAdmin : false,
    friends : [ ],
    gotFriendsReq : [],
    sentFriendsReq : [],
    address : "Israel, TelAviv",
    location : {
        lat : 32.07956,
        lng : 34.7985392
    },
    notifications : [],
    profileImg :"",
    backImg : "https://cdn.pixabay.com/photo/2018/01/05/02/50/lonely-3062045_960_720.jpg",
    gallery : [],
    gotLikes : [],
    sentLikes : []
},
      valid: false,
      nameRules: [
        v => !!v || "Name is required",
        v => v.length <= 10 || "Name must be less than 10 characters"
      ],
      email: ""
    };
  },
  methods: {
    async saveUser() {
      let userCopy =JSON.parse(JSON.stringify(this.user))
      try {
        const signupUser = await this.$store.dispatch({type: "userSignup", user:userCopy});
        this.$toast.open({message: "Register Successfully!",type: "is-success", duration: 2000});
        this.$router.push('/')
        return signupUser;
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>

<style scoped>
@import "../../public/css/main.css";
</style>

