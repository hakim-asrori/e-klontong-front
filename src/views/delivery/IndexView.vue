<script setup>
import { CCard, CCardBody, CCardHeader, CCardText, CImage } from "@coreui/vue";
import planeImage from "@/assets/img/icons/plane.png";
import ferryImage from "@/assets/img/icons/ferry.png";
</script>

<template>
  <div
    class="h-container d-flex align-items-center justify-content-center gap-4"
  >
    <router-link
      to="/delivery/udara"
      class="text-decoration-none card shadow-sm"
    >
      <CCardBody>
        <CImage :src="planeImage" />
        <CCardText class="text-center mt-3 fw-bold h3">Udara</CCardText>
      </CCardBody>
    </router-link>
    <router-link
      to="/delivery/laut"
      class="text-decoration-none card shadow-sm"
    >
      <CCardBody>
        <CImage :src="ferryImage" />
        <CCardText class="text-center mt-3 fw-bold h3">Laut</CCardText>
      </CCardBody>
    </router-link>
  </div>
</template>

<style scoped>
.h-container {
  min-height: 90vh;
  width: 100%;
}
</style>
