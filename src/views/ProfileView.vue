<script setup>
import {
  CButton,
  CListGroup,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/vue";
import Cookies from "js-cookie";
import { ref } from "vue";
import { onMounted } from "vue";
import LogoPng from "@/assets/img/logo/logo.png";
import { useStore } from "vuex";
import UserEditView from "./profile/user/EditView.vue";

const $store = useStore();
const user = ref({});

const showModal = ref({
  show: false,
  title: "",
  type: 1,
});

const getUser = async () => {
  try {
    let response = await $store.dispatch("postData", ["user/show", {}]);

    if (response.code == $store.state.STATUS_CODE.DATA_OK) {
      Cookies.set("user", JSON.stringify(response.data));
      user.value = response.data;
    } else {
      Swal.fire({
        title: "Ooops",
        text: response.messages,
        icon: "error",
      });
    }
  } catch (error) {}
};

const logoutProcess = async (e) => {
  e.preventDefault();

  Cookies.remove("user");
  Cookies.remove("token");

  window.location.href = "/";
};

const handleError = (e) => {
  e.target.src = LogoPng;
};

onMounted(() => {
  getUser();
});
</script>

<template>
  <div style="height: 90vh" class="d-flex flex-column justify-content-center">
    <div class="mb-2 d-flex flex-column align-items-center">
      <img
        :src="user.photo"
        alt=""
        @error="handleError"
        style="border-radius: 50%; height: 100px; width: 100px"
      />
      <h4 class="my-2">
        {{ user.name }}
      </h4>
    </div>
    <CListGroup flush>
      <a class="list-group-item"> &nbsp; </a>

      <a
        href="#"
        @click="showModal = { show: true, title: 'Edit Account', type: 1 }"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <div>
          <i class="text-primary fa-solid fa-user-edit me-3"></i>
          <span class="fw-semibold">Edit Account</span>
        </div>
        <i class="fa-solid fa-chevron-right text-secondary"></i>
      </a>
      <router-link
        :to="{ name: 'indexAddress' }"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <div>
          <i class="text-primary fa-solid fa-address-book me-3"></i>
          <span class="fw-semibold">Address</span>
        </div>
        <i class="fa-solid fa-chevron-right text-secondary"></i>
      </router-link>
      <router-link
        :to="{ name: 'order' }"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <div>
          <i class="text-primary fa-solid fa-credit-card me-3"></i>
          <span class="fw-semibold">Transaction</span>
        </div>
        <i class="fa-solid fa-chevron-right text-secondary"></i>
      </router-link>
      <!-- <a
        href=""
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <div>
          <i class="text-primary fa-solid fa-gear me-3"></i>
          <span class="fw-semibold">Settings</span>
        </div>
        <i class="fa-solid fa-chevron-right text-secondary"></i>
      </a>
      <a
        href=""
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <div>
          <i class="text-primary fa-solid fa-question me-3"></i>
          <span class="fw-semibold">Help Center</span>
        </div>
        <i class="fa-solid fa-chevron-right text-secondary"></i>
      </a> -->
      <a
        href=""
        @click="logoutProcess($event)"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <div>
          <i class="text-primary fa-solid fa-sign-out me-3"></i>
          <span class="fw-semibold">Logout</span>
        </div>
        <i class="fa-solid fa-chevron-right text-secondary"></i>
      </a>
      <a class="list-group-item"> &nbsp; </a>
    </CListGroup>
  </div>

  <CModal
    :visible="showModal.show"
    @close="
      () => {
        showModal = { show: false, title: '', type: 1 };
      }
    "
    backdrop="static"
  >
    <CModalHeader>
      <CModalTitle>{{ showModal.title }}</CModalTitle>
    </CModalHeader>
    <UserEditView
      @close-modal="(e) => (showModal = e)"
      @onReloadUser="getUser()"
      v-if="showModal.show"
      :user="user"
    />
  </CModal>
</template>
