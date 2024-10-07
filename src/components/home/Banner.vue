<script setup>
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { useStore } from 'vuex';
import { onMounted, ref } from 'vue';
import { CSpinner } from '@coreui/vue'

const store = useStore()
const categories = ref([])
const modules = [Navigation, Pagination, Scrollbar, A11y]
const isLoading = ref(false)

onMounted(() => {
  getBanner()
})

const getBanner = async () => {
  isLoading.value = true

  try {
    const response = await store.dispatch("postData", ["categories", {
      type: store.state.CATEGORY_TYPE.BANNER
    }])

    if (response.code == store.state.STATUS_CODE.DATA_OK) {
      categories.value = response.data
    }
  } catch (error) {
  } finally {
    isLoading.value = false
  }
}

const onSwiper = (swiper) => {
  // console.log(swiper);
};

const onSlideChange = () => {
  // console.log('slide change');
};
</script>

<template>
  <div class="d-flex align-items-center justify-content-center" style="margin-top: 5rem;" v-if="isLoading">
    <CSpinner class="mb-3" />
  </div>
  <div>
    <swiper :modules="modules" :slides-per-view="1" :space-between="5" @swiper="onSwiper" @slideChange="onSlideChange"
      :loop="true" class="mb-4" :style="isLoading ? '' : 'margin-top: 4rem;'" :breakpoints="{
        640: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 30,
        }
      }">
      <swiper-slide v-for="(category, index) in categories" :key="index">
        <router-link :to="{ name: 'categoryIndex', params: { slug: category.slug } }">
          <img :src="category.image" class="rounded-2" width="100%" height="136">
        </router-link>
      </swiper-slide>
    </swiper>
  </div>
</template>