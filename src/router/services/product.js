import DetailView from "@/views/products/DetailView.vue";
import ListView from "@/views/products/ListView.vue";

export default [
  {
    path: "/product/:type('all-latests'|'all-populars')",
    name: "productList",
    component: ListView,
    props: true,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/product/:id",
    name: "productDetail",
    component: DetailView,
    props: true,
    meta: {
      requiresAuth: false,
    },
  },
];
