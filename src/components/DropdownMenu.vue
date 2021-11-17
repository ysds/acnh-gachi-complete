<template functional>
  <div class="wrapper">
    <div class="dropdown-menu" :class="{ fix: props.fixFirst }">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    fixFirst: Boolean,
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  position: absolute;
  left: 0;
  z-index: 1020;
}

.dropdown-menu {
  display: flex;
  flex-direction: column;
  max-width: calc(100vw - 10px);
  max-height: 50vh;
  margin-top: 3px;
  padding: 0.375rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  font-size: 14px;
  overflow-x: hidden;
  overflow-y: auto;
}

.fix {
  padding: 0 0.375rem 0.375rem;

  &::before {
    position: sticky;
    top: 0;
    z-index: 1;
    display: block;
    content: "";
    width: 100%;
    min-height: 0.375rem;
    background-color: #fff;
  }

  ::v-deep .dropdown-item:first-child {
    position: sticky;
    top: 0.375rem;
    z-index: 1;
    font-weight: 700;
    color: #007bff;
  }
}
</style>

<style lang="scss">
.fade-enter-active .dropdown-menu,
.fade-leave-active .dropdown-menu {
  transition: all 0.15s;
}
.fade-enter .dropdown-menu,
.fade-leave-to .dropdown-menu {
  opacity: 0;
  margin-top: -8px;
  transform: scale(0.95);
}
</style>
