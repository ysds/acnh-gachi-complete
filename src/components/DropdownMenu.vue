<template functional>
  <div class="wrapper">
    <div class="dropdown-menu">
      <slot></slot>
    </div>
  </div>
</template>

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
  max-height: 73vh;
  margin-top: 3px;
  padding: 0.375rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  font-size: 14px;
  overflow-x: hidden;
  overflow-y: auto;
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
