<template>
  <div class="card">
    <Tabs value="0">
      <TabList class="ml-10 text-3xl flex justify-center flex-wrap md:flex-nowrap">
        <Tab v-for="tab in tabs" :key="tab.title" :value="tab.value">{{ tab.title }}</Tab>
      </TabList>
      <TabPanels>
        <TabPanel v-for="tab in tabs" :key="tab.content" :value="tab.value">
          <component :is="tab.content" />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<script setup>
import { ref, markRaw } from 'vue'
import MenProductLayout from './MenProductLayout.vue'

// Mark MenProductLayout as raw to avoid Vue reactivity on each tab
const tabs = ref([
  { title: 'All', content: markRaw(MenProductLayout), value: '0' },
  { title: 'Shirt', content: markRaw(MenProductLayout), value: '1' },
  { title: 'Jeans', content: markRaw(MenProductLayout), value: '2' },
  { title: 'Belts', content: markRaw(MenProductLayout), value: '3' },
  { title: 'Tie', content: markRaw(MenProductLayout), value: '4' },
  { title: 'Bag', content: markRaw(MenProductLayout), value: '5' },
  { title: 'Shoes', content: markRaw(MenProductLayout), value: '6' }
])
</script>
