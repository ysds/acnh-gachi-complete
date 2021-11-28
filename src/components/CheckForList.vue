<template functional>
  <button
    type="button"
    class="v"
    :class="{ v1: props.value === 1, v2: props.value === 2 }"
    v-on="listeners"
  >
    <template v-if="props.variant.vName">
      <template v-if="props.variants.length > 1">
        {{ props.variant.vName }}
      </template>
    </template>
    <template v-if="props.variant.genuine">
      {{ props.variant.genuine }}
    </template>
    <template v-if="props.variant.request">
      {{ props.variant.request }}
    </template>
    <div v-if="props.isInWishlist" class="t-heart" />
    <div v-if="props.stock && props.stock > 1" class="t-stock">
      {{ props.stock }}
    </div>
  </button>
</template>
<script>
export default {
  name: "CheckForList",
  props: ["value", "variant", "variants", "stock", "isInWishlist"],
};
</script>
<style lang="scss" scoped>
.v {
  display: inline-flex;
  padding: 2px 4px;
  margin-right: 0.25rem;
  margin-bottom: 0.125rem;
  border: 0;
  border-radius: 5px;
  background-color: #eee;
  font-size: 13px;
  color: #444;
  user-select: none;
  transition: transform 0.1s, background-color 0.2s;

  &:active {
    transform: scale(0.8);
  }

  &.v1 {
    background-color: #42b983;
    color: #fff;
  }

  &.v2 {
    background-color: #3790ff;
    color: #fff;
  }
}

.t-heart {
  width: 12px;
  height: 12px;
  margin-top: 2px;
  margin-left: 4px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='%23eb486b'%3E%3Cpath d='M12 4.248c-3.148-5.402-12-3.825-12 2.944 0 4.661 5.571 9.427 12 15.808 6.43-6.381 12-11.147 12-15.808 0-6.792-8.875-8.306-12-2.944z'/%3E%3C/svg%3E");
}

.t-stock {
  height: 16px;
  padding-right: 4px;
  padding-left: 4px;
  min-width: 16px;
  margin-left: 4px;
  background-color: #1f75dd;
  color: #fff;
  border-radius: 99px;
  font-size: 12px;
  font-weight: 500;
  line-height: 17px;
}
</style>
