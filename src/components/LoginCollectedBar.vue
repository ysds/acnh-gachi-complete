<template functional>
  <div class="bar" :class="{ all: props.isAll }">
    <div class="left">
      {{ props.text }}
    </div>
    <div class="right">
      {{ props.value }} /
      {{ props.totalValue }}
      ({{
        props.totalValue !== 0
          ? (
              (Math.floor((props.value / props.totalValue) * 1000) / 1000) *
              100
            ).toFixed(1)
          : "0.0"
      }}%)
    </div>
    <div
      class="bar-value"
      :style="
        props.totalValue !== 0
          ? 'width: ' + (props.value / props.totalValue) * 100 + '%'
          : 'width: 0'
      "
    />
  </div>
</template>

<script>
export default {
  prop: {
    text: "",
    value: 0,
    totalValue: 0,
    isAll: false
  }
};
</script>

<style lang="scss" scoped>
.bar {
  position: relative;
  display: flex;
  align-items: center;
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

.bar-value {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  background-color: #42b983;
}
</style>
