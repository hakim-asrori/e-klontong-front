<script setup>
import { CCard, CCardBody, CCardHeader } from '@coreui/vue';
</script>

<template>
  <div class="h-container">
    <router-link :to="{ name: 'deliveryProduct', params: { delivery: 'udara' } }" class="text-decoration-none">
      <CCard style="min-height: 45vh;" class="rounded-0 border-0 bg-primary-subtle">
        <CCardHeader class="border-0 bg-primary-subtle pt-4 ps-5">
          <h1 style="font-size: 3rem;">Udara</h1>
        </CCardHeader>
        <CCardBody class="position-relative">
          <div class="position-absolute" style="bottom: 5rem; right: 3rem; transform: rotate(-20deg);">
            <i class="fa-solid fa-plane fa-2xl" style="font-size: 7rem;"></i>
          </div>
        </CCardBody>
      </CCard>
    </router-link>
    <router-link :to="{ name: 'deliveryProduct', params: { delivery: 'laut' } }" class="text-decoration-none">
      <CCard style="min-height: 48vh;" class="rounded-0 border-0 bg-success-subtle">
        <CCardHeader class="border-0 bg-success-subtle pt-4 ps-5">
          <h1 style="font-size: 3rem;">Laut</h1>
        </CCardHeader>
        <CCardBody class="position-relative">
          <div class="position-absolute" style="bottom: 5rem; right: 3rem; transform: rotate(-20deg);">
            <i class="fa-solid fa-ferry fa-2xl" style="font-size: 7rem;"></i>
          </div>
        </CCardBody>
      </CCard>
    </router-link>
  </div>
</template>

<style scoped>
.h-container {
  max-height: 100vh;
}
</style>
