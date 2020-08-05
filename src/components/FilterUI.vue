<template>
  <div class="fls">
    <template v-if="showSaleFilter">
      <label class="fl">
        <input type="radio" class="fl-radio" value="0" v-model="saleFilter" />
        <span class="fl-label">お店</span>
      </label>
      <label class="fl">
        <input type="radio" class="fl-radio" value="1" v-model="saleFilter" />
        <span class="fl-label">DIY</span>
      </label>
      <label class="fl">
        <input type="radio" class="fl-radio" value="2" v-model="saleFilter" />
        <span class="fl-label">その他</span>
      </label>
      <div class="fl-divider" />
    </template>
    <label class="fl">
      <input
        type="radio"
        class="fl-radio"
        value="0"
        v-model="collectedFilter"
      />
      <span class="fl-label">すべて</span>
    </label>
    <label class="fl">
      <input
        type="radio"
        class="fl-radio"
        value="1"
        v-model="collectedFilter"
      />
      <span class="fl-label">所持</span>
    </label>
    <label class="fl">
      <input
        type="radio"
        class="fl-radio"
        value="2"
        v-model="collectedFilter"
      />
      <span class="fl-label">未所持</span>
    </label>
  </div>
</template>

<script>
export default {
  name: "FilterUI",
  props: {
    filter: Object,
    showSaleFilter: Boolean
  },
  computed: {
    saleFilter: {
      get() {
        return this.filter.saleFilter || null;
      },
      set(value) {
        this.$emit("change", Object.assign(this.filter, { saleFilter: value }));
      }
    },
    collectedFilter: {
      get() {
        return this.filter.collectedFilter || null;
      },
      set(value) {
        this.$emit(
          "change",
          Object.assign(this.filter, { collectedFilter: value })
        );
      }
    }
  }
};
</script>

<style scoped lang="scss">
.fls {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  padding: 0 0 0.875rem;
}

.fl {
  margin-top: 0.125rem;
  margin-bottom: 0.125rem;
}

.fl-radio {
  position: absolute;
  clip: rect(0, 0, 0, 0);
  pointer-events: none;
  left: 0;

  &:checked ~ .fl-label {
    background-color: #007bff;
    color: #fff;

    &:active {
      background-color: darken(#007bff, 10%);
    }
  }
}

.fl-label {
  display: inline-block;
  padding: 5px 10px 4px;
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

.fl-divider {
  margin-right: 0.5rem;
  margin-left: 0.25rem;
  height: 1rem;
  border-right: 1px solid #ccc;
}
</style>
