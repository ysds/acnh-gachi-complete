<template>
  <div class="fls">
    <template v-if="showSaleFilter">
      <label class="fl">
        <input type="radio" class="fl-radio" value="0" v-model="sale" />
        <span class="fl-label">商店</span>
      </label>
      <label class="fl">
        <input type="radio" class="fl-radio" value="1" v-model="sale" />
        <span class="fl-label">DIY</span>
      </label>
      <label class="fl">
        <input type="radio" class="fl-radio" value="2" v-model="sale" />
        <span class="fl-label">その他</span>
      </label>
      <div class="fl-divider" />
    </template>
    <label class="fl">
      <input type="radio" class="fl-radio" value="0" v-model="collected" />
      <span class="fl-label">すべて</span>
    </label>
    <label class="fl">
      <input type="radio" class="fl-radio" value="1" v-model="collected" />
      <span class="fl-label">所持</span>
    </label>
    <label class="fl">
      <input type="radio" class="fl-radio" value="2" v-model="collected" />
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
    sale: {
      get() {
        return this.filter.sale || null;
      },
      set(value) {
        this.$emit("change", Object.assign(this.filter, { sale: value }));
      }
    },
    collected: {
      get() {
        return this.filter.collected || null;
      },
      set(value) {
        this.$emit("change", Object.assign(this.filter, { collected: value }));
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
  padding: 0.25rem 0 1rem;
}

.fl {
  margin-bottom: 0;
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
