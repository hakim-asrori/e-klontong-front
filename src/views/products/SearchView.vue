<script setup>
import util from "@/store/services/util";
import {
  CButton,
  CCard,
  CCardBody,
  CCardImage,
  CCardText,
  CCardTitle,
  CCloseButton,
  CCol,
  CContainer,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CInputGroup,
  CInputGroupText,
  COffcanvas,
  COffcanvasBody,
  COffcanvasHeader,
  COffcanvasTitle,
  CRow,
} from "@coreui/vue";
import { onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const $store = useStore();
const $router = useRouter();
const search = ref(null);
const isSearch = ref(false);
const productPopulars = ref([]);
const perPage = ref(4);
const productFilters = ref({
  page: 1,
  per_page: 10,
  sort_by: "last_seen",
  sort_direction: "desc",
});
const productLastPage = ref(false);
const isLoading = ref(false);
const showAllFilter = ref(false);

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  getProductPopular();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

const getProductPopular = async () => {
  if (productLastPage.value) {
    return;
  }

  isLoading.value = true;

  let params = productFilters.value;
  params.per_page = perPage;
  params.search = search.value;

  try {
    const response = await $store.dispatch("postData", ["products", params]);

    if (response.code == $store.state.STATUS_CODE.DATA_OK) {
      if (response.data != undefined && response.data.length > 0) {
        productPopulars.value.push(...response.data);
        productFilters.value.page += 1;
      } else {
        productLastPage.value = true;
      }
    } else {
      productPopulars.value = [];
    }
  } catch (error) {
  } finally {
    isLoading.value = false;
  }
};

const onSearchActive = (filter) => {
  perPage.value = 4;
  isSearch.value = true;
  search.value = filter;
  productFilters.value.page = 1;
  productLastPage.value = false;
  productPopulars.value = [];
  getProductPopular();
};

let searchTimeout;
const onSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  if (search.value.length < 1) {
    perPage.value = 4;
    isSearch.value = false;
  } else {
    perPage.value = 10;
  }
  productPopulars.value = [];
  productFilters.value.page = 1;
  productLastPage.value = false;

  searchTimeout = setTimeout(() => {
    getProductPopular();
  }, 300);
};

const handleScroll = () => {
  const bottomOfWindow =
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 10;

  if (bottomOfWindow && !isLoading.value && isSearch) {
    getProductPopular();
  }
};

const handleFilter = () => {
  productFilters.value.page = 1;
  productPopulars.value = [];
  showAllFilter.value = false;
  getProductPopular();
};

const handleCancelFilter = () => {
  productFilters.value.search = "";
  productFilters.value.sort_by = "last_seen";
  productFilters.value.sort_direction = "desc";
  handleFilter();
};

const formatRupiah = (price) => {
  return util.rupiah(price);
};

const toDetailProduct = (id) => {
  $router.push({ name: "productDetail", params: { id } });
};
</script>

<template>
  <div
    fluid
    class="gap-sm-4 gap-3 d-flex flex-row align-items-center justify-content-between py-3 mb-3 fixed-top bg-white px-3"
  >
    <router-link :to="{ name: 'home' }">
      <i class="fa-solid fa-chevron-left"></i>
    </router-link>
    <CInputGroup size="sm" style="background-color: #e4e4e4" class="rounded">
      <CFormInput
        placeholder="Search for products"
        style="background-color: #e4e4e4"
        autofocus
        v-model="search"
        @keyup="onSearch()"
      />
      <CButton style="background-color: #e4e4e4"
        ><i
          class="fa-solid fa-search"
          @click="isSearch = true"
          style="color: rgba(37, 43, 54, 0.6)"
        ></i>
      </CButton>
      <CButton style="background-color: #e4e4e4" @click="showAllFilter = true">
        <i class="fa-solid fa-filter text-primary"></i>
      </CButton>
    </CInputGroup>
  </div>

  <div style="margin-top: 4.5rem" class="px-3" v-if="!isSearch">
    <div
      v-for="(productPopular, index) in productPopulars"
      :key="index"
      @click="onSearchActive(productPopular.name)"
      class="text-dark"
      style="cursor: pointer"
    >
      <h6>{{ productPopular.name }}</h6>
      <hr />
    </div>
  </div>

  <div v-else style="margin-top: 4.5rem" class="px-3">
    <CRow class="">
      <CCol
        lg="3"
        md="4"
        class="col-6 mb-3"
        v-for="(product, index) in productPopulars"
        :key="index"
      >
        <CCard
          style="cursor: pointer"
          @click="toDetailProduct(product.slug)"
          class="h-100"
        >
          <CCardImage orientation="top" :src="product.image" height="150" />
          <CCardBody class="text-center p-1 w-100">
            <CCardTitle>{{ product.name }}</CCardTitle>
            <CCardText>
              {{ formatRupiah(product.price) }}
            </CCardText>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>

  <COffcanvas
    placement="end"
    :visible="showAllFilter"
    @hide="
      () => {
        showAllFilter = !showAllFilter;
      }
    "
  >
    <COffcanvasHeader>
      <COffcanvasTitle>Filter</COffcanvasTitle>
      <CCloseButton
        class="text-reset"
        @click="
          () => {
            showAllFilter = false;
          }
        "
      />
    </COffcanvasHeader>
    <COffcanvasBody>
      <CForm @submit.prevent="handleFilter()">
        <CFormLabel>Price</CFormLabel>
        <CFormCheck
          :checked="
            productFilters.sort_by == 'price' &&
            productFilters.sort_direction == 'asc'
          "
          type="radio"
          name="flexRadioDefault"
          label="Sort from lowest price"
          :value="JSON.stringify({ sort_by: 'price', sort_direction: 'asc' })"
          @change="
            ($event) => {
              productFilters.sort_by = JSON.parse($event.target.value).sort_by;
              productFilters.sort_direction = JSON.parse(
                $event.target.value
              ).sort_direction;
            }
          "
        />
        <CFormCheck
          :checked="
            productFilters.sort_by == 'price' &&
            productFilters.sort_direction == 'desc'
          "
          type="radio"
          name="flexRadioDefault"
          label="Sort by most expensive price"
          :value="JSON.stringify({ sort_by: 'price', sort_direction: 'desc' })"
          @change="
            ($event) => {
              productFilters.sort_by = JSON.parse($event.target.value).sort_by;
              productFilters.sort_direction = JSON.parse(
                $event.target.value
              ).sort_direction;
            }
          "
        />
        <hr />
        <CButton type="submit" class="w-100 mb-3" color="primary"
          >Apply Changes</CButton
        >
        <CButton
          @click="handleCancelFilter()"
          class="w-100"
          color="primary"
          variant="outline"
          >Clear Changes</CButton
        >
      </CForm>
    </COffcanvasBody>
  </COffcanvas>
</template>

<style scoped></style>
