import Vue from "vue";
import Vlf from "vlf";
import localforage from "localforage";
import VueLazyload from "vue-lazyload";
import "bootstrap/dist/css/bootstrap-reboot.min.css";
import "./assets/styles.scss";

import App from "./App.vue";
import router from "./router";

Vue.config.productionTip = false;
Vue.use(Vlf, localforage);
Vue.use(VueLazyload);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
