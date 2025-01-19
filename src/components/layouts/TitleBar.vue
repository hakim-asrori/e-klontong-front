<script setup>
import { CCard, CCardBody } from "@coreui/vue";
import { useRouter } from "vue-router";

const $emit = defineEmits(["showFilter"]);

const $props = defineProps({
  title: {
    default: "Title",
    type: String,
  },
  showBack: {
    default: true,
    type: Boolean,
  },
  showCart: {
    default: true,
    type: Boolean,
  },
  showFilter: {
    default: false,
    type: Boolean,
  },
});
const $router = useRouter();

const toBack = () => {
  $router.back(-1);
};

const toCart = () => {
  $router.push({ name: "cartIndex" });
};

const toFilter = () => {
  $emit("showFilter", true);
};
</script>

<template>
  <CCard class="rounded-0 fixed-top border-0">
    <CCardBody class="py-3">
      <div class="d-flex align-items-center justify-content-between">
        <div @click="toBack()" class="pointer-cursor" v-if="showBack">
          <i class="fa-solid fa-chevron-left"></i>
        </div>
        <div v-else>
          <span v-for="(it, index) in 4">&nbsp;</span>
        </div>
        <h5 class="m-0 p-0 text-primary text-capitalize">{{ title }}</h5>
        <div
          v-if="showCart || showFilter"
          class="d-flex gap-2 align-items-center"
        >
          <div @click="toFilter()" class="pointer-cursor" v-if="showFilter">
            <i class="fa-solid fa-filter text-primary"></i>
          </div>
          <div @click="toCart()" class="pointer-cursor" v-if="showCart">
            <i class="fa-solid fa-shopping-cart text-primary"></i>
          </div>
        </div>
        <div v-else>
          <span v-for="(it, index) in 4">&nbsp;</span>
        </div>
      </div>
    </CCardBody>
  </CCard>
  <div class="page-null"></div>
</template>

<style scoped>
.page-null {
  margin-top: 60px;
}
</style>
