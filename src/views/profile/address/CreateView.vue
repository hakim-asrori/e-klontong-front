<script setup>
import TitleBar from "@/components/layouts/TitleBar.vue";
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CFormCheck,
  CFormInput,
  CFormSelect,
} from "@coreui/vue";
import Swal from "sweetalert2";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import vSelect from "vue-select";
import { useStore } from "vuex";
import _ from "lodash";

const $store = useStore();
const $router = useRouter();
const address = ref({
  prefektur: "",
  city: "",
  name: "",
  phone: "",
  detail: "",
  is_default: 1,
});
const validation = ref({});
const isLoading = ref(false);

const handleSubmit = async () => {
  isLoading.value = true;

  try {
    const response = await $store.dispatch("postData", [
      "address/store",
      address.value,
    ]);

    if (response.code == $store.state.STATUS_CODE.DATA_OK) {
      Swal.fire({
        title: "Wooww",
        text: response.messages,
        icon: "success",
      }).then(() => {
        $router.back(-1);
      });
    } else {
      if (response.code == $store.state.STATUS_CODE.INVALID_BODY) {
        validation.value = response.data;
      }

      Swal.fire({
        title: "Ooops",
        text: response.messages,
        icon: "error",
      });
    }
  } catch (error) {
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <TitleBar title="New Address" :show-cart="false" />
  <form @submit.prevent="handleSubmit">
    <CCard class="rounded-0 border-0 address">
      <CCardBody>
        <div class="mb-3">
          <CFormInput
            class="border-0 border-bottom rounded-0"
            placeholder="Full Name"
            required
            v-model="address.name"
            :disabled="isLoading"
            :class="{ 'is-invalid': validation.name }"
          />
          <div
            class="invalid-feedback"
            v-if="validation.name"
            v-for="(error, index) in validation.name"
            :key="index"
          >
            {{ error }}
          </div>
        </div>
        <div class="mb-3">
          <CFormInput
            class="border-0 border-bottom rounded-0"
            placeholder="Phone Number"
            required
            v-model="address.phone"
            :disabled="isLoading"
            :class="{ 'is-invalid': validation.phone }"
          />
          <div
            class="invalid-feedback"
            v-if="validation.phone"
            v-for="(error, index) in validation.phone"
            :key="index"
          >
            {{ error }}
          </div>
        </div>
        <div class="mb-3">
          <CFormInput
            class="border-0 border-bottom rounded-0"
            placeholder="Prefektur"
            required
            v-model="address.prefektur"
            :disabled="isLoading"
            :class="{ 'is-invalid': validation.prefektur }"
          />
          <div
            class="invalid-feedback"
            v-if="validation.prefektur"
            v-for="(error, index) in validation.prefektur"
            :key="index"
          >
            {{ error }}
          </div>
        </div>
        <div class="mb-3">
          <CFormInput
            class="border-0 border-bottom rounded-0"
            placeholder="City"
            required
            v-model="address.city"
            :disabled="isLoading"
            :class="{ 'is-invalid': validation.city }"
          />
          <div
            class="invalid-feedback"
            v-if="validation.city"
            v-for="(error, index) in validation.city"
            :key="index"
          >
            {{ error }}
          </div>
        </div>
        <div class="mb-3">
          <CFormInput
            class="border-0 border-bottom rounded-0"
            placeholder="Address Detail"
            maxlength="200"
            v-model="address.detail"
            :disabled="isLoading"
            :class="{ 'is-invalid': validation.detail }"
          />
          <div
            class="invalid-feedback"
            v-if="validation.detail"
            v-for="(error, index) in validation.detail"
            :key="index"
          >
            {{ error }}
          </div>
        </div>
        <div class="mb-3">
          <CFormCheck
            id="flexCheckDefault"
            label="Set Default"
            v-model="address.is_default"
            :disabled="isLoading"
            :class="{ 'is-invalid': validation.is_default }"
          />
          <div
            class="invalid-feedback"
            v-if="validation.is_default"
            v-for="(error, index) in validation.is_default"
            :key="index"
          >
            {{ error }}
          </div>
        </div>
      </CCardBody>
      <CCardFooter class="border-0">
        <CButton type="submit" color="primary w-100" :disabled="isLoading"
          ><i class="fa-solid fa-save me-2"></i> Submit
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
