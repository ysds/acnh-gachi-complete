<template>
  <div class="wrapper">
    <div v-show="showSaleFilter">
      <popper trigger="clickToToggle" :visible-arrow="false" ref="saleFilter">
        <div slot="reference" style="position: relative;">
          <div class="btn-label">取得方法</div>
          <button
            type="button"
            class="dropdown-btn"
            :class="{ active: isOpenSaleFilter() }"
          >
            <span v-if="filter.saleFilter === 'all'">すべて</span>
            <span v-else-if="filter.saleFilter === 'catalog'"
              >お店＆<IconCatalog
            /></span>
            <span v-else-if="filter.saleFilter === 'diy'">DIY</span>
            <span v-else-if="filter.saleFilter === 'other'">その他</span>
            <span v-else-if="filter.saleFilter === 'able'">エイブル</span>
            <span v-else-if="filter.saleFilter === 'kicks'">シャンク</span>
            <span v-else-if="filter.saleFilter === 'labelle'">ことの</span>
            <span v-else-if="filter.saleFilter === 'daly'">日替わり</span>
            <span v-else-if="filter.saleFilter === 'recycle'">リサイクル</span>
            <img src="../assets/arrow.svg" width="12" alt="" />
          </button>
        </div>
        <div class="dropdown-menu">
          <DropdownItem @click="onClickSaleFilter('all')">
            <span class="tg">すべて</span>
          </DropdownItem>
          <DropdownItem @click="onClickSaleFilter('catalog')" v-if="!isFashion">
            <span class="tg">お店＆<IconCatalog /></span>
          </DropdownItem>
          <template v-if="isFashion">
            <DropdownItem @click="onClickSaleFilter('able')">
              <span class="tg">エイブル</span>
            </DropdownItem>
            <DropdownItem @click="onClickSaleFilter('kicks')">
              <span class="tg">シャンク</span>
            </DropdownItem>
            <DropdownItem @click="onClickSaleFilter('labelle')">
              <span class="tg">ことの</span>
            </DropdownItem>
            <DropdownItem @click="onClickSaleFilter('daly')">
              <span class="tg">日替わり</span>
            </DropdownItem>
            <DropdownItem @click="onClickSaleFilter('recycle')">
              <span class="tg">リサイクル</span>
            </DropdownItem>
          </template>
          <DropdownItem @click="onClickSaleFilter('diy')">
            <span class="tg">DIY</span>
          </DropdownItem>
          <DropdownItem @click="onClickSaleFilter('other')">
            <span class="tg">その他</span>
          </DropdownItem>
        </div>
      </popper>
    </div>
    <div v-if="isShowOrderChanger">
      <Button
        v-if="filter.order === 'name'"
        @click="onClickOrderMenuItem('id')"
        class="btn-small"
      >
        名前順
      </Button>
      <Button
        v-else-if="filter.order === 'id'"
        @click="onClickOrderMenuItem('name')"
        class="btn-small"
      >
        実機順
      </Button>
    </div>
    <div class="buttons">
      <Button
        @click="onClickCollectedFilter('0')"
        class="nav"
        :class="{ active: filter.collectedFilter === '0' }"
      >
        <span class="tg">すべて</span>
      </Button>
      <Button
        @click="onClickCollectedFilter('1')"
        class="nav"
        :class="{ active: filter.collectedFilter === '1' }"
      >
        <span class="tg tg-gr">取得済</span>
      </Button>
      <Button
        @click="onClickCollectedFilter('2')"
        class="nav"
        :class="{ active: filter.collectedFilter === '2' }"
      >
        <span class="tg tg-bl">配布可</span>
      </Button>
      <Button
        @click="onClickCollectedFilter('4')"
        class="nav"
        :class="{ active: filter.collectedFilter === '4' }"
      >
        <span class="tg">未取得</span>
      </Button>
    </div>
    <div class="buttons" style="margin-top: 0.5rem;">
      <Button
        @click="onClickCollectedFilter('5')"
        class="pill"
        :class="{ active: filter.collectedFilter === '5' }"
      >
        もらえる
      </Button>
      <Button
        @click="onClickCollectedFilter('6')"
        class="pill"
        :class="{ active: filter.collectedFilter === '6' }"
      >
        ゆずれる
      </Button>
    </div>
  </div>
