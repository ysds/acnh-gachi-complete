<template>
  <div>
    <Popper ref="batchActionPopper">
      <div slot="reference">
        <Button sm :active="isOpenBatchMenu()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="currentColor"
            class="bi bi-three-dots"
            viewBox="0 0 16 16"
          >
            <path
              d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"
            />
          </svg>
        </Button>
      </div>
      <DropdownMenu>
        <DropdownItem @click="onClickCopyName">
          すべてのアイテム名をコピー
        </DropdownItem>
        <div class="dropdown-divider" />
        <DropdownItem @click="onClickBatchMenuItem('allCollected')">
          すべて<span class="tg tg-gr">取得済</span>としてチェック
        </DropdownItem>
        <DropdownItem @click="onClickBatchMenuItem('allProvidable')">
          すべて<span class="tg tg-bl">配布可</span>としてチェック
        </DropdownItem>
        <DropdownItem @click="onClickBatchMenuItem('allUncheck')">
          すべてのチェックを外す
        </DropdownItem>
      </DropdownMenu>
    </Popper>
    <portal to="batchModal">
      <Modal :show="isShowCopyModal" @close="closeModal">
        <template slot="header">
          表示されているすべてのアイテム名をクリップボードにコピーしました！
        </template>
        <template slot="body">
          <p v-if="activeNav === 'posters' || activeNav === 'photos'">
            住民の名前だけコピーし、「{{
              activeNav === "posters" ? "のポスター" : "のしゃしん"
            }}」 は省略しました。
          </p>
          <div class="modal-footer">
            <Button primary @click="closeModal">
              OK
            </Button>
          </div>
        </template>
      </Modal>
      <Modal :show="isShowBatchModal" @close="isShowBatchModal = false">
        <template slot="header">
          本当にチェック状態を一括変更してもよろしいですか？
        </template>
        <template slot="body">
          <div class="modal-footer">
            <Button secondary @click="isShowBatchModal = false">
              キャンセル
            </Button>
            <Button primary @click="onClickBatchActionButton">
              一括変更
            </Button>
          </div>
        </template>
      </Modal>
    </portal>
  </div>
</template>

<script>
import Popper from "./Popper";
import Button from "./Button";
import DropdownMenu from "./DropdownMenu";
import DropdownItem from "./DropdownItem";
import Modal from "./Modal";

export default {
  components: {
    Popper,
    Button,
    DropdownMenu,
    DropdownItem,
    Modal
  },
  props: {
    items: Array
  },
  data() {
    return {
      isShowCopyModal: false,
      isShowBatchModal: false,
      batchAction: null
    };
  },
  computed: {
    activeNav() {
      return this.$store.getters.activeNav;
    }
  },
  methods: {
    onClickCopyName() {
      this.$refs.batchActionPopper.doClose();
      this.isShowCopyModal = true;
      this.$emit("clickCopyName", this.currentNav);
    },
    onClickBatchMenuItem(value) {
      this.$refs.batchActionPopper.doClose();
      this.isShowBatchModal = true;
      this.batchAction = value;
    },
    onClickBatchActionButton() {
      this.isShowBatchModal = false;
      this.$emit("clickBatchAction", this.batchAction);
    },
    isOpenBatchMenu() {
      if (!this.$refs.batchActionPopper) return false;
      return this.$refs.batchActionPopper.isShowPopper();
    },
    closeModal() {
      this.isShowCopyModal = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.modal-footer {
  display: flex;
  justify-content: flex-end;
  margin-bottom: -20px;

  > * {
    margin-left: 1rem;
  }
}
</style>
