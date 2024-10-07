<script setup>
import Logo from "@/assets/img/logo/logo.png"
import { CButton, CForm, CFormInput } from "@coreui/vue";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const $store = useStore()
const $router = useRouter()
const account = ref({
  email: "",
  password: "",
})
const validation = ref({})
const isLoading = ref(false)

const handleSubmit = async () => {
  isLoading.value = true

  try {
    const response = await $store.dispatch("postData", ["sign/in", account.value])

    if (response.code == $store.state.STATUS_CODE.DATA_OK) {
      Cookies.set("token", response.data.token)
      Cookies.set("user", JSON.stringify(response.data))
      Swal.fire({
        title: 'Wooww',
        text: response.messages,
        icon: 'success',
      }).then(() => {
        $router.push({ name: 'home' })
      })
    } else {
      if (response.code == $store.state.STATUS_CODE.INVALID_BODY) {
        validation.value = response.data
      }

      Swal.fire({
        title: 'Ooops',
        text: response.messages,
        icon: 'error',
      })
    }

  } catch (error) {
  } finally {
    isLoading.value = false
  }
}

const toRegister = () => {
  $router.push({ name: 'register' })
}
</script>

<template>
  <CForm class="d-flex align-items-center flex-column justify-content-center gap-4 mt-5" method="post"
    @submit.prevent="handleSubmit">
    <img :src="Logo" alt="" height="100">
    <div class="text-center">
      <h3 class="m-0 p-0">Welcome!</h3>
      <h3 class="m-0 p-0">to Kenshuu <span class="text-danger">Express</span></h3>
    </div>
    <div class="container">
      <div class="mb-3">
        <CFormInput type="email" placeholder="enter your email" class="w-100 rounded-3"
          :class="{ 'is-invalid': validation.email }" v-model="account.email" :disabled="isLoading" />
        <div class="invalid-feedback" v-if="validation.email" v-for="(error, index) in validation.email" :key="index">
          {{ error }}
        </div>
      </div>

      <div class="mb-4">
        <CFormInput type="password" placeholder="********" class="w-100 rounded-3"
          :class="{ 'is-invalid': validation.password }" v-model="account.password" :disabled="isLoading" />
        <div class="invalid-feedback" v-if="validation.password" v-for="(error, index) in validation.password"
          :key="index">
          {{ error }}
        </div>
      </div>

      <CButton type="submit" color="primary rounded-pill w-100 mb-3">Sign In</CButton>
      <div class="h-divider-container mb-3">
        <hr class="h-divider">
        <span class="h-breakline">OR</span>
        <hr class="h-divider">
      </div>
      <p class="m-0 p-0 text-center">
        Don't have account? <span class="text-primary pointer-cursor" @click="toRegister()">Sign Up</span>
      </p>
    </div>
  </CForm>
</template>

<style scoped>
.h-divider-container {
  display: flex;
  align-items: center;
  text-align: center;
}

.h-divider-container .h-divider {
  flex-grow: 1;
  border: none;
  border-top: 1px solid black;
}

.h-divider-container span {
  margin: 0 10px
}
</style>