<script setup>
import TitleBar from '@/components/layouts/TitleBar.vue';
import { CButton, CCard, CCardBody, CCardFooter, CFormCheck, CFormInput, CFormSelect } from '@coreui/vue';
import Swal from 'sweetalert2';
import { ref, watch } from 'vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import vSelect from 'vue-select'
import { useStore } from 'vuex';
import _ from 'lodash';

const $store = useStore()
const $router = useRouter()
const address = ref({
  province_id: 0,
  regency_id: 0,
  district_id: 0,
  village_id: 0,
  name: "",
  phone: "",
  detail: "",
  is_default: 0
})
const validation = ref({})
const isLoading = ref(false)
const provinces = ref([])
const regencies = ref([])
const districts = ref([])
const villages = ref([])
const provinceSelected = ref(null)
const regencySelected = ref(null)
const districtSelected = ref(null)
const villageSelected = ref(null)
const regionFilter = ref({
  provinceSearch: "",
  regencySearch: "",
  districtSearch: "",
  villageSearch: "",
})

onMounted(() => {
  getProvince()
})

watch(provinceSelected, (newValue, oldValue) => {
  if (oldValue && newValue && Number(newValue.id) != Number(oldValue.id)) {
    address.value.regency_id = 0
    address.value.district_id = 0
    address.value.village_id = 0

    regencySelected.value = null
    districtSelected.value = null
    villageSelected.value = null
  }

  address.value.province_id = newValue ? newValue.id : 0
  getRegency()
})

watch(regencySelected, (newValue, oldValue) => {
  if (oldValue && newValue && Number(newValue.id) != Number(oldValue.id)) {
    address.value.district_id = 0
    address.value.village_id = 0

    districtSelected.value = null
    villageSelected.value = null
  }

  address.value.regency_id = newValue ? newValue.id : 0
  getDistrict()
})

watch(districtSelected, (newValue, oldValue) => {
  if (oldValue && newValue && Number(newValue.id) != Number(oldValue.id)) {
    address.value.village_id = 0

    villageSelected.value = null
  }

  address.value.district_id = newValue ? newValue.id : 0
  getVillage()
})

watch(villageSelected, (newValue, oldValue) => {
  address.value.village_id = newValue ? newValue.id : 0
})

const getProvince = async () => {
  try {
    const response = await $store.dispatch("postData", ["address/provinces", {
      search: regionFilter.value.provinceSearch
    }])

    if (response.code == $store.state.STATUS_CODE.DATA_OK) {
      provinces.value = response.data
    }
  } catch (error) {
  }
}

const getRegency = async () => {
  try {
    const response = await $store.dispatch("postData", ["address/regencies", {
      province_id: address.value.province_id,
      search: regionFilter.value.regencySearch
    }])

    if (response.code == $store.state.STATUS_CODE.DATA_OK) {
      regencies.value = response.data
    }
  } catch (error) {
  }
}

const getDistrict = async () => {
  try {
    const response = await $store.dispatch("postData", ["address/districts", {
      regency_id: address.value.regency_id,
      search: regionFilter.value.districtSearch
    }])

    if (response.code == $store.state.STATUS_CODE.DATA_OK) {
      districts.value = response.data
    }
  } catch (error) {
  }
}

const getVillage = async () => {
  try {
    const response = await $store.dispatch("postData", ["address/villages", {
      district_id: address.value.district_id,
      search: regionFilter.value.villageSearch
    }])

    if (response.code == $store.state.STATUS_CODE.DATA_OK) {
      villages.value = response.data
    }
  } catch (error) {
  }
}

const onSearchProvince = _.debounce((e) => {
  regionFilter.value.provinceSearch = e.target.value
  getProvince()
}, 500)

const onSearchRegency = _.debounce((e) => {
  regionFilter.value.regencySearch = e.target.value
  getRegency()
}, 500)

const onSearchDistrict = _.debounce((e) => {
  regionFilter.value.districtSearch = e.target.value
  getDistrict()
}, 500)

const onSearchVillage = _.debounce((e) => {
  regionFilter.value.villageSearch = e.target.value
  getVillage()
}, 500)

