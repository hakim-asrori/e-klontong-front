<script setup>
import Logo from "@/assets/img/logo/logo.png"
import { CButton, CForm, CFormInput } from "@coreui/vue";
import Swal from "sweetalert2";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const $store = useStore()
const $router = useRouter()
const account = ref({
  name: "",
  email: "",
  phone: "",
  password: "",
})
const validation = ref({})
const isLoading = ref(false)

const handleSubmit = async () => {
  isLoading.value = true

  try {
    const response = await $store.dispatch("postData", ["sign/up", account.value])

    if (response.code == $store.state.STATUS_CODE.DATA_OK) {
      Swal.fire({
        title: 'Wooww',
        text: response.messages,
        icon: 'success',
      }).then(() => {
        $router.push({ name: 'login' })
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

const toLogin = () => {
  $router.push({ name: 'login' })
}
</script>

<template>
  <CForm class="d-flex align-items-center flex-column justify-content-center gap-4 mt-4" method="post"
    @submit.prevent="handleSubmit">
    <img :src="Logo" alt="" height="100">

    <div class="text-center">
      <h3 class="m-0 p-0">Create Account</h3>
      <p class="m-0 p-0">Please enter valid information to access your account.</p>
    </div>

    <div class="container">
      <div class="mb-3">
        <CFormInput :disabled="isLoading" type="text" placeholder="enter your name" class="w-100 rounded-3"
          :class="{ 'is-invalid': validation.name }" v-model="account.name" />
        <div class="invalid-feedback" v-if="validation.name" v-for="(error, index) in validation.name" :key="index">
          {{ error }}
        </div>
      </div>

      <div class="mb-3">
        <CFormInput :disabled="isLoading" type="email" placeholder="enter your email" class="w-100 rounded-3"
          :class="{ 'is-invalid': validation.email }" v-model="account.email" />
        <div class="invalid-feedback" v-if="validation.email" v-for="(error, index) in validation.email" :key="index">
          {{ error }}
        </div>
      </div>

      <div class="mb-3">
        <CFormInput :disabled="isLoading" type="text" placeholder="enter your phone" inputmode="numeric"
          class="w-100 rounded-3" :class="{ 'is-invalid': validation.phone }" v-model="account.phone" />
        <div class="invalid-feedback" v-if="validation.phone" v-for="(error, index) in validation.phone" :key="index">
          {{ error }}
        </div>
      </div>

      <div class="mb-4">
        <CFormInput :disabled="isLoading" type="password" placeholder="********" class="w-100 rounded-3"
          :class="{ 'is-invalid': validation.password }" v-model="account.password" />
        <div class="invalid-feedback" v-if="validation.password" v-for="(error, index) in validation.password"
          :key="index">
          {{ error }}
        </div>
      </div>

      <CButton type="submit" color="primary rounded-pill w-100 mb-3">Sign Up</CButton>
      <div class="h-divider-container mb-3">
        <hr class="h-divider">
        <span class="h-breakline">OR</span>
        <hr class="h-divider">
      </div>
      <p class="m-0 p-0 text-center">
        Already have an account? <span class="text-primary pointer-cursor" @click="toLogin()">Sign In</span>
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