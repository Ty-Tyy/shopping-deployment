<template>
  <Menu class="absolute" />
  <div class="flex justify-center text-xl md:text-2xl lg:text-3xl">
    <Menubar :model="menuItems" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Menu from './MenuNav.vue'

const menuItems = ref([
  { label: 'Home', url: '/women' },
  { label: 'Bags', url: '/women/bags' },
  { label: 'Accessories', url: '/women/accessories' },
  { label: 'Fashion', url: '/women/fashion' },
  { label: 'Ready-Wear', url: '/women/ready-wear' },
  { label: 'Travel', url: '/women/wtravel' },
  { label: 'Shoes', url: '/women/shoes' }
])
</script>
