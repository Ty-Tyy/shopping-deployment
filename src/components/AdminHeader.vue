<template>
  <div class="flex justify-center text-lg md:text-lg lg:text-2xl">
    <Tabs value="">
      <TabList>
        <Tab v-for="tab in items" :key="tab.label" :value="tab.route">
          <router-link v-if="tab.route" v-slot="{ href, navigate }" :to="tab.route" custom>
            <a
              v-ripple
              :href="href"
              @click="navigate"
              class="flex items-center gap-1 lg:gap-2 text-inherit"
            >
              <i :class="tab.icon" />
              <span>{{ tab.label }}</span>
            </a>
          </router-link>
        </Tab>
      </TabList>
    </Tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const items = ref([
  { route: '/admin/ordering', label: 'Ordering' },
  { route: '/admin/create-client', label: 'Create Client' },
  { route: '/admin/revenue', label: 'Revenue' },
  { route: '/admin/inventory', label: 'Inventory' },
  { route: '/admin/promotion', label: 'Promotion' },
  { route: '/admin/client', label: 'Client' }
])
</script>
