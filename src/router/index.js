import Vue from "vue";
import VueRouter from "vue-router";
import Collection from "../views/Collection.vue";

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
    path: "/share/:id/:category",
    name: "Share",
    component: () => import("../views/Share.vue")
  }
];

const router = new VueRouter({
  routes
});

export default router;
