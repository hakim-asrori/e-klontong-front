<script setup>
import util from '@/store/services/util';
import { CCard, CCardBody, CCardHeader } from '@coreui/vue';
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';

const $store = useStore()
const isLoading = ref(false)
const orders = ref([])

onMounted(() => {
  getOrder()
})

const getOrder = async () => {
  isLoading.value = true

  try {
    const response = await $store.dispatch("postData", ["orders", {}]);

    if (response.code == $store.state.STATUS_CODE.DATA_OK) {
      orders.value.push(...response.data)
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

</template>

<style scoped>
.item-product::-webkit-scrollbar {
  display: none;
}
</style>