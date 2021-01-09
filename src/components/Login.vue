<template>
  <div class="login">
    <div class="login-header">
      <h2 class="login-title">
        <template v-if="isLogin">設定</template>
        <template v-else>ログイン</template>
      </h2>
      <div class="close">
        <CloseButton @click="close" />
      </div>
    </div>
    <div class="login-body">
      <template v-if="isLogin && user">
        <img :src="user.photoURL" alt="Avatar" class="avatar" />
      </template>
      <template v-else-if="isLogin === false">
        <p style="font-size: 14px;">
          ログインすると、データが自動的にクラウドに保存され、シェア機能を使えるようになります。
        </p>
        <button type="button" class="btn" @click="login('google')">
          <img
            src="../assets/google.svg"
            width="24px"
            height="24px"
            style="margin-right: 1rem"
          />
          Google でログイン
        </button>
        <button type="button" class="btn" @click="login('twitter')">
          <img
            src="../assets/Twitter_Logo_Blue.svg"
            width="40px"
            height="40px"
            style="margin-right: .5rem"
          />
          Twitter でログイン
        </button>
      </template>
      <div class="section">
        <div class="section-label mb-4">コンプ率</div>
        <LoginCollected />
      </div>
      <template v-if="isLogin && user">
        <div class="section">
          <div class="d-flex align-items-center mb-4">
            <div class="section-label">名前</div>
            <Button @click="editName" style="margin-left: auto;">
              <svg
                width="1em"
                height="1em"
                viewBox="0 0 16 16"
                class="bi bi-pencil-fill"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"
                />
              </svg>
            </Button>
          </div>
          <div class="username" v-if="!isEditName">
            {{ userName }}
          </div>
          <div class="username edit" v-else>
            <input
              class="edit-input mb-4"
              type="text"
              v-model="editingName"
              ref="userName"
            />
            <button class="edit-btn" type="button" @click="cancelName">
              キャンセル
            </button>
            <button
              class="edit-btn"
              type="button"
              @click="saveName"
              style="margin-left: 1rem;"
            >
              保存
            </button>
          </div>
          <p class="small">
            シェア機能使用時に相手に表示されます。
          </p>
        </div>

        <div class="section">
          <div class="d-flex align-items-center mb-4">
            <div class="section-label">島の名前</div>
            <Button @click="editIslandName" style="margin-left: auto;">
              <svg
                width="1em"
                height="1em"
                viewBox="0 0 16 16"
                class="bi bi-pencil-fill"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"
                />
              </svg>
            </Button>
          </div>
          <div class="username" v-if="!isEditIslandName">
            <div v-if="islandName">{{ islandName }}島</div>
            <div v-else>（未設定）</div>
          </div>
          <div class="username edit" v-else>
            <div class="d-flex align-items-center mb-4">
              <input
                class="edit-input"
                type="text"
                v-model="editingIslandName"
                ref="islandName"
                style="margin-right: .5rem;"
              />
              島
            </div>
            <button class="edit-btn" type="button" @click="cancelIslandName">
              キャンセル
            </button>
            <button
              class="edit-btn"
              type="button"
              @click="saveIslandName"
              style="margin-left: 1rem;"
            >
              保存
            </button>
          </div>
          <p class="small">
            シェア機能使用時に相手に表示されます。
          </p>
        </div>

        <div class="section">
          <div class="section-label mb-4">一括シェア</div>
          <div class="link">
            <a :href="`${baseURL}shares/?uid=${user.uid}`"
              >https://ysds.github.io/acnh-gachi-complete/shares/?uid={{
                user.uid
              }}</a
            >
          </div>
          <div style="text-align: center;">
            <a
              class="btn"
              :href="
                `https://twitter.com/intent/tweet?text=取得状況%0ahttps://ysds.github.io/acnh-gachi-complete/shares/?uid=${user.uid}%0a%0a%23あつ森ガチコンプ`
              "
              style="margin: 0 0 1rem;"
            >
              Twitter に投稿する
            </a>
          </div>
          <p class="small">
            この URL
            を他の人に伝えることで、任意のカテゴリを一括でシェアできます。公開したいカテゴリを以下から選択してください。
          </p>
          <LoginShare />
        </div>

        <div class="section">
          <div class="section-label mb-4">ID</div>
          <p>{{ user.uid }}</p>
          <p class="small">
            あなたの固有IDです。シェア機能使用時の URL として使用されます。
          </p>
        </div>
      </template>
      <div class="section">
        <div class="section-label mb-4">インポート</div>
        <p class="small">
          「<a
            target="_blank"
            rel="noopener"
            href="https://modunogay.github.io/DIY/index.html"
            >DIYレシピチェッカー</a
          >」、「<a
            target="_blank"
            rel="noopener"
            href="https://modunogay.github.io/FTR/index.html"
            >家具チェッカー</a
          >」、「<a
            target="_blank"
            rel="noopener"
            href="https://modunogay.github.io/MISC/index.html"
            >小物家具チェッカー</a
          >」、「<a
            target="_blank"
            rel="noopener"
            href="https://modunogay.github.io/FTR_WALL/index.html"
            >壁掛け家具チェッカー</a
          >」から、データをインポートすることができます。
        </p>
        <p class="small" style="font-weight: 700; margin-bottom: .5rem;">
          このテキストボックスに、発行した URL
          を貼り付けて、インポートボタンを押してください。
        </p>
        <login-import />
      </div>
      <template v-if="isLogin && user">
        <button type="button" class="btn" @click="logout">
          ログアウト
        </button>
        <p class="small">
          ログアウトするとブラウザに保存されているデータはクリアされます。再度ログインすることで、クラウドからデータを復元できます。
        </p>
      </template>
    </div>
  </div>
