<template>
  <li class="item">
    <img :src="getImage(item)" class="item-img" />
    <div class="item-center">
      <div class="item-name">{{ item.displayName }}</div>
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
            v-model="collect"
            :value="variant.uniqueEntryId"
            @change="onChangeCheck(item.name)"
          />
          <span class="variant-name" v-if="variant.variation">
            {{ variant.variation }}
          </span>
        </label>
        <span class="variant-length">{{ item.variants.length }}色</span>
      </div>
    </div>
    <label class="item-check">
      <input
        type="checkbox"
        class="item-check-input"
        :checked="
          item.variants
            ? item.variants.length === collect.length
            : collect.length === 1
        "
        :key="item.uniqueEntryId || item.name"
        @change="onChangeAllCheck"
      />
    </label>
  </li>
</template>

<script>
export default {
  name: "Item",
  props: {
    collected: Array,
    item: Object,
  },
  data() {
    return {
      collect: this.collected || [],
    };
  },
  methods: {
    getImage: function(item) {
      let image = "";
      if (item.variants) {
        image = item.variants[0].image || item.variants[0].storageImage;
      } else if (item.sourceSheet === "Recipes") {
        image = "/img/PaperRecipe.png";
      }
      return image;
    },
    onChangeCheck: function() {
      this.$emit(
        "change",
        this.item.uniqueEntryId || this.item.name,
        this.collect
      );
    },
    onChangeAllCheck: function(event) {
      if (event.target.checked) {
        if (this.item.variants) {
          this.collect = [];
          this.item.variants.forEach((variant) => {
            this.collect.push(variant.uniqueEntryId);
          });
        } else if (this.item.uniqueEntryId) {
          this.collect.push(this.item.uniqueEntryId);
        }
      } else {
        this.collect = [];
      }
      this.onChangeCheck();
    },
  },
};
</script>

<style scoped lang="scss">
.item {
  display: flex;
  align-items: center;
  min-height: 70px;
  padding: 0.5rem 0.75rem;
  margin: 0;
  border-bottom: 1px solid #eee;
}

.item-img {
  width: 40px;
  height: 40px;
  margin-right: 0.5rem;
  vertical-align: top;
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
</style>
