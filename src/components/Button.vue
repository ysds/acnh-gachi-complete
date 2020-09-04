<template>
  <button
    type="button"
    class="flat-btn"
    :class="{ active: active }"
    @click="onClick"
    @touchstart="onTouchStart"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "Button",
  props: {
    active: Boolean
  },
  methods: {
    onClick: function() {
      this.$emit("click");
    },
    onTouchStart: function(event) {
      const button = event.currentTarget;
      button.classList.add("pressed");
      setTimeout(function() {
        button.classList.remove("pressed");
      }, 300);
    }
  }
};
</script>
