<template>
  <div class="card flex justify-start mt-5 ml-5">
    <Drawer v-model:visible="visible" header="Menu" class="!w-64 md:!w-64 lg:!w-[30rem]">
      <div class="flex justify-between mb-8">
        <ul class="space-y-4">
          <li class="flex items-center">
            <i class="pi pi-home text-xl mr-2"></i>
            <RouterLink to="/" class="text-xl">Home</RouterLink>
          </li>
          <li class="flex items-center">
            <i class="pi pi-tag text-xl mr-2"></i>
            <RouterLink to="/new" class="text-xl">New</RouterLink>
          </li>
          <li class="flex items-center">
            <i class="pi pi-user text-xl mr-2"></i>
            <RouterLink to="/men" class="text-xl">Men</RouterLink>
          </li>
          <li class="flex items-center">
            <i class="pi pi-user text-xl mr-2"></i>
            <RouterLink to="/women" class="text-xl">Women</RouterLink>
          </li>
          <li class="flex items-center">
            <i class="pi pi-cart-plus text-xl mr-2"></i>
            <RouterLink to="/jewelry" class="text-xl">Jewelry</RouterLink>
          </li>
          <li class="flex items-center">
            <i class="pi pi-cart-plus text-xl mr-2"></i>
            <RouterLink to="/watch" class="text-xl">Watches</RouterLink>
          </li>
          <li class="flex items-center">
            <i class="pi pi-cart-plus text-xl mr-2"></i>
            <RouterLink to="/perfume" class="text-xl">Perfumes</RouterLink>
          </li>
        </ul>
        <div class="relative mt-3 mr-1">
          <RouterLink to="/shopping-cart">
            <OverlayBadge
              :value="$store.getters['cart/ProductCount']"
              severity="danger"
              size="small"
            >
              <i class="pi pi-cart-arrow-down text-2xl" style="font-size: 1.5rem"></i>
            </OverlayBadge>
          </RouterLink>
        </div>
      </div>
    </Drawer>
    <span class="pi pi-bars" @click="visible = true"></span>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const visible = ref(false)
</script>
