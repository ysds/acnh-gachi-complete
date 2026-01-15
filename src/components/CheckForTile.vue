<template functional>
  <button
    type="button"
    class="t"
    :class="{ t1: props.value === 1, t2: props.value === 2 }"
    v-on="listeners"
  >
    <div class="t-name">
      {{ props.name }}
    </div>
    <template v-if="!props.houseShareImage1 && !props.houseShareImage2">
      <img class="t-img" v-lazy="props.image" />
    </template>
    <template v-else>
      <img class="t-img-house-share" v-lazy="props.houseShareImage1" />
      <img class="t-img-house-share" v-lazy="props.houseShareImage2" />
    </template>
    <img
      class="t-img-remake"
      src="../assets/remake.svg"
      v-if="props.isRemake"
    />
    <img
      class="t-img-recipe"
      src="https://i0.wp.com/acnhcdn.com/latest/MenuIcon/PaperRecipe.png"
      v-if="props.isRecipe"
    />
    <div class="t-v-name">
      <template v-if="props.variants">
        <template v-if="props.variants.length > 1">
          {{ props.variant.vName }}
        </template>
        <template v-if="props.variant.genuine">
          {{ props.variant.genuine }}
        </template>
        <template v-if="props.variant.request">
          {{ props.variant.request }}
        </template>
      </template>
      <template v-if="props.length && props.length > 1">
        {{ props.length }}種
      </template>
    </div>
    <div v-if="props.isInWishlist" class="t-heart" />
    <div v-if="props.stock && props.stock > 1" class="t-stock">
      {{ props.stock }}
    </div>
  </button>
</template>
<script>
export default {
  name: "CheckForList",
  props: [
    "name",
    "image",
    "houseShareImage1",
    "houseShareImage2",
    "value",
    "variant",
    "variants",
    "isRecipe",
    "isRemake",
    "isInWishlist",
    "length",
    "stock",
  ],
};
</script>
<style lang="scss" scoped>
.t {
  position: relative;
  display: inline-block;
  width: 72px;
  height: 96px;
  padding: 0;
  text-align: center;
  vertical-align: top;
  border: 0;
  background-color: transparent;
  border-top: 1px solid var(--app-body-bg);
  border-bottom: 1px solid var(--app-body-bg);
  color: inherit;
  vertical-align: top;
  outline: 0;
  user-select: none;
  transition: transform 0.1s, background-color 0.2s;

  @media (min-width: 375px) {
    width: 75px;
  }

  &:active {
    transform: scale(0.85);
    border-radius: 8px !important;
  }

  &.t1 {
    background-color: var(--app-collected);
    color: #000;
  }

  &.t2 {
    background-color: var(--app-providable);
    color: #000;
  }
}

.t-name {
  position: relative;
  z-index: 10;
  display: block;
  margin-top: 2px;
  font-size: 10px;
  font-weight: 600;
  height: 1.5rem;
  line-height: 1.1;
  pointer-events: none;
  user-select: none;
}

.t-v-name {
  display: block;
  font-size: 9px;
  height: 1.5rem;
  line-height: 1.2;
  overflow: hidden;
  pointer-events: none;
  user-select: none;
}

.t-img {
  margin-top: -3px;
  width: 50px;
  height: 50px;
  object-fit: contain;
  vertical-align: top;
  pointer-events: none;
  user-select: none;
  -webkit-touch-callout: none;
}

.t-img-house-share {
  margin-top: 9px;
  margin-bottom: 12px;
  width: 25px;
  height: 25px;
  object-fit: contain;
  vertical-align: top;
  pointer-events: none;
  user-select: none;
  -webkit-touch-callout: none;
}

.t-img-remake {
  position: absolute;
  bottom: 20px;
  right: 4px;
  pointer-events: none;
  user-select: none;
  filter: var(--app-filter);
}

.t-img-recipe {
  position: absolute;
  bottom: 14px;
  right: 2px;
  width: 32px;
  height: 32px;
  pointer-events: none;
  user-select: none;
}

.t-heart {
  position: absolute;
  right: 6px;
  top: 24px;
  width: 12px;
  height: 12px;
  margin-bottom: 0.2rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='%23eb486b'%3E%3Cpath d='M12 4.248c-3.148-5.402-12-3.825-12 2.944 0 4.661 5.571 9.427 12 15.808 6.43-6.381 12-11.147 12-15.808 0-6.792-8.875-8.306-12-2.944z'/%3E%3C/svg%3E");
}

.t-stock {
  position: absolute;
  right: 4px;
  top: 39px;
  height: 16px;
  padding-right: 4px;
  padding-left: 4px;
  min-width: 16px;
  margin-bottom: 0.2rem;
  background-color: var(--app-stock);
  color: var(--app-stock-color);
  border-radius: 99px;
  font-size: 12px;
  font-weight: 500;
  line-height: 17px;
}
</style>
