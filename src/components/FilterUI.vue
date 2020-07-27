<template>
  <div class="wrapper">
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
      <div class="fl-divider" />
      <label class="fl">
        <input type="radio" class="fl-radio" value="list" v-model="viewMode" />
        <span class="fl-label">リスト</span>
      </label>
      <label class="fl">
        <input type="radio" class="fl-radio" value="tile" v-model="viewMode" />
        <span class="fl-label">タイル</span>
      </label>
    </div>
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
    },
    viewMode: {
      get() {
        return this.filter.viewMode || null;
      },
      set(value) {
        this.$emit("change", Object.assign(this.filter, { viewMode: value }));
      }
    }
  }
};
</script>

<style scoped lang="scss">
.wrapper {
  display: flex;
  overflow: hidden;
}

.fls {
  display: flex;
  align-items: center;
  margin: 0 auto;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
}

.fl {
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

.fl-divider {
  margin-right: 0.5rem;
  margin-left: 0.25rem;
  height: 1rem;
  border-right: 1px solid #ccc;
}
</style>
