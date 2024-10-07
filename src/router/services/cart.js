import AirView from "@/views/cart/components/AirView.vue";
import UdaraView from "@/views/cart/components/UdaraView.vue";
import IndexView from "@/views/cart/IndexView.vue";
import OrderAllView from "@/views/cart/OrderAllView.vue";
import OrderOneView from "@/views/cart/OrderOneView.vue";

export default [
  {
    path: "/carts",
    name: "cartIndex",
    component: IndexView,
    meta: {
      requiresAuth: true,
    },
    redirect: { name: "cartUdara" },
    children: [
      {
        path: "udara",
        component: UdaraView,
        name: "cartUdara",
      },
      {
        path: "air",
        component: AirView,
        name: "cartAir",
      },
    ],
  },
  {
    path: "/cart/orders/:delivery(1|2)",
    name: "orderAll",
    component: OrderAllView,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
];
