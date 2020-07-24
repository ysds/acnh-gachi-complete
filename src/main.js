import Vue from "vue";
import Vlf from "vlf";
import localforage from "localforage";
import "bootstrap/dist/css/bootstrap-reboot.min.css";

import App from "./App.vue";
import router from "./router";

Vue.config.productionTip = false;
Vue.use(Vlf, localforage);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
