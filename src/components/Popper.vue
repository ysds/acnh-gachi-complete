<template>
  <Popper
    ref="popper"
    trigger="clickToToggle"
    :visible-arrow="false"
    append-to-body
    transition="fade"
    enter-active-class="fade-enter-active"
    leave-active-class="fade-leave-active"
    @show="onShow"
    @hide="onHide"
    :options="{
      modifiers: {
        preventOverflow: {
          boundariesElement: 'window'
        }
      }
    }"
  >
    <template slot="reference">
      <slot name="reference"></slot>
    </template>
    <slot></slot>
  </Popper>
</template>

<script>
import Popper from "vue-popperjs";

export default {
  components: {
    Popper
  },
  data() {
    return {
      showPopper: false
    };
  },
  created() {
    window.addEventListener("scroll", this.onScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.onScroll);
  },
  methods: {
    onScroll() {
      this.doClose();
    },
    onShow() {
      this.$store.commit("isShowDropdown", true);
    },
    onHide() {
      this.$store.commit("isShowDropdown", false);
    },
    doClose() {
      if (this.$refs.popper) this.$refs.popper.doClose();
    },
    isShowPopper() {
      return this.$refs.popper.showPopper;
    }
  }
};
</script>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s;
}
</style>
