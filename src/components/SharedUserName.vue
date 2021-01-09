<template>
  <div>
    （<svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      class="bi bi-person-fill user-icon"
      viewBox="0 0 16 16"
    >
      <path
        d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
      />
    </svg>
    {{ sharedUserName ? sharedUserName : "匿名" }}さん
    <span v-if="sharedIslandName">
      <img
        src="@/assets/ProfileIconIsland.png"
        width="18"
        height="18"
        class="island-icon"
      />
      <!-- eslint-disable-next-line prettier/prettier-->
      {{ sharedIslandName }}島</span>）
  </div>
</template>

<script>
export default {
  props: {
    sharedUserName: String,
    sharedIslandName: String
  }
};
</script>

<style scoped lang="scss">
.user-icon {
  position: relative;
  top: -2px;
  left: 1px;
}

.island-icon {
  position: relative;
  top: -2px;
  margin-left: 2px;
}
</style>
