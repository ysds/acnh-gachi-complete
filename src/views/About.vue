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
      あつ森のバージョン 1.10 に対応しています。
    </p>
    <h2>対象アイテム</h2>
    <p>
      あつ森のほとんどすべてのアイテムの管理ができますが、「素材」、「消費アイテム」、「一部の植物」、「店売りと
      DIY
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
      同じアイテムが別のカテゴリで表示されることがありますが、それぞれのチェック状態は同期しています。
    </p>
    <h2>インポート</h2>
    <p>
      ゲームの動画を撮影して取得状態をインポートしたり、「<a
        target="_blank"
        rel="noopener"
        href="https://modunogay.github.io/DIY/index.html"
        >DIYレシピチェッカー</a
      >」などからデータをインポートしたりすることができます。詳しくは、「ログイン」ボタンまたはプロフィール画像を押したら表示される画面の下部を参照してください。
    </p>

    <h2>ログイン</h2>
    <p>
      ログインすると、データが自動的にクラウドに保存され、シェア機能を使えるようになります。複数のデバイスでログインすることで、データを同期させることができます。最新のデータをクラウドからダウンロードするにはページを再読み込みする必要があります。複数のデバイスで同時に操作すると、意図通りに同期されない可能性があります。
    </p>
    <h2>シェア機能</h2>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28px"
      height="28px"
      fill="currentColor"
      class="bi bi-reply"
      viewBox="0 0 16 16"
      style="transform: scale(-1, 1); margin: -1rem 0 1rem"
    >
      <path
        d="M6.598 5.013a.144.144 0 0 1 .202.134V6.3a.5.5 0 0 0 .5.5c.667 0 2.013.005 3.3.822.984.624 1.99 1.76 2.595 3.876-1.02-.983-2.185-1.516-3.205-1.799a8.74 8.74 0 0 0-1.921-.306 7.404 7.404 0 0 0-.798.008h-.013l-.005.001h-.001L7.3 9.9l-.05-.498a.5.5 0 0 0-.45.498v1.153c0 .108-.11.176-.202.134L2.614 8.254a.503.503 0 0 0-.042-.028.147.147 0 0 1 0-.252.499.499 0 0 0 .042-.028l3.984-2.933zM7.8 10.386c.068 0 .143.003.223.006.434.02 1.034.086 1.7.271 1.326.368 2.896 1.202 3.94 3.08a.5.5 0 0 0 .933-.305c-.464-3.71-1.886-5.662-3.46-6.66-1.245-.79-2.527-.942-3.336-.971v-.66a1.144 1.144 0 0 0-1.767-.96l-3.994 2.94a1.147 1.147 0 0 0 0 1.946l3.994 2.94a1.144 1.144 0 0 0 1.767-.96v-.667z"
      />
    </svg>
    <p>
      ログインしている場合、ページ上部にシェアボタンが表示されます。カテゴリごとに取得状態を公開するための
      URL
      を表示できます。シェアページで表示されるユーザー名や島名は、プロフィール画像を押したら表示される「設定」画面で変更できます。
    </p>
    <h3>一括シェア</h3>
    <p>
      複数のカテゴリを一括で公開したい場合、「設定」画面で一括シェア用の URL
      を使用することもできます。
    </p>
    <img
      class="img"
      src="../assets/doc_shares.jpg"
      style="max-width: 300px; margin-bottom: 1rem;"
    />
    <h2>アイテム情報</h2>
    <img
      class="img"
      src="../assets/doc_item_info.jpg"
      style="max-width: 300px; margin-bottom: 1rem;"
    />
    <p>
      アイテムの画像を長押しすると、アイテムの入手方法やリメイクバリエーションなどの情報を表示できます。
    </p>
    <h2>リスト表示</h2>
    <img class="img" src="../assets/list.svg" style="margin: -1rem 0 1rem" />
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
    <h2>サブカテゴリのピン留め</h2>
    <svg
      width="28px"
      height="28px"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style="margin: -1rem 0 1rem"
    >
      <path
        d="M2.36261 18.4448L8.01947 12.7879M8.01947 12.7879L5.42137 10.1898C4.95158 9.72001 5.06206 8.93119 5.64283 8.60854L10.6138 5.84688C10.7672 5.76168 10.8954 5.63765 10.9857 5.48722L12.3103 3.27956C12.645 2.7217 13.4148 2.62692 13.8749 3.08695L17.3669 6.57896C17.8269 7.03898 17.7321 7.80884 17.1743 8.14355L14.9966 9.45014C14.8273 9.55172 14.6919 9.70113 14.6074 9.87955L12.1625 15.041C11.8664 15.666 11.0406 15.809 10.5516 15.32L8.01947 12.7879Z"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
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
          href="https://github.com/alexislours/acnh-strings"
          >acnh-strings</a
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

h3 {
  margin-top: 1rem;
  margin-bottom: 1rem;
  font-size: 1rem;
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
