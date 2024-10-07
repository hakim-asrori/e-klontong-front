<script setup>
import TitleBar from '@/components/layouts/TitleBar.vue';

let carts = localStorage.getItem('carts')
if (!carts) {
  localStorage.setItem('carts', JSON.stringify([]))
}
</script>

<template>
  <TitleBar title="Cart" :show-back="true" :show-cart="false" />

  <div class="container">
    <div class="d-flex align-items-center gap-2 mb-3 fixed-top bg-white pb-2" style="margin-top: 56px; padding: 0 12px">
      <router-link :to="{ name: 'cartUdara' }" class="btn btn-outline-primary w-100 rounded-pill">Udara</router-link>
      <router-link :to="{ name: 'cartAir' }" class="btn btn-outline-primary w-100 rounded-pill">Air</router-link>
    </div>
    <div style="margin-top: 115px;">
      <router-view />
    </div>
  </div>
</template>