<script setup>
import { CRow, CCol, CCard, CCardBody, CSpinner } from '@coreui/vue'
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore()
const categories = ref([])
const isLoading = ref(false)

onMounted(() => {
  getCategory()
})

const getCategory = async () => {
  isLoading.value = true

  try {
    const response = await store.dispatch("postData", ["categories", {
      type: store.state.CATEGORY_TYPE.MENU
    }])

    if (response.code == store.state.STATUS_CODE.DATA_OK) {
      categories.value = response.data
    }
  } catch (error) {
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <h4 class="fw-bold mb-3">Categories</h4>
  <div class="d-flex align-items-center justify-content-center" v-if="isLoading">
    <CSpinner class="mb-3" />
  </div>
  <div v-else class="d-flex mb-4 overflow-x-auto content"
    :class="categories.length == 2 ? 'align-items-center justify-content-start gap-4' : 'justify-content-between'">
    <router-link :to="{ name: 'categoryIndex', params: { slug: category.slug } }"
      v-for="(category, index) in categories" :key="index"
      class="d-flex flex-column align-items-center text-decoration-none h-card">
      <CCard class="px-2 py-2 mb-2 border-0 d-flex align-items-center justify-content-center"
        style="box-shadow: 0 2px 10px -1px rgba(0, 0, 0, 0.15);">
        <img :src="category.image" width="30" height="30" alt="">
      </CCard>
      <small class="text-secondary">{{ category.name }}</small>
    </router-link>
  </div>
</template>

<style scoped>
.h-card div {
  min-height: 50px;
  min-width: 50px;
}

.content::-webkit-scrollbar {
  display: none;
}
</style>