</template>

<script>
import Popper from "vue-popperjs";
import DropdownItem from "./DropdownItem";
import Button from "./Button";
import IconCatalog from "./IconCatalog";

export default {
  name: "FilterUIShared",
  components: {
    Popper,
    DropdownItem,
    Button,
    IconCatalog
  },
  props: {
    filter: Object,
    showSaleFilter: {
      type: Boolean,
      default: false
    },
    currentNav: String
  },
  computed: {
    isFashion() {
      return this.currentNav && this.currentNav.indexOf("fashion") > -1;
    },
    isShowOrderChanger() {
      return (
        (this.currentNav && this.currentNav.indexOf("creatures") > -1) ||
        this.currentNav === "reactions" ||
        this.currentNav === "housewares-nookmiles" ||
        this.currentNav === "achievements"
      );
    }
  },
  methods: {
    onClickSaleFilter: function(value) {
      this.$refs.saleFilter.doClose();
      this.$emit("change", Object.assign(this.filter, { saleFilter: value }));
    },
    onClickCollectedFilter: function(value) {
      this.$emit(
        "change",
        Object.assign(this.filter, { collectedFilter: value })
      );
    },
    onClickOrderMenuItem(value) {
      this.$emit("change", Object.assign(this.filter, { order: value }));
    },
    isOpenSaleFilter() {
      if (!this.$refs.saleFilter) return false;
      return this.$refs.saleFilter.showPopper;
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
}

.btn-label {
  position: absolute;
  top: 0;
  left: 5px;
  z-index: 2;
  padding: 0 2px;
  font-size: 10px;
  background-color: white;
  border-radius: 8px;
  pointer-events: none;
  white-space: nowrap;
}

.dropdown-btn {
  display: inline-flex;
  align-items: center;
  margin-top: 6px;
  margin-right: 0.5rem;
  min-width: 60px;
  padding: 0.7em 0.3rem 0.2rem 0.4rem;
  background-color: transparent;
  border: 1px solid #e3e3e3;
  border-radius: 8px;
  font-size: 14px;
  outline: 0;

  &.active {
    border-color: #42b983;

    img {
      transform: rotate(180deg);
    }
  }

  img {
    margin-top: -3px;
    margin-left: 2px;

    @media (min-width: 360px) {
      margin-left: 4px;
    }
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
  font-size: 14px;

  .tg {
    padding-right: 0.2rem;
    padding-left: 0.2rem;
  }
}

.tg {
  padding-top: 0.1rem;
  padding-bottom: 0.1rem;
  border-radius: 3px;
  line-height: 1.3;
}

.tg-gr {
  padding-right: 0.2rem;
  padding-left: 0.2rem;
  background-color: #b6ecd4;
}

.tg-bl {
  padding-right: 0.3rem;
  padding-left: 0.3rem;
  background-color: #a0cbff;
}

.buttons {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
}

.flat-btn {
  height: 38px;
  line-height: 38px;
  font-weight: 400;
  font-size: 14px;
  padding-right: 0.25rem;
  padding-left: 0.25rem;
  margin-top: 6px;
  margin-right: 0.25rem;
  margin-left: 0.25rem;

  &.nav {
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;

    &.active {
      font-weight: 700;
      border-bottom: 4px solid #42b983;
    }
  }

  &.pill {
    border: 1px solid #ccc;
    border-radius: 999px;
    width: 100px;

    &.active {
      font-weight: 700;
      background-color: #42b983;
      border-color: transparent;
      color: #fff;
    }
  }
}
</style>
