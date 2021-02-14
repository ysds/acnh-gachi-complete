<template>
  <transition name="modal">
    <div class="modal" v-show="show" @click="$emit('close')" ref="modal">
      <div class="modal-mask" />
      <div class="modal-wrapper">
        <div class="modal-container" @click="e => e.stopPropagation()">
          <div class="modal-header">
            <h3>
              <slot name="header">
                No data
              </slot>
            </h3>
            <CloseButton
              v-if="closeButton"
              @click="$emit('close')"
              class="close"
            />
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
import CloseButton from "./CloseButton";

export default {
  components: {
    CloseButton
  },
  props: {
    show: Boolean,
    closeButton: Boolean
  },
  watch: {
    show(newValue) {
      if (newValue) {
        this.$nextTick(function() {
          this.$refs.modal.scrollTop = 0;
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: opacity 0.3s ease;
  overflow-x: hidden;
  overflow-y: auto;
}

.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  margin: 15px;
  min-height: calc(100% - 30px);
  width: auto;
  max-width: 400px;

  @media (min-width: 460px) {
    margin: 15px auto;
  }
}

.modal-container {
  flex-grow: 1;
  padding: 20px 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
  user-select: none;
  text-align: left;

  @media (min-width: 321px) {
    padding-right: 24px;
    padding-left: 24px;
  }
}

.modal-header {
  display: flex;
  align-items: flex-start;
}

.modal-header h3 {
  font-size: 1.25rem;
}

.close {
  margin-left: auto;
  margin-top: -0.5rem;
  margin-right: -0.5rem;

  @media (min-width: 321px) {
    margin-right: -1rem;
  }
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
