<template>
  <div class="filter">
    <label class="filter-check">
      <input type="radio" class="filter-check-input" v-model="collected" />
      <span class="filter-check-label">すべて</span>
    </label>
    <label class="filter-check">
      <input type="radio" class="filter-check-input" v-model="collected" />
      <span class="filter-check-label">所持</span>
    </label>
    <label class="filter-check">
      <input type="radio" class="filter-check-input" v-model="collected" />
      <span class="filter-check-label">未所持</span>
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
    return {
      sale: this.filter.sale || 0,
    };
  },
  computed: {
    collected: {
      get() {
        return this.filter.collected || 0;
      },
      set(value) {
        this.$emit(
          "change",
          Object.assign(this.collected, { collected: value })
        );
      },
    },
  },
};
</script>

<style scoped lang="scss">
.filter {
  display: flex;
  justify-content: center;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
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
