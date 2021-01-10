<template>
  <div class="wrapper">
    <div class="item">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-person-fill icon"
        viewBox="0 0 16 16"
      >
        <path
          d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
        />
      </svg>
      {{ sharedUserName ? sharedUserName : "匿名" }}さん
    </div>
    <div v-if="sharedIslandName" class="item">
      <img
        src="@/assets/ProfileIconIsland.png"
        width="16"
        height="16"
        class="icon"
      />
      <!-- eslint-disable-next-line prettier/prettier-->
      {{ sharedIslandName }}島
    </div>
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
.wrapper {
  display: flex;
  flex-wrap: wrap;
  font-size: 15px;
  font-weight: 700;
  color: #555;
  padding: 0.1rem 0.5rem;
}

.item {
  margin-right: 1rem;
}

.icon {
  position: relative;
  top: -2px;
}
</style>
