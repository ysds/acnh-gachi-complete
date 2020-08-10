<template>
  <div class="wrapper">
    <template v-if="showSaleFilter">
      <dropdown-menu v-model="openSaleFilter" :interactive="true">
        <div class="btn-label">取得方法</div>
        <button class="dropdown-btn" :class="{ active: openSaleFilter }">
          <span class="tg" v-if="filter.saleFilter === '0'">すべて</span>
          <span class="tg" v-else-if="filter.saleFilter === '1'">お店</span>
          <span class="tg" v-else-if="filter.saleFilter === '2'">DIY</span>
          <span class="tg" v-else-if="filter.saleFilter === '3'">その他</span>
          <img src="../assets/arrow.svg" alt="" />
        </button>
        <div
          slot="dropdown"
          class="dropdown-menu"
          :class="{ hide: !openSaleFilter }"
        >
          <DropdownItem @click="onClickSaleFilter('0')">
            <span class="tg">すべて</span>
          </DropdownItem>
          <DropdownItem @click="onClickSaleFilter('1')">
            <span class="tg">お店</span>
          </DropdownItem>
          <DropdownItem @click="onClickSaleFilter('2')">
            <span class="tg">DIY</span>
          </DropdownItem>
          <DropdownItem @click="onClickSaleFilter('3')">
            <span class="tg">その他</span>
          </DropdownItem>
        </div>
      </dropdown-menu>
      <div class="divider" />
    </template>
    <dropdown-menu v-model="openCollectedFilter" :interactive="true">
      <div class="btn-label">チェック状態</div>
      <button class="dropdown-btn" :class="{ active: openCollectedFilter }">
        <span class="tg" v-if="filter.collectedFilter === '0'">すべて</span>
        <span class="tg tg-gr" v-else-if="filter.collectedFilter === '1'"
          >取得済</span
        >
        <span class="tg tg-bl" v-else-if="filter.collectedFilter === '2'"
          >配布可</span
        >
        <template v-else-if="filter.collectedFilter === '3'">
          <span class="tg tg-gr">取</span>＋<span class="tg tg-bl">配</span>
        </template>
        <span class="tg" v-else>未取得</span>
        <img src="../assets/arrow.svg" alt="" />
      </button>
      <div
        slot="dropdown"
        class="dropdown-menu"
        :class="{ hide: !openCollectedFilter }"
      >
        <DropdownItem @click="onClickCollectedFilter('0')">
          <span class="tg">すべて</span>
        </DropdownItem>
        <DropdownItem @click="onClickCollectedFilter('1')">
          <span class="tg tg-gr">取得済</span>
        </DropdownItem>
        <DropdownItem @click="onClickCollectedFilter('2')">
          <span class="tg tg-bl">配布可</span>
        </DropdownItem>
        <DropdownItem @click="onClickCollectedFilter('3')">
          <span class="tg tg-gr">取</span>＋<span class="tg tg-bl">配</span>
        </DropdownItem>
        <DropdownItem @click="onClickCollectedFilter('4')">
          <span class="tg">未取得</span>
        </DropdownItem>
      </div>
    </dropdown-menu>
  </div>
</template>

<script>
import DropdownMenu from "@innologica/vue-dropdown-menu";
import DropdownItem from "./DropdownItem";

export default {
  name: "FilterUI",
  components: {
    DropdownMenu,
    DropdownItem
  },
  props: {
    filter: Object,
    showSaleFilter: Boolean
  },
  data() {
    return {
      openSaleFilter: false,
      openCollectedFilter: false
    };
  },
  methods: {
    onClickSaleFilter: function(value) {
      this.openSaleFilter = false;
      this.$emit("change", Object.assign(this.filter, { saleFilter: value }));
    },
    onClickCollectedFilter: function(value) {
      this.openCollectedFilter = false;
      this.$emit(
        "change",
        Object.assign(this.filter, { collectedFilter: value })
      );
    }
  }
};
</script>

<style scoped lang="scss">
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  padding: 0 0 0.875rem;
}

.divider {
  margin-right: 0.5rem;
  margin-left: 0.25rem;
}

.dropdown {
  position: relative;
  font-size: 14px;
  margin-top: 6px;
}

.btn-label {
  position: absolute;
  top: -6px;
  left: 7px;
  z-index: 2;
  background-color: white;
  font-size: 10px;
  pointer-events: none;
  white-space: nowrap;
}

.dropdown-btn {
  display: inline-flex;
  align-items: center;
  min-width: 70px;
  padding: 0.5rem 0.35rem 0.2rem;
  background-color: transparent;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: 0;

  &.active {
    border-color: #42b983;

    img {
      transform: rotate(180deg);
    }
  }

  img {
    margin-top: -3px;
    margin-left: 4px;
  }
}

.dropdown-menu {
  position: absolute;
  margin-top: 3px;
  left: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);

  &.hide {
    display: none;
  }

  .tg {
    padding-right: 0.3rem;
  }
}

.tg {
  padding: 0.1rem 0 0.1rem 0.3rem;
  border-radius: 3px;
}

.tg-gr {
  padding-right: 0.3rem;
  background-color: #b6ecd4;
}

.tg-bl {
  padding-right: 0.3rem;
  background-color: #a0cbff;
}
</style>
