<template>
  <section class="edit-user" v-if="copyDog">
    <v-form @submit.prevent="updateDog">
      <v-text-field v-model="copyDog.owner.fullName" name="name" label="Full name" type="text"></v-text-field>
      <v-text-field v-model="copyDog.preference.name" name="name" label="Dog Name" type="text"></v-text-field>
      <v-text-field v-model="copyDog.preference.type" name="name" label="Dog Type" type="text"></v-text-field>
      <v-text-field v-model="copyDog.address" name="name" label="Address" type="text"></v-text-field>
      <v-text-field v-model="copyDog.profileImg" name="name" label="Profile Img" type="text"></v-text-field>
      <div class="field">
        <b-checkbox v-model="copyDog.isAdmin">Is Admin?</b-checkbox>
      </div>
      <v-btn v-on:click.native="updateDog" color="primary">save</v-btn>
    </v-form>
  </section>
</template>

<script>
export default {
  data() {
    return {
      copyDog: null
    };
  },
  created() {
    this.$store
      .dispatch({
        type: "loadDogById",
        dogId: this.$route.params.id
      })
      .then(() => {
        this.copyDog = JSON.parse(JSON.stringify(this.$store.getters.getDog));
      });
  },
  methods: {
    updateDog(updatedDog) {
      this.$store
        .dispatch({
          type: "updateDog",
          dog: this.copyDog
        })
        .then(() => {
          this.$router.push("/user");
        });
    }
  }
};
</script>

<style>
.edit-user {
  border: 1px solid black;
  border-radius: 10px;
  margin: 20px;
  width: 450px;
  margin: 0 auto;
  margin-top: 100px;
  padding: 20px;
}
</style>