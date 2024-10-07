<script setup>
import util from '@/store/services/util';
import { CButton, CCard, CCardBody } from '@coreui/vue';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { ref } from 'vue';
import { onMounted } from 'vue';
import { useStore } from 'vuex';
import $ from "jquery"

const $store = useStore()
const cart = ref([])
const isLoading = ref(false)
const productChecked = ref([]);
const checkAllVisible = ref(false);
const productListChecked = ref({
  total_price: 0,
  total_qty: 0
})
const isLoadingChecked = ref(false)

onMounted(() => {
  getCart()
})

const getCart = async () => {
  isLoading.value = true
  let user = JSON.parse(Cookies.get("user"))

  try {
    const response = await $store.dispatch("postData", ["carts", {
      user_id: user.id,
      delivery: 2
    }])

    if (response.code == $store.state.STATUS_CODE.DATA_OK) {
      cart.value = response.data
    }

    cart.value.items.forEach((item, index) => {
      productChecked.value.push(item.isChecked == 1 ? true : false)
    });

    setTimeout(() => {
      checkCheckbox()
    }, 500);
  } catch (error) {
  } finally {
    isLoading.value = false
  }
}

const updateQtyCart = async (itemId, qty, index, showAlert = null, type = null) => {
  if (showAlert) {
    isLoading.value = true
  }

  let body = {
    item_id: itemId,
    quantity: qty
  }

  if (type != null) {
    body.type = type
  } else {
    if (qty < 1) {
      getCart()

      Swal.fire({
        title: 'Ooops',
        text: 'Quantity not zero',
        icon: 'error',
      })

      return
    }
  }

  try {
    const response = await $store.dispatch("postData", ["cart/update", body])

    if (response.code == $store.state.STATUS_CODE.DATA_OK) {
      if (showAlert) {
        Swal.fire({
          title: 'Wooww',
          text: response.messages,
          icon: 'success',
        })
      }

      if (type != null) {
        if (type == "minus") {
          cart.value.items[index].quantity -= qty
          productListChecked.value.total_qty -= qty
          productListChecked.value.total_price -= cart.value.items[index].price * qty

          if (cart.value.items[index].quantity < 1) {
            cart.value.items.splice(index, 1)
          }
        } else {
          cart.value.items[index].quantity += qty
          productListChecked.value.total_qty += qty
          productListChecked.value.total_price += cart.value.items[index].price * qty
        }
      } else {
        cart.value.items[index].quantity = qty
      }

      cart.value.items[index].total_price = qty * cart.value.items[index].price
    } else {
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

const checkMenuVisibility = (index, product) => {
  isLoadingChecked.value = true

  setTimeout(() => {
    isLoadingChecked.value = false
    let checked = productChecked.value.includes(true)

    checkAllVisible.value = checked
    if (checked) {
      document.getElementById("bottomMenu").classList.add("d-none")
    } else {
      document.getElementById("bottomMenu").classList.remove("d-none")
    }

    if (productChecked.value[index]) {
      $(".cart-total").removeClass("d-none")
      productListChecked.value.total_price += product.price * product.quantity
      productListChecked.value.total_qty += product.quantity
    } else {
      $(".cart-total").addClass("d-none")
      productListChecked.value.total_price -= product.price * product.quantity
      productListChecked.value.total_qty -= product.quantity
    }
  }, 500);

};

const checkCheckbox = () => {
  let checkedList = []
  let products = []

  $(".check-cart").each(function (index, elm) {
    checkedList.push($(elm).is(":checked"))

    if ($(elm).is(":checked") == true) {
      products.push({ price: Number($(elm).data('price')), quantity: Number($(elm).data('quantity')) })
    }
  })

  let checked = checkedList.includes(true)

  checkAllVisible.value = checked
  if (checked) {
    $(".cart-total").removeClass("d-none")
    document.getElementById("bottomMenu").classList.add("d-none")
    products.forEach(item => {
      productListChecked.value.total_price += item.price * item.quantity
      productListChecked.value.total_qty += item.quantity
    });
  } else {
    $(".cart-total").addClass("d-none")
    document.getElementById("bottomMenu").classList.remove("d-none")
    products.forEach(item => {
      productListChecked.value.total_price -= item.price * item.quantity
      productListChecked.value.total_qty -= item.quantity
    });
  }
}

const formatRupiah = (price) => {
  return util.rupiah(price)
}
</script>

<template>
  <!-- <div class="d-flex align-items-center justify-content-center mt-5" v-if="false">
    <CSpinner class="mb-3" />
  </div> -->
  <p v-if="cart && cart.items && cart.items.length < 1" class="d-flex align-items-center justify-content-center"
    style="min-height: 50vh;">
    Data not available.
  </p>
  <CCard v-if="cart && cart.items && cart.items.length > 0" v-for="(cart, index) in cart.items"
    class="mb-3 shadow-sm border-0">
    <CCardBody>
      <div class="d-flex gap-2 align-items-center">
        <input class="form-check-input check-cart" type="checkbox" v-model="productChecked[index]"
          @change="updateQtyCart(cart.id, Number(cart.quantity), index, false), checkMenuVisibility(index, cart)"
          :disabled="isLoadingChecked" :checked="cart.isChecked" :data-quantity="cart.quantity"
          :data-price="cart.price">
        <img :src="cart.image" height="75" width="75" class="rounded">
        <div class="d-flex flex-column justify-content-between gap-4 w-100">
          <h6 class="m-0 p-0">{{ cart.name }}</h6>
          <div class="d-flex align-items-center justify-content-between">
            <span class="text-primary fw-semibold">{{ formatRupiah(cart.price) }}</span>
            <div class="d-flex align-items-center">
              <CButton color="light" size="sm rounded-0 rounded-start" style="height: 30px; width: 30px;"
                @click="updateQtyCart(cart.id, 1, index, true, 'minus')" :disabled="isLoading"><i
                  class="fa-solid fa-minus"></i>
              </CButton>
              <input type="text" inputmode="numeric" :value="cart.quantity"
                style="height: 30px; width: 30px; padding: 5px"
                class="form-control border border-light-subtle rounded-0 qty-input"
                @input="updateQtyCart(cart.id, Number($event.target.value), index, true)" readonly>
              <CButton color="light" size="sm rounded-0 rounded-end" style="height: 30px; width: 30px;"
                @click="updateQtyCart(cart.id, 1, index, true, 'plus')" :disabled="isLoading"><i
                  class="fa-solid fa-plus"></i>
              </CButton>
            </div>
          </div>
        </div>
      </div>
    </CCardBody>
    <!-- <CCardFooter class="bg-white">
      <div class="d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center gap-1">
          <span>Total</span>
          <span>:</span>
          <span class="text-primary fw-bold">{{ formatRupiah(cart.price * cart.quantity) }}</span>
        </div>
        <router-link :to="{ name: 'orderOne', params: { id: cart.id } }"
          class="btn btn-primary btn-sm">Checkout</router-link>
      </div>
    </CCardFooter> -->
  </CCard>

  <CCard class="fixed-bottom rounded-0 border-top border-0 d-none cart-total">
    <CCardBody class="py-2">
      <div class="d-flex align-items-center justify-content-between">
        <div>
          <small>Total :</small>
          <h5 class="m-0 p-0 fw-bold text-primary">{{ formatRupiah(productListChecked.total_price) }}</h5>
        </div>
        <router-link :to="{ name: 'orderAll', params: { delivery: 2 } }"
          class="btn btn-primary d-flex align-items-center justify-content-between fw-semibold">
          Checkout ({{ productListChecked.total_qty }})
        </router-link>
      </div>
    </CCardBody>
  </CCard>
</template>