<script setup>
import TitleBar from '@/components/layouts/TitleBar.vue';
import util from '@/store/services/util';
import { CCard, CSpinner } from '@coreui/vue';
import Swal from 'sweetalert2';
import { onUnmounted } from 'vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const $props = defineProps(['type'])
const $store = useStore()
const $router = useRouter()
const products = ref([])
const isLoading = ref(false)
const productFilters = ref({
  page: 1,
  per_page: 10,
  sort_by: "id",
  sort_direction: "desc"
})
const productLastPage = ref(false)

onMounted(() => {
  window.addEventListener("scroll", handleScroll)
  getProduct()
})

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll)
})

const getProduct = async () => {
  if (productLastPage.value) {
    return
  }

  isLoading.value = true

  let params = productFilters.value

  if ($props.type == 'all-latests') {
    params.sort_by = 'id'
    params.sort_direction = 'desc'
  }

  if ($props.type == 'all-populars') {
    params.sort_by = 'total_sales'
    params.sort_direction = 'desc'
  }

  try {
    const response = await $store.dispatch("postData", ["products", params])

    if (response.code == $store.state.STATUS_CODE.DATA_OK) {
      if (response.data != undefined && response.data.length > 0) {
        products.value.push(...response.data)
        productFilters.value.page += 1
      } else {
        productLastPage.value = true
      }
    } else {
      Swal.fire({
        title: 'Ooops',
        text: response.messages,
        icon: 'warning',
      }).then((result) => {
        $router.back(-1)
      });
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
    getProduct()
  }
}

const formatRupiah = (price) => {
  return util.rupiah(price)
}

const convertTitleBar = (text) => {
  return text.replace("all-", "Product ").toLowerCase()
}
</script>

<template>
  <TitleBar :title="convertTitleBar(type)" :show-back="true" />

  <div class="pt-2 container" style="margin-bottom: 6rem;">
    <div class="d-flex align-items-center justify-content-center" v-if="isLoading">
      <CSpinner class="mb-3" />
    </div>
    <div v-for="(product, index) in products" :key="index" class="mb-3">
      <router-link :to="{ name: 'productDetail', params: { id: product.slug } }" class="text-decoration-none">
        <CCard class="shadow-sm p-2">
          <div class="d-flex gap-2">
            <img :src="product.image" height="75" width="75" class="rounded">
            <div class="d-flex flex-column justify-content-between">
              <h6 class="m-0 p-0">{{ product.name }}</h6>
              <span>{{ formatRupiah(product.price) }}</span>
              <small class="d-flex align-items-center gap-2">
                <span>{{ (product.totalSales / 5) < 1 ? 0 : (product.totalSales / 5) }}</span>
                    <span>|</span>
                    <span>{{ product.categories.join(", ") }}</span>
                    <span>|</span>
                    <span>{{ product.deliveryService }}</span>
                    <span>|</span>
                    <span>{{ product.weight }} Kg</span>
              </small>
            </div>
          </div>
        </CCard>
      </router-link>
    </div>
  </div>
</template>