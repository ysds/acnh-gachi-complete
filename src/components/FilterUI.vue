<template>
  <div class="filter">
    <label class="filter-check">
      <input
        type="checkbox"
        class="filter-check-input"
        :checked="filter.hiddenCollected"
        @change="onChangeHiddenCollected"
      />
      <span class="filter-check-label">チェック済みを非表示</span>
    </label>
  </div>
</template>

<script>
export default {
  name: "FilterUI",
  props: {
    filter: Object,
  },
  data() {
    return {};
  },
  methods: {
    onChangeHiddenCollected: function(event) {
      this.$emit(
        "change",
        Object.assign(this.filter, { hiddenCollected: event.target.checked })
      );
    },
  },
};
</script>

<style scoped lang="scss">
.filter {
  display: flex;
  justify-content: center;
}

.filter-check {
  margin-bottom: 0.125rem;
}

.filter-check-input {
  position: absolute;
  clip: rect(0, 0, 0, 0);
  pointer-events: none;

  &:checked ~ .filter-check-label {
    background-color: #007bff;
    color: #fff;

    &:active {
      background-color: darken(#007bff, 10%);
    }
  }
}

.filter-check-label {
  padding: 2px 4px;
  margin-right: 0.25rem;
  border-radius: 5px;
  background-color: #eee;
  font-size: 14px;
  user-select: none;

  &:active {
    background-color: darken(#eee, 10%);
  }
}
</style>
