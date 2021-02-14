import Vue from "vue";
import VueRouter from "vue-router";
import Collection from "../views/Collection.vue";
import Share from "../views/Share.vue";
import store from "../store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Collection",
    component: Collection
  },
  {
    path: "/about",
    name: "About",
    component: () => import("../views/About.vue")
  },
  {
    path: "/policy",
    name: "Policy",
    component: () => import("../views/Policy.vue")
  },
  {
    path: "/share2/:category/",
    name: "Share2",
    component: Share
  },
  {
    path: "/shares/",
    name: "Shares",
    component: Share
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  }
});

router.afterEach((to, from) => {
  if (from.name === "Collection") {
    store.commit("changeNav", null);
  }
});

export default router;
