<template>
  <Menu class="absolute" />
  <div class="flex justify-center text-xl md:text-2xl lg:text-3xl">
    <Menubar :model="items" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Menu from './MenuNav.vue'

const items = ref([
  {
    label: 'Home',
    url: '/men'
  },
  {
    label: 'Fall',
    url: '/men/fall'
  },
  {
    label: 'New Formal',
    url: '/men/new-formal'
  },
  {
    label: 'Travel',
    url: '/men/travel'
  }
])
</script>
