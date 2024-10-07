import IndexView from "@/views/delivery/IndexView.vue";
import ProductView from "@/views/delivery/ProductView.vue";

export default [
  {
    path: "/delivery",
    name: "delivery",
    component: IndexView,
  },
  {
    path: "/delivery/:delivery('laut'|'udara')",
    name: "deliveryProduct",
    props: true,
    component: ProductView,
  },
];
