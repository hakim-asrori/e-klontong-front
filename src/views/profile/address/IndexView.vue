<script setup>
import TitleBar from "@/components/layouts/TitleBar.vue";
import { CCard, CCardBody, CSpinner } from "@coreui/vue";
import Swal from "sweetalert2";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";

const $store = useStore();
const addresses = ref([]);
const isLoading = ref(false);

onMounted(() => {
  getAddress();
});

const getAddress = async () => {
  isLoading.value = true;

  try {
    const response = await $store.dispatch("postData", ["addresses", {}]);

    if (response.code == $store.state.STATUS_CODE.DATA_OK) {
      addresses.value = response.data;
    }
  } catch (error) {
  } finally {
    isLoading.value = false;
  }
};

const onDelete = (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      isLoading.value = true;

      try {
        const response = await $store.dispatch("postData", [
          "address/delete",
          {
            address_id: id,
          },
        ]);

        if (response.code == $store.state.STATUS_CODE.DATA_OK) {
          Swal.fire({
            title: "Deleted!",
            text: "Your data has been deleted.",
            icon: "success",
          });

          getAddress();
        }
      } catch (error) {}
    }
  });
};

const onUpdate = async (id) => {
  isLoading.value = true;

  try {
    const response = await $store.dispatch("postData", [
      "address/update-default",
      {
        address_id: id,
      },
    ]);

    if (response.code == $store.state.STATUS_CODE.DATA_OK) {
      Swal.fire({
        title: "Wooww",
        text: response.messages,
        icon: "success",
      });

      getAddress();
    } else {
      Swal.fire({
        title: "Ooops",
        text: response.messages,
        icon: "error",
      });
    }
  } catch (error) {}
};
</script>

<template>
  <TitleBar title="Choose Address" :show-cart="false" />
  <div
    class="d-flex align-items-center justify-content-center"
    v-if="isLoading"
  >
    <CSpinner class="mb-3" />
  </div>
  <CCard v-else class="rounded-0 border-0">
    <CCardBody>
      <div v-for="(address, index) in addresses" :key="index">
        <div class="d-flex align-items-start justify-content-between">
          <div class="d-flex gap-3">
            <input
              type="radio"
              class="form-check-input"
              name="a"
              @click="onUpdate(address.id)"
              :checked="address.isDefault"
            />
            <div>
              <div>
                <span class="fw-bold">{{ address.name }}</span> |
                <small>{{ address.phone }}</small
                ><span
                  v-if="address.isDefault"
                  v-html="
                    ' | <span class=\'badge text-bg-success text-white\'>Default</span>'
                  "
                ></span>
              </div>
              <small class="m-0 p-0">{{ address.detail }}</small>
              <br />
              <small class="m-0 p-0">{{
                `${address.city}, ${address.prefektur}`
              }}</small>
            </div>
          </div>
          <div class="d-flex gap-2">
            <a href="#" v-if="!address.isDefault" @click="onDelete(address.id)"
              ><i class="fa-solid fa-trash"></i
            ></a>
            <span v-if="!address.isDefault">|</span>
            <router-link
              :to="{ name: 'editAddress', params: { id: address.id } }"
              ><i class="fa-solid fa-edit"></i
            ></router-link>
          </div>
        </div>
        <hr />
      </div>
      <div class="text-center">
        <router-link
          :to="{ name: 'createAddress' }"
          class="btn btn-pill btn-primary"
          ><i class="fa-solid fa-plus me-2"></i> Add new Address</router-link
        >
      </div>
    </CCardBody>
  </CCard>
</template>
