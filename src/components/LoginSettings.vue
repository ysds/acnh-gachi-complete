<template>
  <Card title="設定">
    <div class="switch">
      <VSwitch :checked="settings.theme" @change="onChange('isDarkTheme', $event)">
        ダークモード
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
    settings: Object,
  },
  methods: {
    onChange(key, value) {
      const obj = {};
      obj[key] = value;
      const newSetting = Object.assign(this.settings, obj)
      this.$emit("change", newSetting);
    },
  },
};
</script>
