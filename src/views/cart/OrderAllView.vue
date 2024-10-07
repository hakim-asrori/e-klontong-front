<script setup>
import util from '@/store/services/util';
import { CButton, CCard, CCardBody, CCardHeader } from '@coreui/vue';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { ref } from 'vue';
import { onMounted } from 'vue';
import { useStore } from 'vuex';
import $ from "jquery"
import TitleBar from '@/components/layouts/TitleBar.vue';
import { useRouter } from 'vue-router';

const $refs = defineProps(['delivery'])
const $store = useStore()
const $router = useRouter()
const cart = ref([])
const isLoading = ref(false)
const totalPrice = ref(0)
const address = ref(null);
const validation = ref({})

onMounted(() => {
  getAddress()
  getCart()
})

const getAddress = async () => {
  isLoading.value = true

  try {
    const response = await $store.dispatch("postData", ["address/default", {}])

    if (response.code == $store.state.STATUS_CODE.DATA_OK) {
      address.value = response.data
    }
  } catch (error) {
  } finally {
    isLoading.value = false
  }
}

const getCart = async () => {
  isLoading.value = true
  let user = JSON.parse(Cookies.get("user"))

  try {
    const response = await $store.dispatch("postData", ["carts", {
      user_id: user.id,
      delivery: $refs.delivery,
      checked: 1
    }])

    if (response.code == $store.state.STATUS_CODE.DATA_OK) {
      cart.value = response.data

      response.data.items.forEach(item => {
        totalPrice.value += Number(item.totalPrice)
      });
    }

  } catch (error) {
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  isLoading.value = true

  let body = {
    address_id: address.value.id,
    service: $refs.delivery,
    item_ids: [],
    address: `${address.value.detail}, ${address.value.villageName}, ${address.value.districtName}, ${address.value.regencyName}, ${address.value.provinceName}, ID`,
    name: address.value.name,
    phone: address.value.phone
  }

  cart.value.items.forEach(item => {
    body.item_ids.push(item.id)
  });

  try {
    const response = await $store.dispatch("postData", ["order/store", body])

    if (response.code == $store.state.STATUS_CODE.DATA_OK) {
      Swal.fire({
        title: 'Wooww',
        text: response.messages,
        icon: 'success',
      }).then(() => {
        window.open(response.data)
        $router.push({ name: 'order' })
      });
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

const formatRupiah = (price) => {
  return util.rupiah(price)
}
</script>

<template>
  <form action="" @submit.prevent="handleSubmit" method="post">
    <TitleBar title="Checkout" :show-cart="false" :show-back="!isLoading" />
    <p v-if="cart && cart.items && cart.items.length < 1" class="d-flex align-items-center justify-content-center"
      style="min-height: 50vh;">
      Data not available.
    </p>
    <div v-if="cart && cart.items && cart.items.length > 0" class="bg-light" style="margin-bottom: 6rem;">
      <CCard class="mb-2 shadow-sm border-0 rounded-0">
        <CCardBody>
          <router-link :to="{ name: 'indexAddress' }"
            class="d-flex align-items-start flex-column gap-1 text-decoration-none">
            <div class="d-flex w-100">
              <i class="fa-solid fa-location-dot pt-1"></i>
              <div class="d-flex align-items-center justify-content-between w-100">
                <span class="text-capitalize ms-3 fw-semibold">shipping address</span>
                <i class="fa-solid fa-chevron-right"></i>
              </div>
            </div>
            <div class="d-flex gap-4 text-dark">
              <span>&nbsp;</span>
              <p v-if="address" class="m-0 p-0">
                <small>{{ address.name }} | ({{ address.phone }})</small> <br>
                <small>{{ `${address.villageName}, ${address.districtName}, ${address.regencyName},
                  ${address.provinceName}, ID` }}</small>
              </p>
              <p v-else class="m-0 p-0">Set your address</p>
            </div>
          </router-link>
        </CCardBody>
      </CCard>
      <CCard class="mb-2 shadow-sm border-0 rounded-0">
        <CCardBody>
          <hr>
          <div class="mb-3" v-for="(cart, index) in cart.items">
            <div class="d-flex gap-2 align-items-center">
              <img :src="cart.image" height="75" width="75" class="rounded">
              <div class="d-flex flex-column justify-content-between gap-4 w-100">
                <h6 class="m-0 p-0">{{ cart.name }}</h6>
                <div class="d-flex align-items-center justify-content-between">
                  <span class="text-primary fw-semibold">{{ formatRupiah(cart.price) }}</span>
                  <span>x{{ cart.quantity }}</span>
                </div>
              </div>
            </div>
            <hr>
          </div>
        </CCardBody>
      </CCard>
      <CCard class="mb-2 shadow-sm border-0 rounded-0">
        <CCardBody>
          <div class="d-flex gap-2 align-items-center justify-content-between">
            <p class="m-0 p-0 fw-bold">Delivery Service</p>
            <p class="m-0 p-0">
              <span v-if="delivery == 1">Laut</span>
              <span v-if="delivery == 2">Udara</span>
            </p>
          </div>
        </CCardBody>
      </CCard>
    </div>

    <CCard class="fixed-bottom rounded-0 border-top border-0">
      <CCardBody class="py-2">
        <div class="d-flex align-items-center justify-content-between">
          <div>
            <small>Total :</small>
            <h5 class="m-0 p-0 fw-bold text-primary">{{ formatRupiah(totalPrice) }}</h5>
          </div>
          <button type="submit" class="btn btn-primary d-flex align-items-center justify-content-between fw-semibold"
            :class="{ 'disabled': !address }" v-if="!isLoading">
            Order
          </button>
          <button class="btn btn-primary" type="button" disabled v-if="isLoading">
            <span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
            <span role="status">Waiting...</span>
          </button>
        </div>
      </CCardBody>
    </CCard>
  </form>
</template>