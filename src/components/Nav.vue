<template>
  <div class="wrapper">
    <nav class="nav">
      <button
        type="button"
        v-for="link in links"
        class="nav-item"
        :class="{ active: active === link.id }"
        :key="link.id"
        @click="changeNav(link.id)"
      >
        {{ link.text }}
      </button>
    </nav>
  </div>
</template>

<script>
export default {
  name: "Nav",
  props: {
    active: String,
  },
  data() {
    return {
      links: [
        {
          id: "housewares",
          text: "商店家具",
        },
        {
          id: "miscellaneous",
          text: "商店小物",
        },
        {
          id: "wallmounted",
          text: "商店壁掛け",
        },
        {
          id: "fishmodel",
          text: "魚模型",
        },
        {
          id: "bugmodel",
          text: "虫模型",
        },
        {
          id: "wedding",
          text: "ウェディング",
        },
        {
          id: "pascal",
          text: "ラコスケ",
        },
        {
          id: "saharah",
          text: "ローラン",
        },
      ],
    };
  },
  methods: {
    changeNav(id) {
      this.$emit("change", id);
    },
  },
};
</script>

<style scoped lang="scss">
.nav {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}
.nav-item {
  padding: 0 0.25rem;
  background-color: transparent;
  outline: none;
  font-weight: bold;
  border: 0;
  border-radius: 5px;

  + .nav-item {
    margin-left: 0.5rem;
  }
}

.active {
  background-color: #42b983;
  color: #fff;
}
</style>
