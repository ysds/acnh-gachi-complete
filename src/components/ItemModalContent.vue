<template>
  <div>
    <div
      class="info"
      v-if="modalItem.buy || (modalItem.variants && modalItem.variants[0].buy)"
    >
      <div class="info-label info-1">買値</div>
      <div class="info-text">
        <template v-if="modalItem.buy">
          {{ getBuy(modalItem.buy) }}
        </template>
        <template v-else-if="modalItem.variants">
          {{ getBuy(modalItem.variants[0].buy) }}
        </template>
      </div>
    </div>
    <div
      class="info"
      v-if="
        modalItem.sell || (modalItem.variants && modalItem.variants[0].sell)
      "
    >
      <div class="info-label info-2">売値</div>
      <div class="info-text">
        <template v-if="modalItem.sell">
          {{ modalItem.sell }}
        </template>
        <template v-else-if="modalItem.variants">
          {{ modalItem.variants[0].sell }}
        </template>
      </div>
    </div>
    <div class="info" v-if="modalItem.customize">
      <div class="info-label info-5">
        リメイク
      </div>
      <div class="info-text">
        {{ modalItem.customizeVariants.join("、") }}
      </div>
    </div>
    <div class="info" v-if="modalItem.bodyCustomize">
      <div class="info-label info-5">
        リメイク<template v-if="modalItem.patternCustomize">1</template>
      </div>
      <div class="info-text">
        {{ modalItem.bodyVariants.join("、") }}
      </div>
    </div>
    <div class="info" v-if="modalItem.patternCustomize">
      <div class="info-label info-5">
        リメイク<template v-if="modalItem.bodyCustomize">2</template>
      </div>
      <div class="info-text">
        {{ modalItem.patternVariants.join("、") }}
      </div>
    </div>
    <div class="info" v-if="modalItem.sourceJa || modalItem.variants">
      <div class="info-label info-3">入手</div>
      <div class="info-text">
        <template v-if="modalItem.sourceJa">
          {{ modalItem.sourceJa.join("、") }}
        </template>
        <template
          v-else-if="modalItem.variants && modalItem.variants[0].sourceJa"
        >
          {{ modalItem.variants[0].sourceJa.join("、") }}
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
        </template>
      </div>
    </div>
    <div class="info" v-if="modalItem.activeMonths">
      <div class="info-label info-4">時間帯</div>
      <div class="info-text">
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
  </div>
</template>

<script>
export default {
  props: ["modalItem"],
  methods: {
    getBuy(value) {
      if (value === -1 || value === null) return "非売品";
      return value;
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
  padding: 0.2rem;
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
}
</style>
