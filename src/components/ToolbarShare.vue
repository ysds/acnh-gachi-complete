<template>
  <div class="wrapper">
    <Button sm @click="showShareModal">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-reply"
        viewBox="0 0 16 16"
        style="margin-top: -5px"
      >
        <path
          d="M6.598 5.013a.144.144 0 0 1 .202.134V6.3a.5.5 0 0 0 .5.5c.667 0 2.013.005 3.3.822.984.624 1.99 1.76 2.595 3.876-1.02-.983-2.185-1.516-3.205-1.799a8.74 8.74 0 0 0-1.921-.306 7.404 7.404 0 0 0-.798.008h-.013l-.005.001h-.001L7.3 9.9l-.05-.498a.5.5 0 0 0-.45.498v1.153c0 .108-.11.176-.202.134L2.614 8.254a.503.503 0 0 0-.042-.028.147.147 0 0 1 0-.252.499.499 0 0 0 .042-.028l3.984-2.933zM7.8 10.386c.068 0 .143.003.223.006.434.02 1.034.086 1.7.271 1.326.368 2.896 1.202 3.94 3.08a.5.5 0 0 0 .933-.305c-.464-3.71-1.886-5.662-3.46-6.66-1.245-.79-2.527-.942-3.336-.971v-.66a1.144 1.144 0 0 0-1.767-.96l-3.994 2.94a1.147 1.147 0 0 0 0 1.946l3.994 2.94a1.144 1.144 0 0 0 1.767-.96v-.667z"
        />
      </svg>
      シェア
    </Button>
    <portal to="shareModal">
      <Modal :show="isShowShareModal" @close="isShowShareModal = false">
        <template slot="header">{{ navText }}のコンプ状況をシェア</template>
        <div slot="body">
          <p style="word-break: break-all;">
            公開ページの URL<br />
            <router-link :to="`/share2/${activeNav}/?uid=${user.uid}`">
              {{ shareURL }}
            </router-link>
          </p>
          <p>URL をクリップボードにコピーしました。</p>
          <div>
            <Button
              cta
              :href="
                `https://twitter.com/intent/tweet?text=${navText}%0a${twitterURL}%0a%0a%23あつ森ガチコンプ`
              "
            >
              Twitter に投稿する
            </Button>
          </div>
        </div>
      </Modal>
    </portal>
  </div>
</template>

<script>
import { getNavText } from "../utils/nav.js";
import { syncCollectedData } from "../utils/db.js";
import Button from "./Button";
import Modal from "./Modal";

export default {
  components: {
    Button,
    Modal
  },
  data() {
    return {
      isShowShareModal: false,
      shareURL: "",
      twitterURL: ""
    };
  },
  computed: {
    activeNav() {
      return this.$store.getters.activeNav;
    },
    user() {
      return this.$store.getters.user;
    },
    navText() {
      return getNavText(this.activeNav);
    }
  },
  methods: {
    showShareModal() {
      syncCollectedData();
      const shareURL = `https://ysds.github.io/acnh-gachi-complete/share2/${this.activeNav}/?uid=${this.user.uid}`;
      this.shareURL = shareURL;
      this.twitterURL = `https://ysds.github.io/acnh-gachi-complete/share2/${this.activeNav}/?uid=${this.user.uid}`;
      this.$copyText(shareURL);
      this.isShowShareModal = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  display: inline-block;
}

.bi-reply {
  transform: scale(-1, 1);
}
</style>
