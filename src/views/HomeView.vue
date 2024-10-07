<script setup>
import 'sweetalert2/dist/sweetalert2.min.css'

import { CContainer } from '@coreui/vue'
import Search from "../components/home/Search.vue"
import Banner from "../components/home/Banner.vue"
import Category from "../components/home/Category.vue"
import ProductLatest from "../components/home/ProductLatest.vue"
import ProductPopular from "../components/home/ProductPopular.vue"
</script>

<template>
  <CContainer style="margin-bottom: 100px;">
    <Search />
    <Banner />
    <Category />
    <ProductLatest />
    <ProductPopular />
  </CContainer>
</template>
