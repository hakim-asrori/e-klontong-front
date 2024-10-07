<script setup>
import TitleBar from '@/components/layouts/TitleBar.vue';
import util from '@/store/services/util';
import { CCard, CCardBody, CCardHeader, CSpinner } from '@coreui/vue';
import moment from 'moment';
import { onMounted, onUnmounted, ref } from 'vue';
import { useStore } from 'vuex';

const $store = useStore()
const isLoading = ref(false)
const orders = ref([])
const orderFilter = ref({
  status: null,
  per_page: 10,
  page: 1
})
const productLastPage = ref(false)

onMounted(() => {
  window.addEventListener("scroll", handleScroll)
  getOrder()
})

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll)
})

const getOrder = async () => {
  if (productLastPage.value) {
    return
  }

  // isLoading.value = true

  try {
    const response = await $store.dispatch("postData", ["orders", orderFilter.value]);

    if (response.code == $store.state.STATUS_CODE.DATA_OK) {
      if (response.data == undefined) {
        productLastPage.value = true
      } else {
        orderFilter.value.page += 1
        if (response.pagination.currentPage == 1) {
          orders.value = response.data
        } else {
          orders.value.push(...response.data)
        }
      }
    } else {
      orders.value = []
    }
  } catch (error) {

  } finally {
    isLoading.value = false
  }
}

const handleScroll = () => {
  const bottomOfWindow =
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10;

  if (bottomOfWindow && !isLoading.value) {
    getOrder()
  }
}

const changeStatus = (status) => {
  productLastPage.value = false
  orderFilter.value.status = status
  orderFilter.value.page = 1
  isLoading.value = true
  getOrder()
}

const formatRupiah = (price) => {
  return util.rupiah(price)
}

const formatDate = (date) => {
  return moment(date).format("DD MMM YY")
}
</script>

<template>
  <TitleBar title="History Orders" :show-back="false" :show-cart="false" />
  <div class="container">
    <div class="d-flex align-items-center gap-2 menus overflow-x-auto fixed-top bg-white pb-2"
      style="margin-top: 56px; padding: 0 12px">
      <button @click="changeStatus(null)" class="btn w-100 rounded-pill btn-outline-primary"
        :class="{ active: orderFilter.status == null }">All</button>
      <button @click="changeStatus(1)" class="btn w-100 rounded-pill btn-outline-primary"
        :class="{ active: orderFilter.status == 1 }">Order</button>
      <button @click="changeStatus(2)" class="btn w-100 rounded-pill btn-outline-primary"
        :class="{ active: orderFilter.status == 2 }">Packing</button>
      <button @click="changeStatus(3)" class="btn w-100 rounded-pill btn-outline-primary"
        :class="{ active: orderFilter.status == 3 }">Send</button>
      <button @click="changeStatus(4)" class="btn w-100 rounded-pill btn-outline-primary"
        :class="{ active: orderFilter.status == 4 }">Receive</button>
    </div>
    <div style="margin-top: 115px; margin-bottom: 6rem;">
      <div class="d-flex align-items-center justify-content-center" v-if="isLoading">
        <CSpinner class="mb-3" />
      </div>
      <p v-if="!isLoading && orders.length < 1" class="d-flex align-items-center justify-content-center"
        style="min-height: 50vh;">
        Data not available.
      </p>
      <CCard v-if="!isLoading && orders.length > 0" class="mb-3" v-for="(order, index) in orders" :key="index">
        <CCardHeader>
          <small class="d-flex align-items-center justify-content-between">
            <strong>{{ order.reference }}</strong>
            <span>{{ formatDate(order.createdAt) }}</span>
          </small>
        </CCardHeader>
        <CCardBody>
          <div class="d-flex gap-3 align-items-center justify-content-between">
            <div class="d-flex align-items-center gap-3 overflow-x-auto item-product">
              <div v-for="(item, indexItem) in order.items" :key="indexItem"
                class="d-flex flex-column justify-content-center">
                <router-link :to="{ name: 'productDetail', params: { id: item.slug } }">
                  <img :src="item.image" height="75" width="75">
                </router-link>
                <small class="text-center">{{ item.name }}</small>
              </div>
            </div>
            <div>
              <b>{{ formatRupiah(order.total) }}</b>
              <br>
              <small>{{ order.items.length }} Item</small>
            </div>
          </div>
        </CCardBody>
      </CCard>
    </div>
  </div>
</template>

<style>
.menus::-webkit-scrollbar,
.item-product::-webkit-scrollbar {
  display: none;
}
</style>
