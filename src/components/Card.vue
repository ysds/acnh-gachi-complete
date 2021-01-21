<template functional>
  <div class="card">
    <div class="card-header">
      <div class="card-title">{{ props.title }}</div>
      <slot name="action" />
    </div>
    <div class="card-body">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String
  }
};
</script>

<style lang="scss" scoped>
.card {
  margin-bottom: 1rem;
  text-align: left;
  background-color: #fff;
  border: 1px solid #d6d6d6;
  border-radius: 8px;
}

.card-header {
  display: flex;
  padding: 1rem 1rem 0;
  align-items: center;
}

.card-title {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem 1rem;
  color: #fff;
  font-weight: 700;
  background-color: #ec407a;
  border-radius: 4px;
}

.card-action {
  margin-left: auto;
}

.card-body {
  padding: 1rem;
}
</style>
