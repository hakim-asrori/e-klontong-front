<script setup>
import util from "@/store/services/util";
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardImage,
  CCardTitle,
  CCardText,
  CSpinner,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CImage,
  CModalFooter,
  CButton,
} from "@coreui/vue";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const $store = useStore();
const $router = useRouter();
const categories = ref([]);
const isLoading = ref(false);

onMounted(() => {
  getCategories();
});

const getCategories = async () => {
  isLoading.value = true;

  try {
    const response = await $store.dispatch("postData", [
      "categories",
      {
        enable_home: 1,
      },
    ]);

    if (response.code == $store.state.STATUS_CODE.DATA_OK) {
      categories.value = response.data;
    }
  } catch (error) {
  } finally {
    isLoading.value = false;
  }
};

const toDetailProduct = (id) => {
  $router.push({ name: "productDetail", params: { id } });
};

const formatRupiah = (price) => {
  return util.rupiah(price);
};
</script>

<template>
  <div
    v-if="categories.length > 0"
    v-for="(category, index) in categories"
    :key="index"
    class="mb-3"
  >
    <div class="mb-3 d-flex align-items-center justify-content-between">
      <h4 class="fw-bold">{{ category.name }}</h4>
      <router-link
        :to="{ name: 'categoryIndex', params: { slug: category.slug } }"
        class="small text-decoration-none fw-semibold"
        >See All</router-link
      >
    </div>
    <div
      class="d-flex align-items-center justify-content-center"
      v-if="isLoading"
    >
      <CSpinner class="mb-3" />
    </div>
    <CRow v-if="category.direction == 1" class="">
      <CCol
        lg="3"
        md="4"
        v-for="(product, index) in category.products"
        :key="index"
        class="mb-3 col-6"
      >
        <CCard
          class="h-100"
          style="cursor: pointer"
          @click="toDetailProduct(product.slug)"
        >
          <CCardImage orientation="top" :src="product.images" height="150" />
          <CCardBody class="text-center p-1 w-100">
            <CCardTitle>{{ product.name }}</CCardTitle>
            <CCardText>
              {{ formatRupiah(product.price) }}
            </CCardText>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    <div
      class="d-flex gap-3 overflow-x-auto content"
      v-if="category.direction == 0"
    >
      <CCard
        v-for="(product, index) in category.products"
        :key="index"
        class="mb-3 card"
        style="max-width: 175px; width: 100%; min-width: 175px; cursor: pointer"
        @click="toDetailProduct(product.slug)"
      >
        <CCardImage orientation="top" :src="product.images" height="150" />
        <CCardBody class="text-center p-1 w-100">
          <CCardTitle>{{ product.name }}</CCardTitle>
          <CCardText>
            {{ formatRupiah(product.price) }}
          </CCardText>
        </CCardBody>
      </CCard>
    </div>
    <hr />
  </div>
</template>

<style scoped>
.content::-webkit-scrollbar {
  display: none;
}
</style>
