import IndexView from "@/views/delivery/IndexView.vue";
import ProductView from "@/views/delivery/ProductView.vue";

export default [
  {
    path: "/delivery",
    name: "delivery",
    component: IndexView,
  },
  {
    path: "/delivery/udara",
    name: "deliveryProductUdara",
    props: true,
    component: ProductView,
  },
  {
    path: "/delivery/laut",
    name: "deliveryProductLaut",
    props: true,
    component: ProductView,
  },
];
