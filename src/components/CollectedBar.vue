<template functional>
  <div class="wrap">
    <div>
      コンプ率
      {{ $options.percentage(props.value, props.totalValue) }}
      <img
        v-if="$options.isComplete(props.value, props.totalValue)"
        class="img"
        src="../assets/complete.svg"
        alt=""
      />
    </div>
    <div class="right">
      {{ props.value }}
    </div>
    <div class="sla">/</div>
    <div>{{ props.totalValue }}</div>
    <div class="bar">
      <div
        class="bar-value"
        :class="{
          'bar-comp': $options.isComplete(props.value, props.totalValue)
        }"
        :style="$options.style(props.value, props.totalValue)"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "CollectedBar",
  props: ["value", "totalValue"],
  percentage(value, totalValue) {
    if (totalValue === 0) {
      return "0.0%";
    } else {
      const percentage = (Math.floor((value / totalValue) * 1000) / 1000) * 100;
      return `${percentage.toFixed(1)}%`;
    }
  },
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
.wrap {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin: 0.75rem 0;
  padding: 0 0.5rem;
  font-size: 14px;
}

.sla {
  margin: 0 0.25rem;
}

.right {
  margin-left: auto;
}

.img {
  margin-top: -4px;
}

.bar {
  width: 100%;
  height: 6px;
  border-radius: 6px;
  background-color: #e6e6e6;
  overflow: hidden;
}

.bar-value {
  height: 100%;
  background-color: #42b983;
}

.bar-comp {
  background-color: #ff9baf;
}
</style>
