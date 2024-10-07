import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ProfileView from "@/views/ProfileView.vue";
import product from "./services/product";
import auth from "./services/auth";
import Cookies from "js-cookie";
import category from "./services/category";
import cart from "./services/cart";
import address from "./services/address";
import order from "./services/order";
import delivery from "./services/delivery";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: "active",
  routes: [
    ...cart,
    ...auth,
    ...category,
    ...product,
    ...address,
    ...order,
    ...delivery,
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfileView,
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const token = Cookies.get("token");
  if (to.meta.requiresAuth == true) {
    if (!token) {
      window.location.href = "/auth/login";
    } else {
      if (to.meta.middleware) {
        to.meta.middleware(to, from.next);
      }
      next();
    }
  }

  next();
});

export default router;
