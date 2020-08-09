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
    <dropdown-menu v-model="showCollectedFilter" :interactive="true">
      <button class="dropdown-btn" :class="{ active: showCollectedFilter }">
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
        :class="{ hide: !showCollectedFilter }"
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
      showCollectedFilter: false
    };
  },
  computed: {
    saleFilter: {
      get() {
        return this.filter.saleFilter || null;
      },
      set(value) {
        this.$emit("change", Object.assign(this.filter, { saleFilter: value }));
      }
    }
  },
  methods: {
    onClickCollectedFilter: function(value) {
      this.showCollectedFilter = false;
      this.$emit(
        "change",
        Object.assign(this.filter, { collectedFilter: value })
      );
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

.dropdown {
  position: relative;
  font-size: 14px;
}

.dropdown-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.5rem;
  background-color: transparent;
  border: 0;
  border-radius: 4px;
  outline: 0;

  &.active {
    background-color: #e3e3e3;

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
