<template>
  <transition name="modal">
    <div class="modal-mask" v-show="show" @click="$emit('close')">
      <div class="modal-wrapper">
        <div class="modal-container" @click="e => e.stopPropagation()">
          <div class="modal-header">
            <h3>
              <slot name="header">
                No data
              </slot>
            </h3>
          </div>
          <div class="modal-body">
            <slot name="body">
              No data
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Modal",
  props: {
    show: Boolean
  }
};
</script>

<style lang="scss" scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 400px;
  margin: 0 20px;
}

.modal-container {
  flex-grow: 1;
  margin: 0 auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
  user-select: none;
  text-align: left;
}

.modal-header h3 {
  font-size: 1.25rem;
}

.modal-body /deep/ {
  margin: 20px 0;

  a {
    user-select: text;
  }
}

.modal-default-button {
  float: right;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  transform: scale(1.1);
}
</style>
