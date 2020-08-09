<template>
  <li :class="filter.viewMode === 'list' ? 'item' : 'tile'">
    <template v-if="filter.viewMode === 'list'">
      <img v-lazy="getImage(item)" class="item-img" />
      <div class="item-center">
        {{ item.displayName }}
        <template>
          <div
            class="item-variants"
            v-if="item.variants && item.variants.length > 1"
          >
            <CheckForList
              v-for="(variant, index) in item.variants"
              :key="variant.uniqueEntryId"
              :value="checks[index]"
              :variant="variant"
              :variants="item.variants"
              @click="onChangeCheck(index)"
            />
            <span class="item-length">{{ item.variants.length }}種</span>
          </div>
        </template>
      </div>
      <button
        type="button"
        class="item-check"
        :class="{
          'item-check-1': allCheckState === 1,
          'item-check-2': allCheckState === 2
        }"
        @click="onClickAllCheck"
      />
    </template>
    <template v-if="filter.viewMode === 'tile'">
      <ul class="tile-variants" v-if="item.variants">
        <!-- eslint-disable-next-line vue/no-use-v-if-with-v-for -->
        <CheckForTile
          v-for="(index, i) in filteredCheckIndexes"
          :key="item.variants[index].uniqueEntryId"
          :name="i === 0 ? item.displayName : ''"
          :image="getVariantTileImage(item.variants[index])"
          :value="checks[index]"
          :variant="item.variants[index]"
          :variants="item.variants"
          @click="onChangeCheck(index)"
        />
      </ul>
      <ul class="tile-variants" v-else>
        <CheckForTile
          :name="item.displayName"
          :image="getSingeItemImage(item)"
          :value="checks[0]"
          @click="onClickAllCheck"
        />
      </ul>
    </template>
  </li>
</template>

<script>
import CheckForList from "./CheckForList";
import CheckForTile from "./CheckForTile";

export default {
  name: "Item",
  components: {
    CheckForList,
    CheckForTile
  },
  props: {
    collected: {
      type: [String, Array],
      default: ""
    },
    item: Object,
    filter: Object,
    renderStartDate: Number
  },
  data() {
    return {
      checks: {},
      filteredCheckIndexes: null
    };
  },
  computed: {
    allCheckState: function() {
      const checks = Object.values(this.checks);
      let count2 = 0;
      for (let i = 0; i < checks.length; i++) {
        if (checks[i] === 0) {
          return 0;
        } else if (checks[i] === 2) {
          count2++;
        }
      }
      if (count2 === checks.length) {
        return 2;
      }
      return 1;
    }
  },
  watch: {
    collected: function() {
      this.checks = this.updateChecks();
    },
    renderStartDate: function() {
      this.filteredCheckIndexes = this.updateFilteredCheckIndexes();
    }
  },
  mounted() {
    this.checks = this.updateChecks();
    this.filteredCheckIndexes = this.updateFilteredCheckIndexes();
  },
  methods: {
    getImage: function(item) {
      let image = "";
      if (item.variants) {
        image = this.getVariantTileImage(item.variants[0]);
      } else {
        image = this.getSingeItemImage(item);
      }
      return image;
    },
    getVariantTileImage: function(variant) {
      return variant.image || variant.storageImage || variant.albumImage || "";
    },
    getSingeItemImage: function(item) {
      return item.sourceSheet === "Recipes"
        ? "https://i0.wp.com/acnhcdn.com/latest/MenuIcon/PaperRecipe.png"
        : "";
    },
    updateChecks: function() {
      let result = {};
      const item = this.item;
      const collected =
        typeof this.collected === "string" ? this.collected : "";

      // No variants item
      if (item.uniqueEntryId && collected.length) {
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
          [].forEach.call(collected, function(string) {
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
    updateFilteredCheckIndexes() {
      let result = [];
      const collectedFilter = this.filter.collectedFilter;
      const checks = this.checks;

      Object.keys(checks).forEach(function(key) {
        if (collectedFilter === "0") {
          result.push(key);
        } else if (collectedFilter === "1" && checks[key] === 1) {
          result.push(key);
        } else if (collectedFilter === "2" && checks[key] === 2) {
          result.push(key);
        } else if (
          collectedFilter === "3" &&
          (checks[key] === 1 || checks[key] === 2)
        ) {
          result.push(key);
        } else if (collectedFilter === "4" && checks[key] === 0) {
          result.push(key);
        }
      });

      if (this.item.displayName === "アームのフロアランプ") {
        console.log(this.checks);
        console.log(result);
      }

      return result;
    },
    onChangeCheck: function(index) {
      const currentValue = this.checks[index];
      const nextValue = currentValue === 2 ? 0 : currentValue + 1;
      this.checks[index] = nextValue;
      this.updateCollected();
    },
    onClickAllCheck: function() {
      const nextState = this.allCheckState === 2 ? 0 : this.allCheckState + 1;
      let result = {};
      Object.keys(this.checks).forEach(key => {
        result[key] = nextState;
      });
      this.checks = result;
      this.updateCollected();
    }
  }
};
</script>

<style scoped lang="scss">
// List item

.item {
  display: flex;
  align-items: center;
  min-height: 66px;
  padding: 0.75rem;
  margin: 0;
  border-bottom: 1px solid #eee;
}

.item-img {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  margin-right: 0.5rem;
  vertical-align: top;
}

.item-center {
  font-weight: 600;
  font-size: 15px;
}

.item-variants {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.item-length {
  display: inline-block;
  font-size: 13px;
  font-weight: 0;
}

.item-check {
  display: block;
  flex-shrink: 0;
  width: 1.75rem;
  height: 1.75rem;
  padding: 0;
  margin-right: 0.5rem;
  margin-bottom: 0;
  margin-left: auto;
  background-color: #fff;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  border: 1px solid rgba(0, 0, 0, 0.25);
  border-radius: 0.25em;
  appearance: none;

  &.item-check-1 {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M6 10l3 3l6-6'/%3e%3c/svg%3e");
    background-color: #42b983;
    border-color: transparent;
  }

  &.item-check-2 {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M6 10l3 3l6-6'/%3e%3c/svg%3e");
    background-color: #3790ff;
    border-color: transparent;
  }
}

// Tile

.tile {
  display: inline;
}

.tile-variants {
  display: inline;
  padding-left: 0;
}
</style>
