<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <div v-for="(variants, id, index) in items" :key="index">
      <div v-for="(item, index) in variants" :key="index">
        {{ item.name["name-JPja"] }}
        <img :src="item.image_uri" width="32" height="32">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      items: null
    };
  },
  mounted() {
    this.axios
      .get("https://acnhapi.com/v1/houseware/")
      .then(response => (this.items = response.data));
  }
};
</script>
