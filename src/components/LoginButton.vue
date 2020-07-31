<template>
  <button type="button" class="btn" @click="onClickButton">
    ログイン
  </button>
</template>

<script>
export default {
  name: "LoginButton",
  methods: {
    onClickButton: function() {
      this.$emit("click");
    }
  }
};
</script>

<style scoped lang="scss">
.btn {
  flex-shrink: 0;
  margin-left: auto;
  padding-right: 0.5rem;
  padding-left: 0.5rem;
  height: 64px;
  text-align: center;
  line-height: 64px;
  border: 0;
  background-color: #fff;
  font-weight: 700;
}
</style>
