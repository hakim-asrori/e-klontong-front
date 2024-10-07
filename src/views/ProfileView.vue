<script setup>
import { CListGroup, CListGroupItem } from '@coreui/vue'
</script>

<template>
  <div style="height: 90vh;" class="d-flex flex-column justify-content-center">
    <div class="mb-2 d-flex flex-column align-items-center">
      <img src="https://astylers.com/evone/evone02/images/user-buyer6.png" alt="" style="border-radius: 50%;">
      <h4 class="my-2">Hakim Asrori</h4>
      <div>
        <i class="fa-solid fa-location-dot"></i>
        Indramayu
      </div>
    </div>
    <CListGroup flush>
      <a class="list-group-item">
        &nbsp;
      </a>
      <a href="" class="list-group-item d-flex justify-content-between align-items-center">
        <div>
          <i class="text-primary fa-solid fa-heart me-3"></i>
          <span class="fw-semibold">Wishlist</span>
        </div>
        <i class="fa-solid fa-chevron-right text-secondary"></i>
      </a>
      <a href="" class="list-group-item d-flex justify-content-between align-items-center">
        <div>
          <i class="text-primary fa-solid fa-bell me-3"></i>
          <span class="fw-semibold">Notification</span>
        </div>
        <i class="fa-solid fa-chevron-right text-secondary"></i>
      </a>
      <a href="" class="list-group-item d-flex justify-content-between align-items-center">
        <div>
          <i class="text-primary fa-solid fa-credit-card me-3"></i>
          <span class="fw-semibold">Transaction</span>
        </div>
        <i class="fa-solid fa-chevron-right text-secondary"></i>
      </a>
      <a href="" class="list-group-item d-flex justify-content-between align-items-center">
        <div>
          <i class="text-primary fa-solid fa-gear me-3"></i>
          <span class="fw-semibold">Settings</span>
        </div>
        <i class="fa-solid fa-chevron-right text-secondary"></i>
      </a>
      <a href="" class="list-group-item d-flex justify-content-between align-items-center">
        <div>
          <i class="text-primary fa-solid fa-question me-3"></i>
          <span class="fw-semibold">Help Center</span>
        </div>
        <i class="fa-solid fa-chevron-right text-secondary"></i>
      </a>
      <a href="" class="list-group-item d-flex justify-content-between align-items-center">
        <div>
          <i class="text-primary fa-solid fa-sign-out me-3"></i>
          <span class="fw-semibold">Logout</span>
        </div>
        <i class="fa-solid fa-chevron-right text-secondary"></i>
      </a>
      <a class="list-group-item">
        &nbsp;
      </a>
    </CListGroup>
  </div>
</template>