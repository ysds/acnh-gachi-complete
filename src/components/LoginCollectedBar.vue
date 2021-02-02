<template functional>
  <div class="wrapper">
    <div class="bar" :class="{ all: props.isAll }">
      <div class="left">
        {{ props.text }}
      </div>
      <div class="right">
        {{ props.value }} /
        {{ props.totalValue }}
        ({{ $options.percentage(props.value, props.totalValue) }})
      </div>
      <div
        class="bar-value"
        :class="{
          'bar-comp': $options.isComplete(props.value, props.totalValue)
        }"
        :style="$options.style(props.value, props.totalValue)"
      />
    </div>
    <img
      class="img"
      :class="{
        'img-comp': $options.isComplete(props.value, props.totalValue)
      }"
      src="../assets/complete.svg"
      alt=""
    />
  </div>
</template>

<script>
import { percentage } from "../utils/utils";

export default {
  prop: {
    text: "",
    value: 0,
    totalValue: 0,
    isAll: false
  },
  percentage,
  isComplete(value, totalValue) {
    return totalValue !== 0 && value === totalValue;
  },
  style(value, totalValue) {
    const width = totalValue !== 0 ? (value / totalValue) * 100 + "%" : 0;
    return `width: ${width}`;
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  align-items: center;
}

.bar {
  position: relative;
  display: flex;
  align-items: center;
  flex-grow: 1;
  width: 100%;
  padding: 3px 0.25rem 1px;
  margin-bottom: 0.25rem;
  border-radius: 6px;
  background-color: #e6e6e6;
  line-height: 1;
  font-size: 12px;
  overflow: hidden;
}

.all {
  padding-top: 10px;
  padding-bottom: 8px;
}

.left {
  position: relative;
  z-index: 2;
}

.right {
  position: relative;
  z-index: 2;
  margin-left: auto;
}

.img {
  margin-top: -4px;
  visibility: hidden;
}

.img-comp {
  visibility: visible;
}

.bar-value {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  background-color: #42b983;
}

.bar-comp {
  background-color: #ff9baf;
}
</style>
