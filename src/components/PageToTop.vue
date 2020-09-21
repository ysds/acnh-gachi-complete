<template>
  <div class="p2t" @click="pageToTop">
    トップに戻る
  </div>
</template>

<script>
export default {
  name: "PageToTop",
  methods: {
    pageToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.p2t {
  position: fixed;
  top: 20px;
  left: 50%;
  z-index: 1000;
  visibility: hidden;
  opacity: 0;
  padding: 0.5rem 1rem;
  background-color: #333;
  color: #fff;
  font-size: 14px;
  border-radius: 999px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  transform: translateX(-50%);
  transition: all 0.3s;
}
</style>

<style lang="scss">
.scrolled .p2t {
  visibility: visible;
  opacity: 1;
}
</style>
