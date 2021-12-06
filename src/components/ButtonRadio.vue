<template>
  <button
    type="button"
    class="btnradio"
    :class="{
      active: active,
    }"
    @click="onClick"
  >
    <div class="btnradio-indicator"></div>
    <div class="btnradio-text">
      <slot></slot>
    </div>
  </button>
</template>

<script>
export default {
  name: "ButtonRadio",
  props: {
    active: Boolean,
  },
  methods: {
    onClick: function () {
      this.$emit("click");
    },
  },
};
</script>

<style lang="scss" scoped>
.btnradio {
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.5rem;
  padding: 0;
  border: 0;
  background-color: transparent;
  color: var(--app-sub-text);
  text-align: left;
  font-size: 13px;
  font-weight: bold;

  &.active {
    .btnradio-indicator {
      border: 7px solid var(--app-active);
      background-color: transparent;
    }
  }
}

.btnradio-indicator {
  display: block;
  flex-shrink: 0;
  height: 24px;
  width: 24px;
  background-color: var(--app-btn-gray);
  border-radius: 20px;
  margin-right: 4px;
}

.btnradio-text {
  margin-top: 4px;
}
</style>
