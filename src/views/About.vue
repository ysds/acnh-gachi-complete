<template>
  <div class="about">
    <div class="close">
      <CloseButton @click="$router.push('/')" />
    </div>
    <img class="logo" src="../assets/logo.svg" />
    <h1>あつ森ガチコンプについて</h1>
    <p>
      このアプリは、あつ森の家具などの取得状況を管理できるウェブアプリです。カタログの一覧だけでなく、来訪者やシーズンイベントなどでも絞り込むことができるため、周回にも活用いただけます。
    </p>
    <h2>対象アイテム</h2>
    <p>
      あつ森のアイテムコンプを目指すことを目的にしていますが、素材や消費アイテム、リメイクによるバリエーションは対象から外しています。
    </p>
    <h2>チェック状態</h2>
    <div class="section-check">
      <img class="img" src="../assets/doc_check_status.png" />
      <div class="check-status">
        <span class="check-state">未取得</span>
        <span class="check-state">取得済</span>
        <span class="check-state">配布可</span>
      </div>
    </div>
    <h2>カテゴリとチェック状態の同期</h2>
    <p>
      同じアイテムが異なるカテゴリで表示されることがありますが、それぞれのチェック状態は同期しています。例えば、「フーコ」カテゴリで「アクエリアスのみずがめ」をチェックすると、「レシピ」カテゴリの「アクエリアスのみずがめ」でもチェックが入ります。検索についても同様です。
    </p>
    <h2>ログイン</h2>
    <p>
      ログインすると、データが自動的にクラウドに保存されるようになります。複数のデバイスでログインすることで、データを連携させることができます。最新のデータをクラウドからダウンロードするにはページを再読み込みする必要があります。複数のデバイスで同時に操作すると、データが意図通りに保存されない可能性があります。
    </p>
    <h2>アイテム情報</h2>
    <img
      class="img"
      src="../assets/doc_item_info.jpeg"
      style="max-width: 300px; margin-bottom: 1rem;"
    />
    <p>
      アイテムの画像を長押しすると、アイテムの入手方法などの情報を表示できます。
    </p>
    <h2>サブカテゴリのピン留め</h2>
    <img
      class="img"
      src="../assets/doc_pin.jpg"
      style="max-width: 300px; margin-bottom: 1rem;"
    />
    <p>
      「来訪者」と「季節/イベント」カテゴリでは、任意のサブカテゴリをピン留めして左端に移動することができます。
    </p>
    <h2>その他</h2>
    <p>
      ご要望、不具合がございましたら Twitter にてご連絡ください。
    </p>
    <h2>THIRD-PARTIES ASSETS AND DATA</h2>
    <ul class="thd-list">
      <li class="thd-list-item">
        <a
          target="_blank"
          rel="noopener"
          href="https://github.com/acdb-team/google-sheets-to-json"
          >ACNH Item Spreadsheet (JSON format)</a
        >
      </li>
      <li class="thd-list-item">
        <a
          target="_blank"
          rel="noopener"
          href="https://github.com/alexislours/translation-sheet-data"
          >ACNH Translation sheet (JSON format)</a
        >
      </li>
      <li class="thd-list-item">
        <a target="_blank" rel="noopener" href="https://acnhcdn.com/"
          >acnhcdn.com</a
        >
      </li>
      <li class="thd-list-item">
        <a target="_blank" rel="noopener" href="https://icons.getbootstrap.com/"
          >Bootstrap Icons</a
        >
      </li>
      <li class="thd-list-item">
        For others, see the Git repository.
      </li>
    </ul>

    <div class="links">
      <a href="https://twitter.com/dmnmd55" style="margin-right: 2rem;">
        <img src="../assets/Twitter_Logo_Blue.svg" width="60px" height="60px" />
      </a>
      <a href="https://github.com/ysds/acnh-gachi-complete">
        <img src="../assets/GitHub-Mark-64px.png" width="40px" height="40px" />
      </a>
    </div>

    <footer>
      <div class="copyright">@ysds 2020</div>
    </footer>
  </div>
</template>

<script>
import CloseButton from "../components/CloseButton";

export default {
  components: {
    CloseButton
  }
};
</script>

<style lang="scss" scoped>
.about {
  padding: 0 1.5rem 1rem;
  max-width: 600px;
  margin-right: auto;
  margin-left: auto;
  text-align: center;
}

.close {
  position: absolute;
  top: 8px;
  right: 16px;
}

.logo {
  width: 60px;
  height: 60px;
  margin-bottom: 2rem;
}

h1 {
  font-size: 1.5rem;
}

h2 {
  margin-top: 2rem;
  font-size: 1.15rem;
}

.thd-list {
  padding: 0;
}

.thd-list-item {
  display: block;
  margin-bottom: 0.5rem;
}

.links {
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.copyright {
  margin-top: 1rem;
  margin-bottom: 4rem;
}

.img {
  max-width: 100%;
  height: auto;
}

.section-check {
  max-width: 240px;
  margin-right: auto;
  margin-left: auto;

  .check-status {
    display: flex;
    margin-top: 0.5rem;
    font-size: 14px;
    font-weight: 700;
  }

  .check-state {
    display: block;
    width: 80px;

    &:nth-child(2) {
      color: #42b983;
    }

    &:nth-child(3) {
      color: #3790ff;
    }
  }
}
</style>
