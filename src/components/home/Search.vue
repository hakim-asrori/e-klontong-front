<script setup>
import { CContainer, CNavbarNav, CNavItem, CNavLink, CNavbarBrand, CInputGroup, CFormInput, CInputGroupText } from '@coreui/vue'
import Cookies from 'js-cookie';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const $router = useRouter()
const checkToken = ref(false)

onMounted(() => {
  checkAuth()
})

const checkAuth = async () => {
  let token = Cookies.get("token");

  if (token == undefined) {
    checkToken.value = false
  } else {
    checkToken.value = true
  }
}

const toLogin = () => {
  $router.push({ name: 'login' })
}

const toSearch = () => {
  $router.push({ name: 'productSearch' })
}
</script>

<template>
  <div fluid
    class="gap-sm-4 gap-3 d-flex flex-row align-items-center justify-content-between py-3 mb-3 fixed-top bg-white px-3">
    <CInputGroup size="sm" style="background-color: #e4e4e4;" class="rounded" @click="toSearch">
      <CInputGroupText style="background-color: #e4e4e4;"><i class="fa-solid fa-search"
          style="color: rgba(37, 43, 54, 0.6);"></i>
      </CInputGroupText>
      <CFormInput placeholder="Search for products" style="background-color: #e4e4e4;" />
    </CInputGroup>
    <CNavbarBrand href="#" class="me-0 text-primary" v-if="!checkToken" @click="toLogin()"><i
        class="fa-solid fa-sign-in"></i>
    </CNavbarBrand>
  </div>
</template>