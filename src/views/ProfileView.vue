<script setup>
import { CListGroup, CListGroupItem } from "@coreui/vue";
import Cookies from "js-cookie";
import { ref } from "vue";
import { onMounted } from "vue";

const user = ref({});

const getUser = async () => {
  const cookiesUser = Cookies.get("user");

  user.value = JSON.parse(cookiesUser);
};

const logoutProcess = async (e) => {
  e.preventDefault();

  Cookies.remove("user");
  Cookies.remove("token");

  window.location.href = "/";
};

onMounted(() => {
  getUser();
});
</script>

<template>
  <div style="height: 90vh" class="d-flex flex-column justify-content-center">
    <div class="mb-2 d-flex flex-column align-items-center">
      <img
        src="../assets/img/logo/logo.png"
        alt=""
        style="border-radius: 50%; height: 100px; width: 100px"
      />
      <h4 class="my-2">{{ user.name }}</h4>
    </div>
    <CListGroup flush>
      <a class="list-group-item"> &nbsp; </a>
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
      <!-- 
      <a
        href=""
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <div>
          <i class="text-primary fa-solid fa-bell me-3"></i>
          <span class="fw-semibold">Notification</span>
        </div>
        <i class="fa-solid fa-chevron-right text-secondary"></i>
      </a> -->
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
</template>
