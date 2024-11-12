<script setup>
import TitleBar from "@/components/layouts/TitleBar.vue";
import util from "@/store/services/util";
import {
  CButton,
  CCard,
  CCardBody,
  CCardImage,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CSpinner,
} from "@coreui/vue";
import { onMounted, onUnmounted, onUpdated, ref, useTemplateRef } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import Swal from "sweetalert2";

const $props = defineProps(["id"]);
const $store = useStore();
const $router = useRouter();
const product = ref({});
const isLoading = ref(false);
const showImage = ref(false);

onMounted(() => {
  getProduct();
});

const getProduct = async () => {
  isLoading.value = true;

  try {
    const response = await $store.dispatch("postData", [
      "products",
      {
        slug: $props.id,
      },
    ]);

    if (response.code == $store.state.STATUS_CODE.DATA_OK) {
      product.value = response.data;
    } else {
      $router.back(-1);
    }
  } catch (error) {
  } finally {
    isLoading.value = false;
  }
};

const addToCart = async (product) => {
  isLoading.value = true;

  try {
    const response = await $store.dispatch("postData", [
      "cart/store",
      {
        product_id: product.id,
      },
    ]);

    if (response.code == $store.state.STATUS_CODE.DATA_OK) {
      Swal.fire({
        title: "Wooww",
        text: response.messages,
        icon: "success",
      });
    } else {
      Swal.fire({
        title: "Ooops",
        text: response.messages,
        icon: "error",
      });
    }
  } catch (error) {
    if (error.status == 401) {
      $router.push({ name: "login" });
    }
  } finally {
    isLoading.value = false;
  }
};

const formatRupiah = (price) => {
  return util.rupiah(price);
};
</script>

<template>
  <TitleBar :title="product.name ?? 'Product Detail'" :show-back="true" />
  <div
    class="d-flex align-items-center justify-content-center mt-5"
    v-if="isLoading"
  >
    <CSpinner class="mb-3" />
  </div>
  <div v-else>
    <a
      href="#"
      @click="
        () => {
          showImage = true;
        }
      "
    >
      <CCardImage orientation="top" :src="product.image" height="250" />
    </a>
    <div class="px-4 h-mt-auto mb-3">
      <CCard class="shadow border-0">
        <CCardBody class="p-2">
          <div class="d-flex align-items-center gap-2">
            <i class="fa-solid fa-sm fa-layer-group text-primary"></i>
            <span v-if="product.categories">{{
              product.categories.join(", ")
            }}</span>
          </div>
          <hr class="my-2" />
          <div class="d-flex align-items-center gap-2">
            <i class="fa-solid fa-sm fa-star text-warning"></i>
            <span>{{
              product.totalSales / 5 < 1
                ? "Belum ada Penjualan"
                : product.totalSales / 5
            }}</span>
          </div>
          <hr class="my-2" />
          <div class="d-flex align-items-center gap-2">
            <i class="fa-solid fa-sm fa-truck text-secondary"></i>
            <span>{{ product.deliveryService }}</span>
          </div>
          <hr class="my-2" />
          <div class="d-flex align-items-center gap-2">
            <i class="fa-solid fa-sm fa-weight-hanging text-danger"></i>
            <span>{{ `${product.weight} ${product.weightType}` }}</span>
          </div>
        </CCardBody>
      </CCard>
    </div>
    <div class="container">
      <h6>Description</h6>
      <p>{{ product.description }}</p>
    </div>
    <CCard class="fixed-bottom rounded-0 border-top border-0">
      <CCardBody>
        <button
          class="w-100 btn btn-primary d-flex align-items-center justify-content-between"
          @click="addToCart(product)"
        >
          <span class="d-flex align-items-center gap-2">
            <i class="fa-solid fa-shopping-cart"></i>
            <h6 class="m-0 p-0">Add to cart</h6>
          </span>
          <span>{{ formatRupiah(product.price) }}</span>
        </button>
      </CCardBody>
    </CCard>
  </div>

  <CModal
    :visible="showImage"
    @close="
      () => {
        showImage = false;
      }
    "
    aria-labelledby="LiveDemoExampleLabel"
  >
    <CModalBody>
      <img :src="product.image" width="100%" height="300" />
    </CModalBody>
    <CModalFooter>
      <CButton
        color="secondary"
        @click="
          () => {
            showImage = false;
          }
        "
      >
        Close
      </CButton>
    </CModalFooter>
  </CModal>
</template>

<style scoped>
.h-mt-auto {
  margin-top: -80px;
}

.container {
  margin-bottom: 6rem;
}

.card:not(.fixed-bottom) .card-body span {
  font-size: 13px;
}
</style>
