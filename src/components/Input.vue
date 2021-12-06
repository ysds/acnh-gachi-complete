<template>
  <input
    type="text"
    :value="value"
    v-on="inputListeners"
    v-bind="$attrs"
    ref="input"
  />
</template>

<script>
export default {
  inheritAttrs: false,
  props: ["value"],
  computed: {
    inputListeners: function () {
      var vm = this;
      return Object.assign({}, this.$listeners, {
        input: function (event) {
          vm.$emit("input", event.target.value);
        },
      });
    },
  },
  methods: {
    focus() {
      this.$refs.input.focus();
    },
  },
};
</script>

<style lang="scss" scoped>
input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--app-border);
  border-radius: 8px;
  appearance: none;
  background-color: var(--app-body-bg);
  color: var(--app-color);
}
</style>
