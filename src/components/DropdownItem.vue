<template>
  <button
    type="button"
    class="dropdown-item"
    :class="{ active: active, selectable: selectable }"
    @click="onClick"
    @touchstart="onTouchStart"
  >
    <template v-if="active">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        fill="currentColor"
        class="bi bi-check"
        viewBox="0 0 16 16"
      >
        <path
          d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"
        />
      </svg>
    </template>
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "DropdownItem",
  props: {
    active: Boolean,
    selectable: Boolean
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
<style scoped lang="scss">
.dropdown-item {
  position: relative;
  padding: 0.4rem 0.5rem;
  background-color: transparent;
  border: 0;
  border-radius: 8px;
  outline: 0;
  text-align: left;
  transition: background-color 0.15s;
  white-space: nowrap;

  &:active,
  &.pressed {
    background-color: #e3e3e3;
  }

  &.selectable {
    padding-left: 1.5rem;
  }
}

.bi-check {
  position: absolute;
  left: 2px;
  top: 9px;
}
</style>
