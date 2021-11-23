<template>
  <div>
    <div v-if="itemImage" class="info-image">
      <img :src="itemImage" class="info-image-img" />
      <img
        class="info-image-recipe"
        src="https://i0.wp.com/acnhcdn.com/latest/MenuIcon/PaperRecipe.png"
        v-if="modalItem.sourceSheet === 'Recipes'"
      />
    </div>
    <div
      v-if="isShowWishlistButton"
      style="text-align: center; margin-bottom: 1rem"
    >
      <Button v-if="!isInWishlist" xs primary @click="onClickWishButton('add')">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            d="M12 4.248c-3.148-5.402-12-3.825-12 2.944 0 4.661 5.571 9.427 12 15.808 6.43-6.381 12-11.147 12-15.808 0-6.792-8.875-8.306-12-2.944z"
          />
        </svg>
        欲しいものリストに追加
      </Button>
      <Button v-else xs danger @click="onClickWishButton('remove')">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            d="M12 4.248c-3.148-5.402-12-3.825-12 2.944 0 4.661 5.571 9.427 12 15.808 6.43-6.381 12-11.147 12-15.808 0-6.792-8.875-8.306-12-2.944z"
          />
        </svg>
        欲しいものリストから削除
      </Button>
      <Button xs @click="onClickWishModeButton" style="margin-top: 1rem">
        <template v-if="!isWishlistMode">
          欲しいもの一括チェックモードを ON
        </template>
        <template v-else> 欲しいもの一括チェックモードを OFF </template>
      </Button>
    </div>
    <div class="info" v-if="modalItem.buy || modalItem.sell">
      <div class="info-label info-buy">買値</div>
      <div class="info-text">
        {{
          modalItem.buy
            ? modalItem.buy === -1
              ? "非売品"
              : `${modalItem.buy}ベル`
            : "－"
        }}
        <template
          v-if="
            modalItem.exchangeCurrency === 'Poki' && modalItem.exchangePrice
          "
        >
          , {{ modalItem.exchangePrice }}ポキ
        </template>
      </div>
    </div>
    <div class="info" v-if="modalItem.buy || modalItem.sell">
      <div class="info-label info-sell">売値</div>
      <div class="info-text">
        {{ modalItem.sell ? `${modalItem.sell}ベル` : "－" }}
      </div>
    </div>
    <div class="info" v-if="modalItem.customizeVariants">
      <div class="info-label info-remake">
        リメイク
        <div class="info-label-sub">（{{ modalItem.bodyTitle }}）</div>
      </div>
      <div class="info-text info-text-btns">
        <Button
          xs
          @click="$emit('updateModalBodyIndex', index)"
          v-for="(variant, index) in modalItem.customizeVariants"
          :key="modalItem.customizeVariants[index]"
          class="info-btn"
          :class="{ active: index === modalBodyIndex }"
        >
          {{ variant }}
        </Button>
      </div>
    </div>
    <div class="info" v-if="modalItem.bodyVariants">
      <div class="info-label info-remake">
        <div
          class="info-label-mini"
          v-if="
            !modalItem.bodyCustomize &&
            !modalItem.customize &&
            modalItem.cyrusCustomizePrice
          "
        >
          カイゾーのみ
        </div>
        リメイク
        <div class="info-label-sub">（{{ modalItem.bodyTitle }}）</div>
      </div>
      <div class="info-text info-text-btns">
        <Button
          xs
          @click="$emit('updateModalBodyIndex', index)"
          v-for="(variant, index) in modalItem.bodyVariants"
          :key="modalItem.bodyVariants[index]"
          class="info-btn"
          :class="{ active: index === modalBodyIndex }"
        >
          {{ variant }}
        </Button>
      </div>
    </div>
    <div class="info" v-if="modalItem.patternCustomize">
      <div class="info-label info-remake">
        リメイク
        <div class="info-label-sub">（{{ modalItem.patternTitle }}）</div>
      </div>
      <div class="info-text info-text-btns">
        <Button
          xs
          @click="$emit('updateModalPatternIndex', index)"
          v-for="(variant, index) in modalItem.patternVariants"
          :key="modalItem.patternVariants[index]"
          class="info-btn"
          :class="{ active: index === modalPatternIndex }"
        >
          {{ variant }}
        </Button>
      </div>
    </div>
    <div class="info" v-if="modalItem.sourceJa">
      <div class="info-label info-source">入手</div>
      <div class="info-text">
        <template v-if="modalItem.sourceJa">
          {{ modalItem.sourceJa.join("、") }}
        </template>
      </div>
    </div>
    <div class="info" v-if="modalItem.sourceNotesJa">
      <div class="info-label info-source-note">入手メモ</div>
      <div class="info-text">{{ modalItem.sourceNotesJa }}</div>
    </div>
    <div class="info" v-if="modalItem.seasonEventJa">
      <div class="info-label info-source-note">入手時期</div>
      <div class="info-text">{{ modalItem.seasonEventJa }}</div>
    </div>
    <div class="info" v-if="modalItem.activeMonths">
      <div class="info-label info-source-note">時期</div>
      <div class="info-text" v-html="infoActiveMonths" />
    </div>
    <div class="info" v-if="modalItem.activeMonths">
      <div class="info-label info-source-note">時間帯</div>
      <div class="info-text" v-html="infoActiveTimes" />
    </div>
    <div class="info" v-if="modalItem.weather">
      <div class="info-label info-source-note">天候</div>
      <div class="info-text">{{ modalItem.weatherJa }}</div>
    </div>
    <div class="info" v-if="modalItem.whereHow">
      <div class="info-label info-source-note">場所</div>
      <div class="info-text">{{ modalItem.whereHowJa }}</div>
    </div>
    <div class="info" v-if="modalItem.shadow">
      <div class="info-label info-source-note">魚影</div>
      <div class="info-text">{{ modalItem.shadowJa }}</div>
    </div>
    <div class="info" v-if="modalItem.achievementDescription">
      <div class="info-label info-source-note">説明</div>
      <div class="info-text">{{ modalItem.achievementDescription }}</div>
    </div>
    <div
      class="info"
      v-if="
        modalItem.exchangeCurrency === 'Nook Points' && modalItem.exchangePrice
      "
    >
      <div class="info-label info-source-note">タヌポイント</div>
      <div class="info-text">{{ modalItem.exchangePrice }}</div>
    </div>
    <div class="info" v-if="modalItem.materialsJa">
      <div class="info-label info-other">素材</div>
      <div class="info-materials">
        <div
          class="info-material"
          v-for="(material, index) in modalItem.materialsJa"
          :key="`${modalItem.name}Material${index}`"
        >
          <img :src="materialImage(index)" class="info-image-material" />
          {{ material.name }} x {{ material.num }}
        </div>
      </div>
    </div>
    <div class="info" v-if="modalItem.personality">
      <div class="info-label info-other">性格</div>
      <div class="info-text">{{ modalItem.personality }}</div>
    </div>
    <div class="info" v-if="modalItem.birthday">
      <div class="info-label info-other">誕生日</div>
      <div class="info-text">{{ modalItem.birthday }}</div>
    </div>
    <div
      class="info"
      v-if="
        modalItem.variants &&
        modalItem.variants.length > 0 &&
        modalItem.variants[0].request
      "
    >
      <div class="info-label info-other">テーマ</div>
      <div class="info-text">{{ modalItem.variants[0].request }}</div>
    </div>
    <div class="info" v-if="modalItem.versionAdded">
      <div class="info-label info-other">追加されたバージョン</div>
      <div class="info-text">{{ modalItem.versionAdded }}</div>
    </div>
  </div>
