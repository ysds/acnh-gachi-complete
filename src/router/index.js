import Vue from "vue";
import VueRouter from "vue-router";
import Collection from "../views/Collection.vue";
import Share from "../views/Share.vue";

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
  routes
});

export default router;
