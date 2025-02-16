<script setup>
import { CButton, CFormInput, CModalBody, CModalFooter } from "@coreui/vue";
import Swal from "sweetalert2";
import { ref } from "vue";
import { useStore } from "vuex";
import LogoPng from "@/assets/img/logo/logo.png";
import jsCookie from "js-cookie";
import axios from "axios";

const store = useStore();
const emit = defineEmits(["closeModal", "onReloadUser"]);
const props = defineProps(["user"]);
const form = ref({
  email: props.user.email,
  name: props.user.name,
  phone: props.user.phone,
  file: null,
});
const validation = ref({});
const isLoading = ref(false);

const handleSubmit = async () => {
  isLoading.value = true;

  let formData = new FormData();
  formData.append("email", form.value.email);
  formData.append("name", form.value.name);
  formData.append("phone", form.value.phone);

  if (form.value.file) {
    formData.append("file", form.value.file);
  }

  try {
    let response = await axios.post("/user/update", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${jsCookie.get("token")}`,
      },
    });

    if (response.data.code == store.state.STATUS_CODE.DATA_OK) {
      Swal.fire({
        title: "Wooww",
        text: response.data.messages,
        icon: "success",
      }).then(() => {
        emit("onReloadUser", true);
        emit("closeModal", { show: false, title: "", type: 1 });
      });
    } else {
      if (response.data.code == store.state.STATUS_CODE.INVALID_BODY) {
        validation.value = response.data.data;
      }

      Swal.fire({
        title: "Ooops",
        text: response.data.messages,
        icon: "error",
      });
    }
  } catch (error) {
  } finally {
    isLoading.value = false;
  }
};

const handleUploadFile = (e) => {
  form.value.file = e.target.files[0];
};

const handleError = (e) => {
  e.target.src = LogoPng;
};
</script>

<template>
  <form action="" method="post" @submit.prevent="handleSubmit">
    <CModalBody>
      <div class="mb-3">
        <CFormInput
          label="Full Name"
          required
          v-model="form.name"
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
          label="Email"
          required
          v-model="form.email"
          :disabled="isLoading"
          :class="{ 'is-invalid': validation.email }"
        />
        <div
          class="invalid-feedback"
          v-if="validation.email"
          v-for="(error, index) in validation.email"
          :key="index"
        >
          {{ error }}
        </div>
      </div>
      <div class="mb-3">
        <CFormInput
          label="Phone"
          required
          v-model="form.phone"
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
          label="Upload Photo"
          type="file"
          @change="handleUploadFile"
          :disabled="isLoading"
          :class="{ 'is-invalid': validation.file }"
        />
        <div
          class="invalid-feedback"
          v-if="validation.file"
          v-for="(error, index) in validation.file"
          :key="index"
        >
          {{ error }}
        </div>
        <img
          :src="user.photo"
          alt=""
          class="mt-3"
          @error="handleError"
          style="height: 100px; width: 100px"
        />
      </div>
    </CModalBody>
    <CModalFooter class="justify-content-between">
      <CButton
        color="secondary"
        @click="
          () => {
            emit('closeModal', { show: false, title: '', type: 1 });
          }
        "
        :disabled="isLoading"
      >
        Close
      </CButton>
      <CButton type="submit" color="primary" :disabled="isLoading"
        >Save changes</CButton
      >
    </CModalFooter>
  </form>
</template>
