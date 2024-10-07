<script setup>
import { useRouter } from "vue-router";
import Navbar from "./components/layouts/Navbar.vue"
import { onMounted } from "vue";
import Cookies from "js-cookie";
import { useStore } from "vuex";

const $store = useStore()
const $router = useRouter()

onMounted(() => {
  checkAuth()
})

const checkAuth = async () => {
  let token = Cookies.get("token");

  if (token != undefined) {
    try {
      const response = await $store.dispatch("postData", ["user", {}])

      Cookies.set("user", JSON.stringify(response))
    } catch (error) {
      Cookies.remove("user")
      Cookies.remove("token")
    } finally {
    }
  }
}
</script>

<template>
  <router-view></router-view>
  <Navbar
    v-if="!['login', 'register', 'productDetail', 'categoryIndex', 'orderOne', 'orderAll', 'indexAddress', 'createAddress'].includes($router.currentRoute.value.name)" />
</template>
