<template functional>
  <button
    type="button"
    class="v"
    :class="{ v1: props.value === 1, v2: props.value === 2 }"
    v-on="listeners"
  >
    <template v-if="props.variant.variation">
      <template v-if="props.variants.length > 1">
        {{ props.variant.variationDisplayName || props.variant.variation }}
      </template>
    </template>
    <template v-else-if="props.variant.genuine === true">本物</template>
    <template v-else-if="props.variant.genuine === false">偽物</template>
  </button>
</template>
<script>
export default {
  name: "CheckForList",
  props: ["value", "variant", "variants"]
};
</script>
<style lang="scss" scoped>
.v {
  padding: 2px 4px;
  margin-right: 0.25rem;
  margin-bottom: 0.125rem;
  border: 0;
  border-radius: 5px;
  background-color: #eee;
  font-size: 13px;
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
</style>
