<template functional>
  <div class="wrap">
    <div>
      コンプ率
      {{
        props.totalValue !== 0
          ? (
              (Math.floor((props.value / props.totalValue) * 1000) / 1000) *
              100
            ).toFixed(1)
          : "0.0"
      }}%
    </div>
    <div class="right">
      {{ props.value }}
    </div>
    <div class="sla">/</div>
    <div>{{ props.totalValue }}</div>
    <div class="bar">
      <div
        class="bar-value"
        :style="
          props.totalValue !== 0
            ? 'width: ' + (props.value / props.totalValue) * 100 + '%'
            : 'width: 0'
        "
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CollectedBar",
  props: ["value", "totalValue"]
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
</style>
