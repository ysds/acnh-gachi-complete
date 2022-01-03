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
          <p style="word-break: break-all">
            公開ページの URL<br />
            <router-link :to="`/share2/${activeNav}/?uid=${user.uid}`">
              {{ shareURL }}
            </router-link>
          </p>
          <p>URL をクリップボードにコピーしました。</p>
          <div>
            <Button
              cta
              :href="`https://twitter.com/intent/tweet?text=${tweetString}%0a%0a${tweetURL}%0a%0a${tweetTags}`"
            >
              Twitter に投稿する
            </Button>
          </div>
          <div class="note" v-if="isFullMode">
            ※フルコンプモードでのみ表示されるカラバリは、相手の画面には表示されず、自動生成されるツイート文の取得数などの計算には含まれません。
          </div>
        </div>
      </Modal>
    </portal>
  </div>
</template>

<script>
import {
  totalLength,
  collectedLength,
  providableLength,
} from "../utils/filterItems.js";
import { getNavText } from "../utils/navs";
import { syncData } from "../utils/db.js";
import { percentage } from "../utils/utils";
import Button from "./Button";
import Modal from "./Modal";

export default {
  components: {
    Button,
    Modal,
  },
  data() {
    return {
      isShowShareModal: false,
      shareURL: "",
      tweetString: "",
      tweetURL: "",
      tweetTags: "",
    };
  },
  computed: {
    activeNav() {
      return this.$store.getters.activeNav;
    },
    collected() {
      return this.$store.getters.localCollectedData;
    },
    user() {
      return this.$store.getters.user;
    },
    navText() {
      return getNavText(this.activeNav);
    },
    wishlist() {
      return this.$store.getters.wishlist;
    },
    partnerlist() {
      return this.$store.getters.partnerlist;
    },
    isFullMode() {
      return this.$store.getters.settings.isFullMode;
    },
  },
  methods: {
    showShareModal() {
      syncData();
      const shareURL = `https://ysds.github.io/acnh-gachi-complete/share2/${this.activeNav}/?uid=${this.user.uid}`;
      this.shareURL = shareURL;
      this.initTweetString();
      this.initTweetTags();
      this.tweetURL = `https://ysds.github.io/acnh-gachi-complete/share2/${this.activeNav}/?uid=${this.user.uid}`;
      this.$copyText(shareURL);
      this.isShowShareModal = true;
    },
    initTweetString() {
      const _totalLength = totalLength({
        nav: this.activeNav,
        typeFilter: "all",
        isForceLess: true,
        isFullMode: this.isFullMode,
        partnerlist: this.partnerlist,
      });
      const _collectedLength = collectedLength({
        collected: Object.assign({}, this.collected),
        nav: this.activeNav,
        typeFilter: "all",
        isForceLess: true,
        isFullMode: this.isFullMode,
        partnerlist: this.partnerlist,
      });
      const _providableLength = providableLength({
        collected: Object.assign({}, this.collected),
        nav: this.activeNav,
        typeFilter: "all",
        isForceLess: true,
        isFullMode: this.isFullMode,
        partnerlist: this.partnerlist,
      });
      this.tweetString = `あつ森ガチコンプ『${this.navText}』チェッカー`;
      if (this.activeNav === "exchange") {
        const wishlistLength = this.wishlist.length;
        this.tweetString += `%0a%0a欲しいもの：${wishlistLength}%0a`;
      } else {
        this.tweetString += `（全${_totalLength}種）%0a%0a取得済：${_collectedLength}（${percentage(
          _collectedLength,
          _totalLength
        )}25）%0a`;
      }
      this.tweetString += `配布可：${_providableLength}`;
    },
    initTweetTags() {
      this.tweetTags = "%23あつ森%0a%23ガチコンプ";
      const nav = this.activeNav;
      if (nav === "recipes") {
        this.tweetTags += "%0a%23あつ森交換%0a%23レシピ交換";
      } else if (nav === "photos") {
        this.tweetTags += "%0a%23あつ森交換%0a%23写真交換";
      } else if (nav === "posters") {
        this.tweetTags += "%0a%23あつ森交換%0a%23ポスター交換";
      } else if (nav.indexOf("housewares") > -1) {
        this.tweetTags += "%0a%23あつ森おさわり%0a%23あつ森交換%0a%23家具交換";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  display: inline-block;
}

.bi-reply {
  transform: scale(-1, 1);
}

.note {
  font-size: 12px;
  margin: 1rem;
}
</style>