const handleSubmit = async () => {
  isLoading.value = true

  try {
    const response = await $store.dispatch("postData", ["address/store", address.value])

    if (response.code == $store.state.STATUS_CODE.DATA_OK) {
      Swal.fire({
        title: 'Wooww',
        text: response.messages,
        icon: 'success',
      }).then(() => {
        $router.back(-1)
      });
    } else {
      if (response.code == $store.state.STATUS_CODE.INVALID_BODY) {
        validation.value = response.data
      }

      Swal.fire({
        title: 'Ooops',
        text: response.messages,
        icon: 'error',
      })
    }
  } catch (error) {

  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <TitleBar title="New Address" :show-cart="false" />
  <form @submit.prevent="handleSubmit">
    <CCard class="rounded-0 border-0 address">
      <CCardBody>
        <div class="mb-3">
          <CFormInput class="border-0 border-bottom rounded-0" placeholder="Full Name" required v-model="address.name"
            :disabled="isLoading" :class="{ 'is-invalid': validation.name }" />
          <div class="invalid-feedback" v-if="validation.name" v-for="(error, index) in validation.name" :key="index">
            {{ error }}
          </div>
        </div>
        <div class="mb-3">
          <CFormInput class="border-0 border-bottom rounded-0" placeholder="Phone Number" required
            v-model="address.phone" :disabled="isLoading" :class="{ 'is-invalid': validation.phone }" />
          <div class="invalid-feedback" v-if="validation.phone" v-for="(error, index) in validation.phone" :key="index">
            {{ error }}
          </div>
        </div>
        <div class="mb-3">
          <vSelect label="name" value="id" id="province" placeholder="Choose Province" :options="provinces"
            v-model="provinceSelected">
            <template #search="{ attributes, events }">
              <input class="vs__search" :required="!address.province_id" v-bind="attributes" v-on="events"
                :disabled="isLoading" :class="{ 'is-invalid': validation.province_id }"
                @input="onSearchProvince($event)" />
              <div class="invalid-feedback" v-if="validation.province_id"
                v-for="(error, index) in validation.province_id" :key="index">
                {{ error }}
              </div>
            </template>
          </vSelect>
        </div>
        <div class="mb-3">
          <vSelect label="name" value="id" id="regency" :disabled="address.province_id < 1 || isLoading"
            placeholder="Choose Regency" :options="regencies" v-model="regencySelected">
            <template #search="{ attributes, events }">
              <input class="vs__search" :required="!address.regency_id" v-bind="attributes" v-on="events"
                :disabled="isLoading" :class="{ 'is-invalid': validation.regency_id }"
                @input="onSearchRegency($event)" />
              <div class="invalid-feedback" v-if="validation.regency_id" v-for="(error, index) in validation.regency_id"
                :key="index">
                {{ error }}
              </div>
            </template>
          </vSelect>
        </div>
        <div class="mb-3">
          <vSelect label="name" value="id" id="district" :disabled="address.regency_id < 1 || isLoading"
            placeholder="Choose District" :options="districts" v-model="districtSelected">
            <template #search="{ attributes, events }">
              <input class="vs__search" :required="!address.district_id" v-bind="attributes" v-on="events"
                :disabled="isLoading" :class="{ 'is-invalid': validation.district_id }"
                @input="onSearchDistrict($event)" />
              <div class="invalid-feedback" v-if="validation.district_id"
                v-for="(error, index) in validation.district_id" :key="index">
                {{ error }}
              </div>
            </template>
          </vSelect>
        </div>
        <div class="mb-3">
          <vSelect label="name" value="id" id="village" :disabled="address.district_id < 1 || isLoading"
            placeholder="Choose Village" :options="villages" v-model="villageSelected">
            <template #search="{ attributes, events }">
              <input class="vs__search" :required="!address.village_id" v-bind="attributes" v-on="events"
                :disabled="isLoading" :class="{ 'is-invalid': validation.village_id }"
                @input="onSearchVillage($event)" />
              <div class="invalid-feedback" v-if="validation.village_id" v-for="(error, index) in validation.village_id"
                :key="index">
                {{ error }}
              </div>
            </template>
          </vSelect>
        </div>
        <div class="mb-3">
          <CFormInput class="border-0 border-bottom rounded-0" placeholder="Address Detail" maxlength="200"
            v-model="address.detail" :disabled="isLoading" :class="{ 'is-invalid': validation.detail }" />
          <div class="invalid-feedback" v-if="validation.detail" v-for="(error, index) in validation.detail"
            :key="index">
            {{ error }}
          </div>
        </div>
        <div class="mb-3">
          <CFormCheck id="flexCheckDefault" label="Set Default" v-model="address.is_default" :disabled="isLoading"
            :class="{ 'is-invalid': validation.is_default }" />
          <div class="invalid-feedback" v-if="validation.is_default" v-for="(error, index) in validation.is_default"
            :key="index">
            {{ error }}
          </div>
        </div>
      </CCardBody>
      <CCardFooter class="border-0">
        <CButton type="submit" color="primary w-100" :disabled="isLoading"><i class="fa-solid fa-save me-2"></i> Submit
        </CButton>
      </CCardFooter>
    </CCard>
  </form>
</template>

<style>
.address .vs--searchable .vs__dropdown-toggle {
  border-top: 1px;
  border-right: 1px;
  border-left: 1px;
  border-radius: 0;
}
</style>