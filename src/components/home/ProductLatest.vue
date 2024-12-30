<script setup>
import util from '@/store/services/util';
import { CRow, CCol, CCard, CCardBody, CCardImage, CCardTitle, CCardText, CSpinner, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton, CImage } from '@coreui/vue'
import { onMounted } from 'vue';
import { ref } from 'vue';
import { useStore } from 'vuex';
import Cookies from "js-cookie";
import { useRouter } from 'vue-router';

const $store = useStore()
const $router = useRouter()
const products = ref([])
const isLoading = ref(false)

onMounted(() => {
  getProduct()
})

const getProduct = async () => {
  isLoading.value = true

  try {
    const response = await $store.dispatch("postData", ["products", {
      sort_by: 'id',
      sort_direction: 'desc',
      per_page: 10
    }])

    if (response.code == $store.state.STATUS_CODE.DATA_OK) {
      products.value = response.data
    }
  } catch (error) {
  } finally {
    isLoading.value = false
  }
}

const toDetailProduct = (id) => {
  $router.push({ name: 'productDetail', params: { id } })
}

const formatRupiah = (price) => {
  return util.rupiah(price)
}
</script>

<template>
  <div class="mb-3 d-flex align-items-center justify-content-between">
    <h4 class="fw-bold">Latests</h4>
    <router-link :to="{ name: 'productList', params: { type: 'all-latests' } }"
      class="small text-decoration-none fw-semibold">See All</router-link>
  </div>
  <div class="">
    <div class="d-flex align-items-center justify-content-center" v-if="isLoading">
      <CSpinner class="mb-3" />
    </div>
    <div class="d-flex gap-3 overflow-x-auto content" v-else>
      <CCard v-for="(product, index) in products" :key="index" class="mb-3 card"
        style="max-width: 175px; width: 100%; min-width: 175px; cursor: pointer;"
        @click="toDetailProduct(product.slug)">
        <CCardImage orientation="top" :src="product.image" height="150" />
        <CCardBody class="text-center p-1 w-100">
          <CCardTitle>{{ product.name }}</CCardTitle>
          <CCardText>
            {{ formatRupiah(product.price) }}
          </CCardText>
        </CCardBody>
      </CCard>
    </div>
  </div>
  <hr>
</template>

<style scoped>
.content::-webkit-scrollbar {
  display: none;
}
</style>