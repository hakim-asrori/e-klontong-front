import CreateView from "@/views/profile/address/CreateView.vue";
import EditView from "@/views/profile/address/EditView.vue";
import IndexView from "@/views/profile/address/IndexView.vue";

export default [
  {
    path: "/profile/addresses",
    name: "indexAddress",
    component: IndexView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/profile/address/create",
    name: "createAddress",
    component: CreateView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/profile/address/:id/edit",
    name: "editAddress",
    component: EditView,
    meta: {
      requiresAuth: true,
    },
    props: true,
  },
];
