<template>
  <CNav class="justify-content-around fixed-bottom border-top py-1 shadow bg-white" id="bottomMenu">
    <CNavItem>
      <router-link :to="{ name: 'home' }" class="nav-link">
        <i class="me-0 me-sm-2 fa-solid fa-home"></i>
        <span>Home</span>
      </router-link>
    </CNavItem>
    <CNavItem>
      <router-link :to="{ name: 'delivery' }" class="nav-link">
        <i class="me-0 me-sm-2 fa-solid fa-truck-fast"></i>
        <span>Delivery</span>
      </router-link>
    </CNavItem>
    <CNavItem>
      <router-link :to="{ name: 'cartIndex' }" class="nav-link h-b-central">
        <i class="me-0 me-sm-2 fa-solid fa-cart-shopping"></i>
        <span>Cart</span>
      </router-link>
    </CNavItem>
    <CNavItem>
      <router-link :to="{ name: 'order' }" class="nav-link">
        <i class="me-0 me-sm-2 fa-solid fa-clock-rotate-left"></i>
        <span>History</span>
      </router-link>
    </CNavItem>
    <CNavItem>
      <router-link :to="{ name: 'profile' }" class="nav-link">
        <i class="me-0 me-sm-2 fa-solid fa-user"></i>
        <span>Account</span>
      </router-link>
    </CNavItem>
  </CNav>
</template>

<script>
import { CNav, CContainer, CNavbarNav, CNavItem, CNavLink } from '@coreui/vue'

export default {
  components: { CNav, CContainer, CNavbarNav, CNavItem, CNavLink }
}
</script>

<style scoped>
#bottomMenu li a.active:not(.h-b-central) {
  color: rgb(88, 86, 214);
}

#bottomMenu li a {
  color: #888;
}

@media screen and (max-width: 640px) {
  #bottomMenu .h-b-central {
    background-color: rgb(88, 86, 214);
    color: white;
    border-radius: 50%;
    margin-top: -25px;
  }

  #bottomMenu .h-b-central span {
    display: none;
  }

  #bottomMenu li>.nav-link {
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  #bottomMenu li span {
    font-size: 10px;
    margin-top: 5px;
  }
}
</style>