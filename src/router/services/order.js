import ProductView from "@/views/order/ProductView.vue";
import IndexView from "@/views/order/IndexView.vue";

export default [
  {
    path: "/orders",
    name: "order",
    component: IndexView,
    meta: {
      requiresAuth: true,
    },
    // redirect: { name: "orderAllView" },
    // children: [
    //   {
    //     path: "all",
    //     component: ProductView,
    //     name: "orderAllView",
    //   },
    //   {
    //     path: "order",
    //     component: ProductView,
    //     name: "orderOrderView",
    //   },
    //   {
    //     path: "packing",
    //     component: ProductView,
    //     name: "orderPackingView",
    //   },
    //   {
    //     path: "send",
    //     component: ProductView,
    //     name: "orderSendView",
    //   },
    //   {
    //     path: "receive",
    //     component: ProductView,
    //     name: "orderReceiveView",
    //   },
    // ],
  },
];
