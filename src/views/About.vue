<template>
  <div class="about">
    <h1>あつ森ガチコンプの使い方</h1>
    <h2>最新情報</h2>
    <div class="timeline">
      <Timeline
        id="dmnmd55"
        sourceType="profile"
        :options="{
          width: '400',
          tweetLimit: '1',
          chrome: 'noheader nofooter',
          lang: 'ja'
        }"
      />
    </div>
    <a href="https://twitter.com/dmnmd55" class="follow-button"
      ><img src="../assets/Twitter_Logo_WhiteOnImage.svg" /> 開発者の Twitter
      を見る</a
    >
    <h2>あつ森ガチコンプについて</h2>
    <p>
      このアプリは、あつ森のアイテムの取得状況を管理できるウェブアプリです。来訪者やシーズンイベントなどでも絞り込むことができるため、周回にも活用いただけます。<br />
    </p>
    <p>
      あつ森のバージョン 1.7 に対応しています。
    </p>
    <h2>対象アイテム</h2>
    <p>
      「素材」、「消費アイテム」、「植物」、「店売りと DIY
      家具のリメイク違い」は、コレクション対象外としてチェック対象から外しています。
    </p>
    <p>
      リメイクできるアイテムには
      <img
        class="img"
        src="../assets/remake.svg"
        style="width:26px; height: 26px; margin-top: -4px; margin-left: -4px;"
      />
      アイコンが表示されます。
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
    <p style="margin-top: 1rem;">
      タップすると状態を切り替えられます。
    </p>
    <p>
      同じアイテムが別のカテゴリで表示されることがありますが、それぞれのチェック状態は同期しています。例えば、「フーコ」カテゴリで「アクエリアスのみずがめ」をチェックすると、「レシピ」カテゴリの「アクエリアスのみずがめ」でもチェックが入ります。検索についても同様です。
    </p>
    <h2>リスト表示</h2>
    <img class="img" src="../assets/list.svg" style="margin-bottom: 1rem;" />
    <p>
      リストアイコンを押すとリスト表示に切り替えることができます。
    </p>
    <img
      class="img"
      src="../assets/doc_list.jpg"
      style="max-width: 300px; margin-bottom: 1rem;"
    />
    <p>
      カタログと照らし合わせながらチェックするなど、一気にチェックする場合はリスト表示の方が効率的にチェックいただけます。
    </p>
    <h2>ログイン</h2>
    <p>
      ログインすると、データが自動的にクラウドに保存され、シェア機能を使えるようになります。複数のデバイスでログインすることで、データを連携させることができます。最新のデータをクラウドからダウンロードするにはページを再読み込みする必要があります。複数のデバイスで同時に操作すると、データが意図通りに保存されない可能性があります。
    </p>
    <h2>シェア機能</h2>
    <svg
      width="2em"
      height="2em"
      viewBox="0 0 16 16"
      style="margin: .75rem 0 1.5rem;"
      class="bi bi-share"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"
      />
    </svg>
    <p>
      ログインしている場合、一括操作ボタンの右にシェアボタンが表示されます。カテゴリごとに取得状態を公開するための
      URL
      を表示できます。シェアページで表示されるユーザー名は、プロフィール画像を押したら表示される「設定」画面で変更できます。
    </p>
    <img
      class="img"
      src="../assets/doc_shares.jpg"
      style="max-width: 300px; margin-bottom: 1rem;"
    />
    <p>
      複数のカテゴリを一括で公開したい場合、「設定」画面で一括シェア用の URL
      を使用することもできます。
    </p>
    <h2>アイテム情報</h2>
    <img
      class="img"
      src="../assets/doc_item_info.jpg"
      style="max-width: 300px; margin-bottom: 1rem;"
    />
    <p>
      アイテムの画像を長押しすると、アイテムの入手方法やリメイクバリエーション
      などの情報を表示できます。
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
    <h2>プライバシーポリシー</h2>
    <p><router-link to="/policy">プライバシーポリシー</router-link></p>

    <h2>その他</h2>
    <p>
      ご要望、不具合がございましたら
      <a target="_blank" rel="noopener" href="https://twitter.com/dmnmd55"
        >Twitter</a
      >
      にてご連絡ください。
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
          href="https://github.com/alexislours/acnh-message"
          >acnh-message</a
        >
      </li>
      <li class="thd-list-item">
        <a target="_blank" rel="noopener" href="https://acnhcdn.com/"
          >acnhcdn.com</a
        >
      </li>
      <li class="thd-list-item">
        <a
          target="_blank"
          rel="noopener"
          href="https://github.com/MariuszDabrowski/ac-miles"
          >AC Miles</a
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
import { Timeline } from "vue-tweet-embed";

export default {
  components: {
    Timeline
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

h1 {
  font-size: 1.5rem;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

h2 {
  margin-top: 2.5rem;
  margin-bottom: 1.5rem;
  font-size: 1.15rem;
}

p {
  line-height: 1.65;
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

.timeline {
  display: flex;
  justify-content: center;

  > div {
    background-color: rgba(15, 70, 100, 0.08);
    padding: 8px 8px 1px;
    border-radius: 8px;
  }
}

.follow-button {
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.75rem;
  margin-top: 2rem;
  background-color: #1b95e0;
  color: #fff;
  border-radius: 8px;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    background-color: #0c7abf;
  }

  img {
    margin-right: 5px;
    width: 32px;
    height: 32px;
  }
}
</style>