</template>

<script>
import Button from "../components/Button";
import stampUrls from "../mixins/stampUrls";
import { isInWishlist } from "../utils/utils";

export default {
  components: { Button },
  mixins: [stampUrls],
  props: {
    modalItem: Object,
    modalBodyIndex: Number,
    modalPatternIndex: Number,
    isShowWishlistButton: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    itemImage() {
      const variants = this.modalItem.variants;
      let image = "";
      if (variants) {
        if (variants[0].stampImage) {
          return this.stampUrls[variants[this.modalBodyIndex].stampImage];
        } else {
          image =
            variants[
              // DIY家具、しゃしん、道具はバリエーションが1に固定されており、
              // variants.lengthを超えてエラーになるためMath.min()で対策
              Math.min(this.modalBodyIndex, this.modalItem.variants.length - 1)
            ].image ||
            variants[this.modalBodyIndex].storageImage ||
            variants[this.modalBodyIndex].albumImage ||
            variants[this.modalBodyIndex].inventoryImage;
          if (this.modalBodyIndex > 0 || this.modalPatternIndex > 0) {
            image = image.replace(
              /(.+Remake)_\d_\d\.png$/,
              "$1_" +
                this.modalBodyIndex +
                "_" +
                this.modalPatternIndex +
                ".png"
            );
          }
        }
      } else if (
        this.modalItem.sourceSheet === "Recipes" ||
        this.modalItem.sourceSheet === "Reactions"
      ) {
        image = this.modalItem.image;
      } else if (this.modalItem.iconImage) {
        image = this.modalItem.iconImage;
      } else {
        return "";
      }
      return "https://acnhcdn.com/latest/" + image;
    },
    isInWishlist() {
      return isInWishlist(this.modalItem, this.modalBodyIndex);
    },
    isWishlistMode() {
      return this.$store.getters.isWishlistMode;
    },
    materialImage() {
      return function (index) {
        return (
          "https://acnhcdn.com/latest/" +
          this.modalItem.materialsJa[index].image
        );
      };
    },
    infoActiveMonths() {
      const item = this.modalItem;
      if (!item.activeMonths) {
        return null;
      } else if (item.activeMonths.northern.length === 12) {
        return "一年中";
      } else {
        const north = item.activeMonths.northern
          .map((month) => month.month)
          .join(", ");
        const south = item.activeMonths.southern
          .map((month) => month.month)
          .join(", ");
        return `北半球: ${north}月<br>南半球: ${south}月`;
      }
    },
    infoActiveTimes() {
      const item = this.modalItem;
      if (!item.activeMonths) {
        return null;
      } else if (item.activeMonths.northern[0].isAllDay) {
        return "１日中";
      } else {
        const from1 = item.activeMonths.northern[0].activeHours[0][0];
        const to1 = item.activeMonths.northern[0].activeHours[0][1];
        if (item.activeMonths.northern[0].activeHours[1]) {
          const from2 = item.activeMonths.northern[0].activeHours[1][0];
          const to2 = item.activeMonths.northern[0].activeHours[1][1];
          return `${from1}〜${to1}時<br>${from2}〜${to2}時`;
        } else {
          return `${from1}〜${to1}時`;
        }
      }
    },
  },
  methods: {
    onClickWishButton(type) {
      const item = this.modalItem;
      const itemKey = item.uniqueEntryId || item.name;
      const entryId = item.variants
        ? `${itemKey}_${this.modalBodyIndex}`
        : itemKey;

      this.$store.commit(`${type}Wishlist`, entryId);
      this.$emit("updateWishlist");
    },
    onClickWishModeButton() {
      this.$store.commit("toggleWishlistMode");
      this.$emit("updateWishlist");
    },
  },
};
</script>

