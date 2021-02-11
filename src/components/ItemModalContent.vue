<template>
  <div>
    <div style="display: flex;">
      <div>
        <div class="info" v-if="modalItem.buy || modalItem.sell">
          <div class="info-label info-1">買値</div>
          <div class="info-text">
            {{
              modalItem.buy
                ? modalItem.buy === -1
                  ? "非売品"
                  : modalItem.buy
                : "－"
            }}
          </div>
        </div>
        <div class="info" v-if="modalItem.buy || modalItem.sell">
          <div class="info-label info-2">売値</div>
          <div class="info-text">
            {{ modalItem.sell ? modalItem.sell : "－" }}
          </div>
        </div>
      </div>
      <div v-if="bodyVariantImage" id="info-image">
        <div style="position:relative">
          <img v-bind:src="bodyVariantImage" />
          <img
            class="t-img-recipe"
            src="https://i0.wp.com/acnhcdn.com/latest/MenuIcon/PaperRecipe.png"
            v-if="modalItem.sourceSheet === 'Recipes'"
          />
        </div>
      </div>
    </div>
    <div class="info" v-if="modalItem.customize">
      <div class="info-label info-5">
        リメイク
      </div>
      <div class="info-text">
        <Button
          sm
          @click="bodyVariantIndex = index"
          v-for="(variant, index) in modalItem.customizeVariants"
          :key="modalItem.customizeVariants[index]"
          :class="{ active: index === bodyVariantIndex }"
        >
          {{ variant }}
        </Button>
      </div>
    </div>
    <div class="info" v-if="modalItem.bodyCustomize">
      <div class="info-label info-5">
        リメイク<template v-if="modalItem.patternCustomize">1</template>
      </div>
      <div class="info-text">
        <Button
          sm
          @click="bodyVariantIndex = index"
          v-for="(variant, index) in modalItem.bodyVariants"
          :key="modalItem.bodyVariants[index]"
          :class="{ active: index === bodyVariantIndex }"
        >
          {{ variant }}
        </Button>
      </div>
    </div>
    <div class="info" v-if="modalItem.patternCustomize">
      <div class="info-label info-5">
        リメイク<template v-if="modalItem.bodyCustomize">2</template>
      </div>
      <div class="info-text">
        <Button
          sm
          @click="patternVariantIndex = index"
          v-for="(variant, index) in modalItem.patternVariants"
          :key="modalItem.patternVariants[index]"
          :class="{ active: index === patternVariantIndex }"
        >
          {{ variant }}
        </Button>
      </div>
    </div>
    <div class="info" v-if="modalItem.sourceJa">
      <div class="info-label info-3">入手</div>
      <div class="info-text">
        <template v-if="modalItem.sourceJa">
          {{ modalItem.sourceJa.join("、") }}
        </template>
      </div>
    </div>
    <div class="info" v-if="modalItem.sourceNotesJa">
      <div class="info-label info-4">入手メモ</div>
      <div class="info-text">{{ modalItem.sourceNotesJa }}</div>
    </div>
    <div class="info" v-if="modalItem.seasonEventJa">
      <div class="info-label info-4">入手時期</div>
      <div class="info-text">{{ modalItem.seasonEventJa }}</div>
    </div>
    <div class="info" v-if="modalItem.activeMonths">
      <div class="info-label info-4">時期</div>
      <div class="info-text">
        <template v-if="modalItem.activeMonths.northern.length === 12">
          １年中
        </template>
        <template v-else>
          <span>
            北半球:
            <span
              v-for="month in modalItem.activeMonths.northern"
              :key="`${modalItem.name}Northern${month.month}`"
            >
              {{ month.month }} </span
            >月<br />
            南半球:
            <span
              v-for="month in modalItem.activeMonths.southern"
              :key="`${modalItem.name}Southern${month.month}`"
            >
              {{ month.month }} </span
            >月
          </span>
        </template>
      </div>
    </div>
    <div class="info" v-if="modalItem.activeMonths">
      <div class="info-label info-4">時間帯</div>
      <div class="info-text">
        <span>
          <template v-if="modalItem.activeMonths.northern[0].isAllDay">
            １日中
          </template>
          <template v-else>
            {{ modalItem.activeMonths.northern[0].activeHours[0][0] }} -
            {{ modalItem.activeMonths.northern[0].activeHours[0][1] }}時
            <template v-if="modalItem.activeMonths.northern[0].activeHours[1]"
              ><br />
              {{ modalItem.activeMonths.northern[0].activeHours[1][0] }} -
              {{ modalItem.activeMonths.northern[0].activeHours[1][1] }}時
            </template>
          </template>
        </span>
      </div>
    </div>
    <div class="info" v-if="modalItem.weather">
      <div class="info-label info-4">天候</div>
      <div class="info-text">{{ modalItem.weatherJa }}</div>
    </div>
    <div class="info" v-if="modalItem.whereHow">
      <div class="info-label info-4">場所</div>
      <div class="info-text">{{ modalItem.whereHowJa }}</div>
    </div>
    <div class="info" v-if="modalItem.shadow">
      <div class="info-label info-4">魚影</div>
      <div class="info-text">{{ modalItem.shadowJa }}</div>
    </div>
    <div class="info" v-if="modalItem.achievementDescription">
      <div class="info-label info-4">説明</div>
      <div class="info-text">{{ modalItem.achievementDescription }}</div>
    </div>
  </div>
