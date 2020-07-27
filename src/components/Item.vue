<template>
  <li :class="viewMode === 'list' ? 'item' : 'tile'">
    <template v-if="viewMode === 'list'">
      <img v-lazy="getImage(item)" class="item-img" />
      <div class="item-center">
        <div class="item-name">{{ item.displayName }}</div>
        <template>
          <div
            class="item-variants"
            v-if="item.variants && item.variants.length > 1"
          >
            <label
              v-for="variant in item.variants"
              :key="variant.uniqueEntryId"
              class="variant"
            >
              <input
                type="checkbox"
                class="variant-input"
                v-model="collection"
                :value="variant.uniqueEntryId"
                @change="setCollection"
              />
              <span class="variant-name">
                <template v-if="variant.variation">
                  {{ variant.variation }}
                </template>
                <template v-else-if="variant.genuine === true">本物</template>
                <template v-else-if="variant.genuine === false">偽物</template>
              </span>
            </label>
            <span class="variant-length">{{ item.variants.length }}種</span>
          </div>
        </template>
      </div>
      <label class="item-check">
        <input
          type="checkbox"
          class="item-check-input"
          :checked="
            item.variants
              ? item.variants.length === collection.length
              : collection.length === 1
          "
          :key="item.uniqueEntryId || item.name"
          @change="onChangeAllCheck"
        />
      </label>
    </template>
    <template v-if="viewMode === 'tile'">
      <ul class="tile-variants" v-if="item.variants">
        <li
          class="tile-item"
          v-for="(variant, index) in item.variants"
          :key="variant.uniqueEntryId"
        >
          <div class="tile-item-name"><template v-if="index === 0">{{item.displayName}}</template></div>
          <img v-lazy="getVariantTileImage(variant)" class="item-img" />
          <div class="tile-var-name">{{variant.variation}}</div>
        </li>
      </ul>
    </template>
  </li>
</template>

<script>
export default {
  name: "Item",
  props: {
    collected: {
      type: [String, Array],
      default: ""
    },
    item: Object,
    viewMode: String
  },
  data() {
    return {
      collection: []
    };
  },
  mounted() {
    this.collection = this.getCollection();
  },
  watch: {
    collected: function() {
      this.collection = this.getCollection();
    }
  },
  methods: {
    getImage: function(item) {
      let image = "";
      if (item.variants) {
        image = this.getVariantTileImage(item.variants[0]);
      } else if (item.sourceSheet === "Recipes") {
        image = "https://i0.wp.com/acnhcdn.com/latest/MenuIcon/PaperRecipe.png";
      }
      return image;
    },
    getVariantTileImage: function(variant) {
      return variant.image || variant.storageImage || variant.albumImage;
    },
    getCollection: function() {
      let result = [];
      const item = this.item;
      const collected =
        typeof this.collected === "string" ? this.collected : "";
      if (collected !== "") {
        if (item.uniqueEntryId && collected.length) {
          return [item.uniqueEntryId];
        } else if (item.variants) {
          [].forEach.call(collected, function(s) {
            result.push(item.variants[parseInt(s, 10)].uniqueEntryId);
          });
        }
      }

      return result;
    },
    setCollection() {
      const value = this.collection;
      let result = "";
      if (this.item.uniqueEntryId && value.length > 0) {
        result = "0";
      } else if (this.item.variants) {
        this.item.variants.forEach((variant, index) => {
          if (value.includes(variant.uniqueEntryId)) {
            result = result + index;
          }
        });
      }
      this.$emit("change", this.item.uniqueEntryId || this.item.name, result);
    },
    onChangeAllCheck: function(event) {
      let result = [];
      if (event.target.checked) {
        if (this.item.uniqueEntryId) {
          result = [this.item.uniqueEntryId];
        } else if (this.item.variants) {
          this.item.variants.forEach(variant => {
            result.push(variant.uniqueEntryId);
          });
        }
      }
      this.collection = result;
      this.setCollection();
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
  vertical-align: top;

  .item & {
  margin-right: 0.5rem;
  }
}

.item-name {
  font-weight: 600;
  font-size: 15px;
}

.item-check {
  display: block;
  min-height: 1.75rem;
  padding-left: 1.75rem;
  margin-right: 0.5rem;
  margin-bottom: 0;
  margin-left: auto;
}

.item-check-input {
  width: 1.75rem;
  height: 1.75rem;
  float: left;
  margin-top: 0.125em;
  margin-left: -1.75rem;
  vertical-align: top;
  background-color: #fff;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  border: 1px solid rgba(0, 0, 0, 0.25);
  border-radius: 0.25em;
  appearance: none;

  &:checked {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M6 10l3 3l6-6'/%3e%3c/svg%3e");
    background-color: #42b983;
    border-color: #42b983;
  }
}

.item-variants {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.variant {
  margin-bottom: 0.125rem;
}

.variant-input {
  position: absolute;
  clip: rect(0, 0, 0, 0);
  pointer-events: none;

  &:checked ~ .variant-name {
    background-color: #42b983;
    color: #fff;

    &:active {
      background-color: darken(#42b983, 10%);
    }
  }
}

// List variants

.variant-name {
  padding: 2px 4px;
  margin-right: 0.25rem;
  border-radius: 5px;
  background-color: #eee;
  font-size: 13px;
  user-select: none;

  &:active {
    background-color: darken(#eee, 10%);
  }
}

.variant-length {
  display: inline-block;
  font-size: 13px;
}

// Tile

.tile {
  display: inline;
}

.tile-variants {
  display: inline;
  padding-left: 0;
}

.tile-item {
  display: inline-block;
  width: 75px;
  height: 88px;
  text-align: center;
  vertical-align: top;
}

.tile-item-name {
  display: block;
  font-size: 9px;
  font-weight: 600;
  height: 1.6rem;
  overflow: hidden;
}

.tile-var-name {
  display: block;
  font-size: 9px;
  height: .8rem;
  overflow: hidden;
}
</style>
