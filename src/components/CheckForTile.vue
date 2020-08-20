<template functional>
  <button
    type="button"
    class="t"
    :class="{ t1: props.value === 1, t2: props.value === 2 }"
    v-on="listeners"
  >
    <div class="t-name">{{ props.name }}</div>
    <img class="t-img" v-lazy="props.image" />
    <div class="t-v-name">
      <template v-if="props.variants && props.variants.length > 1">
        {{ props.variant.variationDisplayName || props.variant.variation }}
      </template>
    </div>
  </button>
</template>
<script>
export default {
  name: "CheckForList",
  props: ["name", "image", "value", "variant", "variants"]
};
</script>
<style lang="scss" scoped>
.t {
  position: relative;
  display: inline-block;
  width: 75px;
  height: 96px;
  padding: 0;
  text-align: center;
  vertical-align: top;
  border: 0;
  background-color: transparent;
  border-top: 1px solid #fff;
  border-bottom: 1px solid #fff;
  vertical-align: top;
  outline: 0;
  user-select: none;

  &:first-child {
    border-left: 1px solid #fff;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }

  &:last-child {
    border-right: 1px solid #fff;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  &.t1 {
    background-color: #b6ecd4;
  }

  &.t2 {
    background-color: #a0cbff;
  }
}

.t-name {
  display: block;
  margin-top: 2px;
  font-size: 10px;
  font-weight: 600;
  height: 1.6rem;
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
  vertical-align: top;
  pointer-events: none;
  user-select: none;
  -webkit-touch-callout: none;
}
</style>
