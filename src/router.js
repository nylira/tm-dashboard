import Vue from "vue";
import Router from "vue-router";
import Voyager from "./views/Voyager.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "voyager",
      component: Voyager
    },
    {
      path: "/tendermint",
      name: "tendermint",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/Tendermint.vue")
    }
  ]
});