</template>
<script>
import firebase from "../plugins/firebase";
import Auth from "../utils/auth";
import CloseButton from "../components/CloseButton";
import Button from "../components/Button";
import LoginShare from "../components/LoginShare";
import LoginImport from "../components/LoginImport";
import LoginCollected from "../components/LoginCollected";

const db = firebase.firestore();
const baseURL = process.env.BASE_URL;

export default {
  name: "Login",
  components: {
    CloseButton,
    Button,
    LoginShare,
    LoginImport,
    LoginCollected
  },
  data() {
    return {
      isEditName: false,
      isEditIslandName: false,
      editingName: "",
      editingIslandName: "",
      baseURL: baseURL
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    userName() {
      return this.$store.getters.userName;
    },
    islandName() {
      return this.$store.getters.islandName;
    },
    isLogin() {
      return this.$store.getters.isLogin;
    }
  },
  methods: {
    login(provider) {
      Auth.login(provider);
    },
    logout() {
      Auth.logout();
      this.$vlf.clear(() => {
        window.location.reload();
      });
    },
    close() {
      this.$emit("close");
    },
    editName() {
      this.editingName = this.userName;
      this.isEditName = true;
      this.$nextTick(function() {
        this.$refs.userName.focus();
      });
    },
    editIslandName() {
      this.editingIslandName = this.islandName;
      this.isEditIslandName = true;
      this.$nextTick(function() {
        this.$refs.islandName.focus();
      });
    },
    cancelName() {
      this.isEditName = false;
    },
    cancelIslandName() {
      this.isEditIslandName = false;
    },
    saveName() {
      db.collection("users")
        .doc(this.user.uid)
        .update({
          userName: this.editingName
        });
      this.$store.commit("updateUserName", this.editingName);
      this.isEditName = false;
    },
    saveIslandName() {
      db.collection("users")
        .doc(this.user.uid)
        .update({
          islandName: this.editingIslandName
        });
      this.$store.commit("updateIslandName", this.editingIslandName);
      this.isEditIslandName = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.login {
  position: fixed;
  z-index: 1100;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  overflow-y: auto;
  user-select: text;
}

.login-header {
  position: relative;
  text-align: center;
  padding: 0.5rem;
  line-height: 64px;
}

.close {
  position: absolute;
  top: 8px;
  right: 16px;
}

.login-title {
  margin-bottom: 0;
}

.login-body {
  padding: 1.5rem;
  max-width: 600px;
  margin-right: auto;
  margin-left: auto;
  text-align: center;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 2rem;
}

.section {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;

  text-align: left;
}

.section-label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  flex-shrink: 0;
  padding: 0.2rem 1rem;
  border-radius: 4px;
  color: #fff;
  background-color: #ec407a;
  font-weight: 700;
  text-align: center;
}

.username {
  margin-bottom: 1rem;
}

.edit-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 3px;
  appearance: none;
}

.edit-btn {
  padding: 0.5rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  font-weight: 700;
  font-size: 14px;
  line-height: 1.3;
  color: #42b983;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 400px;
  min-height: 50px;
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 0 1rem;
  border: 1px solid #ccc;
  border-radius: 1rem;
  background-color: #fff;
  font-weight: 700;
}

.small {
  font-size: 13px;
  color: #555;
}

.flat-btn {
  min-width: 38px;
  height: 38px;
  line-height: 38px;
}

.link {
  word-break: break-all;
  margin-bottom: 1rem;
}
</style>
