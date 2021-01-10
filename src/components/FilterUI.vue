<template>
  <div class="wrapper">
    <template v-if="showSaleFilter">
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
          :class="{ active: isOpenCollectedFilter() }"
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
          <img src="../assets/arrow.svg" width="12" alt="" />
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
      <popper
        trigger="clickToToggle"
        :visible-arrow="false"
        ref="batchActionPopper"
      >
        <div slot="reference" style="position: relative;">
          <div class="btn-label">一括操作</div>
          <button
            type="button"
            class="dropdown-btn"
            :class="{ active: isOpenBatchMenu() }"
          >
            <span class="tg">操作...</span>
            <img src="../assets/arrow.svg" width="12" alt="" />
          </button>
        </div>
        <div class="dropdown-menu">
          <DropdownItem @click="onClickCopyName">
            <span class="tg">すべてのアイテム名をコピー</span>
          </DropdownItem>
          <div class="dropdown-divider" />
          <DropdownItem @click="onClickBatchMenuItem('allCollected')">
            <span class="tg"
              >すべて<span class="tg tg-gr">取得済</span>としてチェック</span
            >
          </DropdownItem>
          <DropdownItem @click="onClickBatchMenuItem('allProvidable')">
            <span class="tg"
              >すべて<span class="tg tg-bl">配布可</span>としてチェック</span
            >
          </DropdownItem>
          <DropdownItem @click="onClickBatchMenuItem('allUncheck')">
            <span class="tg">すべてのチェックを外す</span>
          </DropdownItem>
        </div>
      </popper>
    </template>
    <template v-if="isShowOrderChanger">
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
    </template>
    <template v-if="showPinOption">
      <Button :active="isPinned" @click="onClickPin">
        <IconPinned v-if="isPinned" />
        <IconPin v-else />
      </Button>
    </template>
    <template v-if="showShareButton">
      <Button @click="showShareModal">
        <svg
          width="1em"
          height="1em"
          viewBox="0 0 16 16"
          style="margin-top: -3px;"
          class="bi bi-share"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"
          />
        </svg>
      </Button>
      <Modal :show="isShowShareModal" @close="isShowShareModal = false">
        <template slot="header">{{ navText }}のコンプ状況をシェア</template>
        <div slot="body">
          <div v-show="hasUpdateData">
            <div class="spinner">
              <Spinner />
            </div>
            <p>
              最新のチェック状態をクラウドに保存しています。
            </p>
          </div>
          <div v-show="!hasUpdateData">
            <p style="word-break: break-all;">
              公開ページの URL<br />
              <router-link :to="`/share2/${currentNav}/?uid=${user.uid}`">
                {{ shareURL }}
              </router-link>
            </p>
            <p>URL をクリップボードにコピーしました。</p>
            <div>
              <a
                class="btn"
                :href="
                  `https://twitter.com/intent/tweet?text=${navText}%0a${twitterURL}%0a%0a%23あつ森ガチコンプ`
                "
                >Twitter に投稿する</a
              >
            </div>
          </div>
        </div>
      </Modal>
    </template>
    <Modal :show="isShowBatchModal" @close="isShowBatchModal = false">
      <template slot="header">
        本当にチェック状態を一括変更してもよろしいですか？
      </template>
      <template slot="body">
        <div class="batch-modal-body">
          <Button class="batch-btn" @click="isShowBatchModal = false">
            キャンセル
          </Button>
          <Button class="batch-btn batch-btn-ok" @click="onClickBatchAction">
            一括変更
          </Button>
        </div>
      </template>
    </Modal>
    <Modal :show="isShowCopyModal" @close="isShowCopyModal = false">
      <template slot="header">
        表示されているすべてのアイテム名をクリップボードにコピーしました！
      </template>
      <template slot="body">
        <p v-if="currentNav === 'posters' || currentNav === 'photos'">
          住民の名前だけコピーし、「{{
            currentNav === "posters" ? "のポスター" : "のしゃしん"
          }}」 は省略しました。
        </p>
        <div class="batch-modal-body">
          <Button
            class="batch-btn batch-btn-ok"
            @click="isShowCopyModal = false"
          >
            OK
          </Button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
import Popper from "vue-popperjs";
import { getNavText } from "../utils/nav.js";
import DropdownItem from "./DropdownItem";
import Button from "./Button";
import IconPin from "./IconPin";
import IconPinned from "./IconPinned";
import IconCatalog from "./IconCatalog";
import Modal from "./Modal";
import Spinner from "./Spinner";

export default {
  name: "FilterUI",
  components: {
    Popper,
    DropdownItem,
    Button,
    IconPin,
    IconPinned,
    IconCatalog,
    Modal,
    Spinner
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
    showShareButton: {
      type: Boolean,
      default: false
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
      isPinned: false,
      isShowShareModal: false,
      isShowBatchModal: false,
      isShowCopyModal: false,
      shareURL: "",
      twitterURL: ""
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    navText() {
      return getNavText(this.currentNav);
    },
    hasUpdateData() {
      return this.$store.getters.hasUpdateData;
    },
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
    onClickOrderMenuItem(value) {
      this.$emit("change", Object.assign(this.filter, { order: value }));
    },
    onClickBatchMenuItem: function(value) {
      this.$refs.batchActionPopper.doClose();
      this.isShowBatchModal = true;
      this.batchAction = value;
    },
    onClickCopyName() {
      this.$refs.batchActionPopper.doClose();
      this.isShowCopyModal = true;
      this.$emit("clickCopyName", this.currentNav);
    },
    onClickBatchAction() {
      this.isShowBatchModal = false;
      this.$emit("clickBatchAction", this.batchAction);
    },
    onClickPin: function() {
      this.isPinned = !this.isPinned;
      this.$emit("changePin", this.currentNav, this.isPinned);
    },
    showShareModal: function() {
      const shareURL = `https://ysds.github.io/acnh-gachi-complete/share2/${this.currentNav}/?uid=${this.user.uid}`;
      this.shareURL = shareURL;
      this.twitterURL = `https://ysds.github.io/acnh-gachi-complete/share2/${this.currentNav}/?uid=${this.user.uid}`;
      this.$copyText(shareURL);
      this.isShowShareModal = true;
    },
    isOpenSaleFilter() {
      if (!this.$refs.saleFilter) return false;
      return this.$refs.saleFilter.showPopper;
    },
    isOpenCollectedFilter() {
      if (!this.$refs.collectedFilter) return false;
      return this.$refs.collectedFilter.showPopper;
    },
    isOpenBatchMenu() {
      if (!this.$refs.batchActionPopper) return false;
      return this.$refs.batchActionPopper.showPopper;
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

.dropdown-divider {
  margin: 0.5rem 0;
  border-top: 1px solid #ccc;
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

.flat-btn {
  min-width: 38px;
  height: 38px;
  margin-top: 6px;
  line-height: 38px;

  &.active {
    color: #21bec5;
  }
}

.batch-modal-body {
  display: flex;
  justify-content: flex-end;
  margin-bottom: -20px;
}

.batch-btn {
  margin-left: 1rem;
  color: #007bff;
  font-weight: 400;
}

.batch-btn-ok {
  font-weight: 700;
}

.spinner {
  display: flex;
  justify-content: center;
  margin: 2rem 1rem;
}

.btn-small {
  font-size: 14px;
  font-weight: 400;
}
</style>