<style lang="scss" scoped>
.info {
  display: flex;
  margin-bottom: 0.5rem;
  font-size: 15px;
}

.info-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0.2rem;
  width: 80px;
  border-radius: 4px;
  color: #fff;
  font-weight: 700;
  text-align: center;
}

.info-label-sub {
  font-size: 12px;
}

.info-label-mini {
  font-size: 11px;
  font-weight: 400;
}

.info-buy {
  background-color: #ec407a;
}

.info-sell {
  background-color: #1e88e5;
}

.info-source {
  background-color: #ab47bc;
}

.info-source-note {
  background-color: #7e57c2;
}

.info-remake {
  background-color: #ff7626;
}

.info-other {
  background-color: #888;
}

.info-text {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 0.2rem 0.4rem;
}

.info-materials {
  padding: 0.2rem 0.4rem;
}

.info-material {
  display: flex;
}

.info-text-btns {
  padding: 0 0.2rem;
}

.info-btn {
  margin: 0.2rem;

  &.active {
    background-color: #ffc79f;
  }
}

.info-image {
  position: relative;
  width: 96px;
  height: 96px;
  margin: -1rem auto 20px;
}

.info-image-img {
  width: 100%;
  height: 100%;
}

.info-image-recipe {
  position: absolute;
  bottom: -10px;
  right: -20px;
  width: 62px;
  height: 62px;
}

.info-image-material {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  margin-left: -4px;
  margin-top: -4px;
  pointer-events: none;
  user-select: none;
}
</style>
