<template>
  <div class="wrapper">
    <template v-if="showSaleFilter">
      <popper trigger="clickToToggle" :visible-arrow="false" ref="saleFilter">
        <div slot="reference" style="position: relative;">
          <div class="btn-label">取得方法</div>
          <button
            type="button"
            class="dropdown-btn"
            :class="{ active: openSaleFilter() }"
          >
            <span class="tg" v-if="filter.saleFilter === '0'">すべて</span>
            <span class="tg" v-else-if="filter.saleFilter === '1'">お店</span>
            <span class="tg" v-else-if="filter.saleFilter === '2'">DIY</span>
            <span class="tg" v-else-if="filter.saleFilter === '3'">その他</span>
            <img src="../assets/arrow.svg" alt="" />
          </button>
        </div>
        <div class="dropdown-menu">
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
      </popper>
      <div class="divider" />
    </template>
    <popper
      trigger="clickToToggle"
      :visible-arrow="false"
      ref="collectedFilter"
    >
      <div slot="reference" style="position: relative;">
        <div class="btn-label">チェック状態</div>
        <button
          type="button"
          class="dropdown-btn"
          :class="{ active: openCollectedFilter() }"
        >
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
      </div>
      <div class="dropdown-menu">
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
    </popper>
    <template v-if="showBatchAction">
      <div class="divider" />
      <popper
        trigger="clickToToggle"
        :visible-arrow="false"
        ref="batchOpePopper"
      >
        <div slot="reference" style="position: relative;">
          <div class="btn-label">一括操作</div>
          <button
            type="button"
            class="dropdown-btn"
            :class="{ active: openBatchOpe() }"
          >
            <span class="tg">操作...</span>
            <img src="../assets/arrow.svg" alt="" />
          </button>
        </div>
        <div class="dropdown-menu">
          <DropdownItem @click="onClickBatchOperation('allCollected')">
            <span class="tg"
              >すべて<span class="tg tg-gr">取得済</span>としてチェック</span
            >
          </DropdownItem>
          <DropdownItem @click="onClickBatchOperation('allProvidable')">
            <span class="tg"
              >すべて<span class="tg tg-bl">配布可</span>としてチェック</span
            >
          </DropdownItem>
          <DropdownItem @click="onClickBatchOperation('allUncheck')">
            <span class="tg">すべてのチェックを外す</span>
          </DropdownItem>
        </div>
      </popper>
    </template>
    <template v-if="showPinOption">
      <div class="divider" />
      <Button :active="isPinned" @click="onClickPin">
        <IconPinned v-if="isPinned" />
        <IconPin v-else />
      </Button>
    </template>
  </div>
</template>

<script>
import Popper from "vue-popperjs";
import DropdownItem from "./DropdownItem";
import Button from "./Button";
import IconPin from "./IconPin";
import IconPinned from "./IconPinned";

export default {
  name: "FilterUI",
  components: {
    Popper,
    DropdownItem,
    Button,
    IconPin,
    IconPinned
  },
  props: {
    filter: Object,
    showSaleFilter: {
      type: Boolean,
      default: false
    },
    showPinOption: {
      type: Boolean,
      default: false
    },
    showBatchAction: {
      type: Boolean,
      default: true
    },
    currentNav: String,
    pins: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      isPinned: false
    };
  },
  mounted() {
    this.isPinned = this.pins[this.currentNav];
  },
  watch: {
    currentNav: function() {
      this.isPinned = this.pins[this.currentNav];
    }
  },
  methods: {
    onClickSaleFilter: function(value) {
      this.$refs.saleFilter.doClose();
      this.$emit("change", Object.assign(this.filter, { saleFilter: value }));
    },
    onClickCollectedFilter: function(value) {
      this.$refs.collectedFilter.doClose();
      this.$emit(
        "change",
        Object.assign(this.filter, { collectedFilter: value })
      );
    },
    onClickBatchOperation: function(value) {
      this.$refs.batchOpePopper.doClose();
      if (value) this.$emit("clickBatchAction", value);
    },
    onClickPin: function() {
      this.isPinned = !this.isPinned;
      this.$emit("changePin", this.currentNav, this.isPinned);
    },
    openSaleFilter: function() {
      if (!this.$refs.saleFilter) return false;
      return this.$refs.saleFilter.showPopper;
    },
    openCollectedFilter: function() {
      if (!this.$refs.collectedFilter) return false;
      return this.$refs.collectedFilter.showPopper;
    },
    openBatchOpe: function() {
      if (!this.$refs.batchOpePopper) return false;
      return this.$refs.batchOpePopper.showPopper;
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

.divider {
  margin-right: 0.5rem;
  margin-left: 0.25rem;
}

.btn-label {
  position: absolute;
  top: 0;
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
  margin-top: 6px;
  padding: 0.5rem 0.35rem 0.2rem;
  background-color: transparent;
  border: 1px solid #ccc;
  border-radius: 4px;
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
  font-size: 14px;

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

.flat-btn {
  min-width: 38px;
  height: 38px;
  margin-top: 6px;
  line-height: 38px;

  &.active {
    color: #21bec5;
  }
}
</style>
