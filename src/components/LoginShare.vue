<template>
  <div>
    <div style="text-align: center;">
      <Button
        v-if="!isOpen"
        @click="isOpen = !isOpen"
        :class="{ active: isOpen }"
      >
        一括公開するカテゴリの設定
      </Button>
      <div v-else style="margin-bottom: .5rem;">
        <div>
          <Button secondary form @click="cancel">
            キャンセル
          </Button>
          <Button primary form @click="save" style="margin-left: 1rem;">
            保存
          </Button>
        </div>
        <p class="message">変更を反映するには保存を押してください。</p>
      </div>
    </div>

    <div v-show="isOpen">
      <div class="group" v-for="nav in navs" :key="nav.id">
        <template v-if="nav.subnavs">
          <div class="switch" v-for="subnav in nav.subnavs" :key="subnav.id">
            <VSwitch :id="subnav.id" :value="subnav.id" v-model="checks">
              {{ subnav.text }}
            </VSwitch>
          </div>
        </template>
        <div v-else class="switch">
          <VSwitch :key="nav.id" :id="nav.id" :value="nav.id" v-model="checks">
            {{ nav.text }}
          </VSwitch>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "../plugins/firebase";
import { navs } from "../utils/nav.js";

import VSwitch from "../components/VSwitch";
import Button from "../components/Button";

const db = firebase.firestore();

export default {
  name: "LoginShare",
  components: {
    VSwitch,
    Button
  },
  data() {
    return {
      navs: navs,
      isOpen: false,
      checks: []
    };
  },
  computed: {
    shareCategories() {
      return this.$store.getters.shareCategories;
    },
    user() {
      return this.$store.getters.user;
    }
  },
  mounted() {
    this.checks = this.shareCategories.slice();
  },
  methods: {
    save() {
      db.collection("users")
        .doc(this.user.uid)
        .update({
          shareCategories: this.checks
        });
      this.$store.commit("updateShareCategories", this.checks);
      this.isOpen = false;
    },
    cancel() {
      this.checks = this.shareCategories.slice();
      this.isOpen = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.group:not(:last-child) {
  border-bottom: 3px solid #ccc;
}

.switch:not(:last-child) {
  border-bottom: 1px solid #ddd;
}

.flat-btn {
  color: #42b983;
  height: auto;
  min-height: auto;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  line-height: 1.5;
  margin-bottom: 1rem;

  &.active svg {
    transform: rotate(180deg);
  }
}

.message {
  font-size: 14px;
  color: #ec407a;
  margin-top: 1rem;
}
</style>
