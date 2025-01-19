<script setup>
import TitleBar from "@/components/layouts/TitleBar.vue";
import util from "@/store/services/util";
import {
  CButton,
  CCard,
  CCloseButton,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  COffcanvas,
  COffcanvasBody,
  COffcanvasHeader,
  COffcanvasTitle,
  CRow,
  CSpinner,
} from "@coreui/vue";
import Swal from "sweetalert2";
import { onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const $props = defineProps(["slug"]);
const $store = useStore();
const $router = useRouter();
const products = ref([]);
const category = ref({});
const isLoading = ref(false);
const productFilters = ref({
  page: 1,
  per_page: 10,
  category: "",
  sort_by: "id",
  sort_direction: "desc",
  search: "",
});
const productLastPage = ref(false);
const showAllFilter = ref(false);

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  getCategory();
  getProduct();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

const getCategory = async () => {
  isLoading.value = true;

  try {
    const response = await $store.dispatch("postData", [
      "categories",
      {
        slug: $props.slug,
      },
    ]);

    if (response.code == $store.state.STATUS_CODE.DATA_OK) {
      category.value = response.data;
    } else {
      Swal.fire({
        title: "Ooops",
        text: response.messages,
        icon: "warning",
      }).then((result) => {
        $router.back(-1);
      });
    }
  } catch (error) {
  } finally {
    isLoading.value = false;
  }
};

const getProduct = async () => {
  if (productLastPage.value) {
    return;
  }

  isLoading.value = true;

  productFilters.value.category = $props.slug;

  try {
    const response = await $store.dispatch("postData", [
      "products",
      productFilters.value,
    ]);

    if (response.code == $store.state.STATUS_CODE.DATA_OK) {
      if (response.data != undefined && response.data.length > 0) {
        products.value.push(...response.data);
        productFilters.value.page += 1;
      } else {
        productLastPage.value = true;
      }
    } else {
      Swal.fire({
        title: "Ooops",
        text: response.messages,
        icon: "warning",
      }).then((result) => {
        $router.back(-1);
      });
    }
  } catch (error) {
  } finally {
    isLoading.value = false;
  }
};

const handleScroll = () => {
  const bottomOfWindow =
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 10;

  if (bottomOfWindow && !isLoading.value) {
    getProduct();
  }
};

const handleFilter = () => {
  productFilters.value.page = 1;
  products.value = [];
  showAllFilter.value = false;
  getProduct();
};

const handleCancelFilter = () => {
  productFilters.value.search = "";
  productFilters.value.sort_by = "id";
  productFilters.value.sort_direction = "desc";
  handleFilter();
};

const formatRupiah = (price) => {
  return util.rupiah(price);
};
</script>

<template>
  <TitleBar
    :title="category.name ?? 'Category'"
    :show-back="true"
    :show-filter="true"
    @show-filter="($e) => (showAllFilter = $e)"
  />

  <div class="pt-2 container mb-5">
    <div
      class="d-flex align-items-center justify-content-center"
      v-if="isLoading"
    >
      <CSpinner class="mb-3" />
    </div>
    <div v-for="(product, index) in products" :key="index" class="mb-3">
      <router-link
        :to="{ name: 'productDetail', params: { id: product.slug } }"
        class="text-decoration-none"
      >
        <CCard class="shadow-sm p-2">
          <div class="d-flex gap-2">
            <img :src="product.image" height="75" width="75" class="rounded" />
            <div class="d-flex flex-column justify-content-between">
              <h6 class="m-0 p-0">{{ product.name }}</h6>
              <span>{{ formatRupiah(product.price) }}</span>
              <small class="d-flex align-items-center gap-2">
                <span>{{
                  product.totalSales / 5 < 1 ? 0 : product.totalSales / 5
                }}</span>
                <span>|</span>
                <span>{{ product.categories.join(", ") }}</span>
                <span>|</span>
                <span>{{ product.deliveryService }}</span>
                <span>|</span>
                <span>{{ `${product.weight} ${product.weightType}` }}</span>
              </small>
            </div>
          </div>
        </CCard>
      </router-link>
    </div>
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
        <CFormInput
          label="Search"
          type="search"
          @input="($event) => (productFilters.search = $event.target.value)"
        />
        <hr />
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
