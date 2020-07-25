<template>
  <div class="filters">
    <!-- <label class="filter">
      <input type="radio" class="filter-radio" value="0" v-model="sale" />
      <span class="filter-label">購入可</span>
    </label>
    <label class="filter">
      <input type="radio" class="filter-radio" value="1" v-model="sale" />
      <span class="filter-label">DIY</span>
    </label>
    <label class="filter">
      <input type="radio" class="filter-radio" value="2" v-model="sale" />
      <span class="filter-label">他非売品</span>
    </label>
    <div class="filter-divider" /> -->
    <label class="filter">
      <input type="radio" class="filter-radio" value="0" v-model="collected" />
      <span class="filter-label">すべて</span>
    </label>
    <label class="filter">
      <input type="radio" class="filter-radio" value="1" v-model="collected" />
      <span class="filter-label">所持</span>
    </label>
    <label class="filter">
      <input type="radio" class="filter-radio" value="2" v-model="collected" />
      <span class="filter-label">未所持</span>
    </label>
  </div>
</template>

<script>
export default {
  name: "FilterUI",
  props: {
    filter: Object
  },
  computed: {
    sale: {
      get() {
        return this.filter.sale || 0;
      },
      set(value) {
        this.$emit("change", Object.assign(this.filter, { sale: value }));
      }
    },
    collected: {
      get() {
        return this.filter.collected || 0;
      },
      set(value) {
        this.$emit("change", Object.assign(this.filter, { collected: value }));
      }
    }
  }
};
</script>

<style scoped lang="scss">
.filters {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.filter {
  margin-bottom: 0.125rem;
}

.filter-radio {
  position: absolute;
  clip: rect(0, 0, 0, 0);
  pointer-events: none;

  &:checked ~ .filter-label {
    background-color: #007bff;
    color: #fff;

    &:active {
      background-color: darken(#007bff, 10%);
    }
  }
}

.filter-label {
  padding: 2px 8px;
  margin-right: 0.25rem;
  border-radius: 100px;
  background-color: #eee;
  font-size: 14px;
  user-select: none;
  white-space: nowrap;

  &:active {
    background-color: darken(#eee, 10%);
  }
}

.filter-divider {
  margin-right: 0.5rem;
  margin-left: 0.25rem;
  height: 1rem;
  border-right: 1px solid #ccc;
}
</style>
