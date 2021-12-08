<template>
  <Card title="設定">
    <div class="switch">
      <VSwitch
        :checked="settings.isDarkTheme"
        @change="onChange('isDarkTheme', $event)"
      >
        ダークモード
      </VSwitch>
      <VSwitch
        :checked="settings.isFullMode"
        @change="onChange('isFullMode', $event)"
      >
        フルコンプモード（すべてのカラバリを表示）
      </VSwitch>
      <div style="text-align: center">
      <Button sm dropdown @click="isOpenFullMode = !isOpenFullMode">フルコンプモードについて</Button>
      </div>
      <div class="desc" v-show="isOpenFullMode">
        <p>
          ガチコンプでは、DIY
          で作るアイテムと購入可能なアイテムについて、リメイクキットで作れるカラバリは非表示になっています。このモードを
          ON
          にすると、これらの非表示になっているカラバリが表示されるようになります。
        </p>
        <img
          src="../assets/doc_fullmode.png"
          style="width: 100%; margin-bottom: 1rem"
        />
        <p>
          <span style="font-weight: bold"
            >ただし、追加されるカラバリはご自身の編集画面にのみ表示され、他の人にシェアすることはできません。</span
          >シェア時に自動生成されるツイート文の取得数などの計算に含まれず、相手から見たシェア画面にもこれらのカラバリは表示されません。また、欲しいもの管理や在庫管理の対象外です。カタログのフルコンプを目指す方に向けたチェック用のモードとしてご活用ください。
        </p>
      </div>
    </div>
  </Card>
</template>

<script>
import Card from "../components/Card";
import VSwitch from "../components/VSwitch";
import Button from "../components/Button";

export default {
  components: {
    Card,
    VSwitch,
    Button,
  },
  props: {
    settings: Object,
  },
  data() {
    return {
      isOpenFullMode: false
    }
  },
  methods: {
    onChange(key, value) {
      const obj = {};
      obj[key] = value;
      const newSetting = Object.assign(this.settings, obj);
      this.$emit("change", newSetting);
    },
  },
};
</script>

<style lang="scss" scoped>
.desc {
  margin-top: 1rem;
  padding-left: 1rem;
  font-size: 12px;
}
</style>
