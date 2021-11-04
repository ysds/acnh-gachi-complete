<template>
  <Card title="V2のアイテム表示">
    <div class="switch">
      <VSwitch :checked="isShowV2" @change="onChange">
        V2のアイテムを表示する
      </VSwitch>
    </div>
  </Card>
</template>

<script>
import Card from "../components/Card";
import VSwitch from "../components/VSwitch";

export default {
  components: {
    Card,
    VSwitch,
  },
  props: {
    isShowV2: Boolean,
  },
  methods: {
    onChange(value) {
      this.$emit("change", value)
    },
  },
};
</script>
