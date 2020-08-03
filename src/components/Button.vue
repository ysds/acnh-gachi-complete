<template>
  <button
    type="button"
    class="flat-btn"
    @click="onClick"
    @touchstart="onTouchStart"
    ref="button"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "Button",
  data() {
    return {
      date: null
    };
  },
  methods: {
    onClick: function() {
      this.$emit("click");
    },
    onTouchStart: function() {
      this.date = new Date();
      const date = this.date;
      this.$refs.button.classList.add("active");
      const self = this;
      setTimeout(function() {
        if (self.date <= date) {
          self.$refs.button.classList.remove("active");
        }
      }, 300);
    }
  }
};
</script>
