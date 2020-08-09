<template>
  <button
    type="button"
    class="dropdown-item"
    @click="onClick"
    @touchstart="onTouchStart"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "DropdownItem",
  methods: {
    onClick: function() {
      this.$emit("click");
    },
    onTouchStart: function(event) {
      const button = event.currentTarget;
      button.classList.add("active");
      setTimeout(function() {
        button.classList.remove("active");
      }, 300);
    }
  }
};
</script>
<style scoped lang="scss">
.dropdown-item {
  padding: 0.5rem;
  background-color: transparent;
  border: 0;
  outline: 0;
  text-align: left;
  transition: background-color 0.15s;
  white-space: nowrap;

  &.active {
    background-color: #e3e3e3;
  }
}
</style>
