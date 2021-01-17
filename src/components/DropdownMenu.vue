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
  margin-top: 3px;
  display: flex;
  flex-direction: column;
  padding: 0.375rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  font-size: 14px;
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
