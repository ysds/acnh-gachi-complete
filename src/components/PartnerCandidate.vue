<template>
  <li class="item" @click="$emit('change', item)">
    <div class="item-img-block" @click="onClickListImage">
      <img v-lazy="itemImage" class="item-img" />
    </div>
    <div class="item-center">
      <div>{{ item.displayName }}</div>
    </div>
    <button type="button" class="item-check-btn">
      <span
        class="item-check"
        :class="{
          'item-check-1': isCandidate,
        }"
      />
    </button>
  </li>
</template>

<script>
export default {
  name: "Item",
  props: {
    item: Object,
    isCandidate: Boolean,
  },
  directives: {
    "long-press": {
      bind(el, binding, vnode) {
        const listener = (e) => {
          vnode.context.showModal(e, binding.value);
        };
        vnode.context.longPressBound[binding.value] = listener;
        el.addEventListener("long-press", listener);
      },
      unbind(el, binding, vnode) {
        el.removeEventListener(
          "long-press",
          vnode.context.longPressBound[binding.value]
        );
        delete vnode.context.longPressBound[binding.value];
      },
    },
  },
  data() {
    return {
      checks: {},
      longPressBound: {},
    };
  },
  computed: {
    itemImage() {
      return `https://acnhcdn.com/latest/${this.item.variants[0].image}`;
    },
    isShowDropdown() {
      return this.$store.getters.isShowDropdown;
    },
    matchedVariants() {
      const item = this.item;
      if (!item.variants) return null;

      if (!this.isSearchMode && item.matchedVariants) {
        return item.matchedVariants;
      } else {
        return "0123456789".substring(0, item.variants.length).split("");
      }
    },
  },
  methods: {
    updateChecks(collected) {
      let result = {};
      const item = this.item;
      collected = typeof collected === "string" ? collected : "";

      // No variants item
      if (item.uniqueEntryId) {
        const value = collected === "" ? 0 : collected === "0" ? 1 : 2;
        result[0] = value;
        return Object.assign({}, result);
      }
      // Variants item
      else if (item.variants) {
        for (let i = 0; i < item.variants.length; i++) {
          result[i] = 0;
        }
        if (collected !== "") {
          [].forEach.call(collected, function (string) {
            if (!isNaN(string)) {
              result[parseInt(string, 10)] = 1;
            } else {
              result[string.charCodeAt() - 65] = 2;
            }
          });
        }
      }
      return result;
    },
    updateCollected() {
      const checks = Object.values(this.checks);
      let result = "";
      for (let i = 0; i < checks.length; i++) {
        if (checks[i] === 1) {
          result = result + i;
        } else if (checks[i] === 2) {
          result = result + String.fromCharCode(i + 65);
        }
      }
      this.$emit("change", this.item.uniqueEntryId || this.item.name, result);
    },
    onClickListImage() {
      if (this.isWishlistMode) {
        this.updateWishlist(0, 0);
      }
    },
    onChangeCheck(index, i) {
      if (this.isShowDropdown || this.isStatic || this.item.isHidden) {
        return;
      }

      if (this.isWishlistMode && i !== undefined) {
        this.updateWishlist(index, i);
      } else if (this.stockCounts[index] > 1) {
        this.$emit("showModal", this.item, parseInt(index, 10));
      } else {
        const currentValue = this.checks[index];
        const nextValue = currentValue === 2 ? 0 : currentValue + 1;
        this.checks[index] = nextValue;
        this.updateCollected();
      }
    },
  },
};
</script>

<style scoped lang="scss">
.item {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 66px;
  padding: 0 0 0 0.75rem;
  margin: 0;
  border-bottom: 1px solid var(--app-btn-gray2);
  user-select: none;
  cursor: pointer;
}

.item-img-block {
  position: relative;
  cursor: pointer;
}

.item-img {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  object-fit: contain;
  margin-right: 0.5rem;
  vertical-align: top;
  pointer-events: none;
  user-select: none;
}

.item-center {
  margin-top: 0.75rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
  font-size: 15px;
}

.item-check-btn {
  display: flex;
  align-self: stretch;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0 1rem 0 0.75rem;
  margin-left: auto;
  border: 0;
  outline: 0;
  background-color: transparent;

  &:focus .item-check {
    box-shadow: 0 0 0 2px #fff;
    border-color: transparent;
  }
}

.item-check {
  display: block;
  width: 1.75rem;
  height: 1.75rem;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  background-color: var(--app-btn-gray2);
  border: none;
  border-radius: 0.25em;
  appearance: none;

  &.item-check-1 {
    background-image: var(--app-check);
    background-color: #42b983;
  }

  &.item-check-2 {
    background-image: var(--app-check);
    background-color: #3790ff;
  }
}
</style>
