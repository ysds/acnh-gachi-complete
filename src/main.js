import Vue from "vue";
import Vlf from "vlf";
import localforage from "localforage";
import VueLazyload from "vue-lazyload";
import VueAnalytics from "vue-analytics";
import VueClipboard from "vue-clipboard2";

import "bootstrap/dist/css/bootstrap-reboot.min.css";
import "./assets/styles.scss";

import App from "./App.vue";
import router from "./router";
import store from "./store";
import Auth from "./utils/auth";
Auth.init();

Vue.config.productionTip = false;
Vue.use(Vlf, localforage);
Vue.use(VueLazyload);
Vue.use(VueClipboard);
Vue.use(VueAnalytics, {
  id: "UA-173561585-1",
  router
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