</template>

<script>
import Button from "../components/Button";

export default {
  components: { Button },
  props: {
    modalItem: Object,
    modalBodyIndex: Number
  },
  data() {
    return {
      bodyVariantIndex: 0,
      patternVariantIndex: 0
    };
  },
  watch: {
    modalItem: function() {
      this.bodyVariantIndex = this.modalBodyIndex;
      this.patternVariantIndex = 0;
    }
  },
  computed: {
    bodyVariantImage() {
      if (this.modalItem.buy || this.modalItem.sell) {
        let image = "";
        if (this.modalItem.variants) {
          image =
            this.modalItem.variants[
              // DIY家具、しゃしん、道具はバリエーションが1に固定されており、
              // variants.lengthを超えてエラーになるためMath.min()で対策
              Math.min(
                this.bodyVariantIndex,
                this.modalItem.variants.length - 1
              )
            ].image ||
            this.modalItem.variants[this.bodyVariantIndex].storageImage ||
            this.modalItem.variants[this.bodyVariantIndex].albumImage ||
            this.modalItem.variants[this.bodyVariantIndex].inventoryImage;
          if (this.bodyVariantIndex > 0 || this.patternVariantIndex > 0) {
            image = image.replace(
              /(.+Remake)_\d_\d\.png$/,
              "$1_" +
                this.bodyVariantIndex +
                "_" +
                this.patternVariantIndex +
                ".png"
            );
          }
        } else if (this.modalItem.sourceSheet === "Recipes") {
          image = this.modalItem.image;
        } else if (this.modalItem.iconImage) {
          image = this.modalItem.iconImage;
        }
        return "https://acnhcdn.com/latest/" + image;
      } else {
        return "";
      }
    }
  }
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
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  flex-shrink: 0;
  padding: 0.6rem 0.2rem;
  width: 80px;
  border-radius: 4px;
  color: #fff;
  font-weight: 700;
  text-align: center;
}

.info-1 {
  background-color: #ec407a;
}

.info-2 {
  background-color: #1e88e5;
}

.info-3 {
  background-color: #ab47bc;
}

.info-4 {
  background-color: #7e57c2;
}

.info-5 {
  background-color: #ff7626;
}

.info-text {
  padding: 0.2rem 0.4rem;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.info-text button.active {
  background-color: #ff9baf;
}

.info-text button {
  margin: 0.2em;
}

#info-image {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
}

#info-image img {
  width: 96px;
  height: 96px;
  pointer-events: none;
  user-select: none;
  -webkit-touch-callout: none;
}

#info-image img.t-img-recipe {
  position: absolute;
  bottom: -10px;
  right: -20px;
  width: 62px;
  height: 62px;
  pointer-events: none;
  user-select: none;
  -webkit-touch-callout: none;
}
</style>
