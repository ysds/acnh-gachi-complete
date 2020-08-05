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
      あつ森のアイテムコンプを目指すことを目的にしており、素材や消費アイテム、リメイク家具は対象から外しています。
    </p>
    <h2>タブとチェック状態について</h2>
    <p>
      同一のアイテムが異なるタブで表示されることがありますが、それぞれのチェック状態は同期しています。例えば、フーコのタブで「アクエリアスのみずがめ」をチェックすると、レシピタブの「アクエリアスのみずがめ」でもチェックが入ります。検索についても同様です。
    </p>
    <h2>ログイン</h2>
    <p>
      ログインすると、データが自動的にクラウドに保存されるようになります。複数のデバイスでログインすることで、データを連携させることができます。最新のデータをクラウドからダウンロードするにはページを再読み込みする必要があります。複数のデバイスで同時に操作すると、データが意図通りに保存されない可能性があります。
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
</style>
