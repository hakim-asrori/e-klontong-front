import ProductView from "@/views/category/ProductView.vue";

export default [
  {
    path: "/category/:slug",
    name: "categoryIndex",
    component: ProductView,
    props: true,
    meta: {
      requiresAuth: false,
    },
  },
];
