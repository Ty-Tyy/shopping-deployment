<script setup>
import AdminHeader from '@/components/AdminHeader.vue'
import axios from 'axios'
import { onMounted, ref, computed } from 'vue'
import { format, isSameDay, isSameMonth, isSameYear } from 'date-fns'

// API URL and response data reference
const apiUrl = import.meta.env.VITE_API_URL
const reports = ref([])
const isLoading = ref(true)
const error = ref(null)
const selectedFilter = ref('monthly') // 'daily', 'monthly', 'yearly'
const sortOrder = ref('ascending') // Sorting order reference: 'asc' for ascending, 'desc' for descending

// Get cookie by name utility function
const getCookie = (name) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)

  if (parts.length === 2) return parts.pop().split(';').shift()
  return null
}

// Fetch report data on component mount
onMounted(async () => {
  await fetchReport()
})

// Fetch report from API
const fetchReport = async () => {
  try {
    const token = getCookie('api_key')
    const response = await axios.get(`${apiUrl}/getreport`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    reports.value = response.data
  } catch (err) {
    error.value = 'Failed to load reports. Please try again later.'
    console.error('Error fetching report', err)
  } finally {
    isLoading.value = false
  }
}

// Format the date function
const formatDate = (dateString) => {
  return format(new Date(dateString), 'MMMM dd, yyyy.')
}

// Format price with currency symbol
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}

// Filter reports by the selected filter and sort by ascending or descending order
const filteredReports = computed(() => {
  const now = new Date()

  // Filter reports based on the selected filter
  let filtered = reports.value.filter((report) => {
    const reportDate = new Date(report.created_at)

    switch (selectedFilter.value) {
      case 'daily':
        return isSameDay(reportDate, now)
      case 'monthly':
        return isSameMonth(reportDate, now)
      case 'yearly':
        return isSameYear(reportDate, now)
      default:
        return true
    }
  })

  // Sort reports by order number based on the selected sortOrder
  filtered.sort((a, b) => {
    if (sortOrder.value === 'ascending') {
      return a.order_number - b.order_number
    } else {
      return b.order_number - a.order_number
    }
  })

  return filtered
})
</script>

<template>
  <main class="min-h-screen">
    <AdminHeader />
    <div class="p-6">
      <!-- Sorting Button -->
      <button
        class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition absolute"
        @click="sortOrder = sortOrder === 'ascending' ? 'descending' : 'ascending'"
      >
        Sort Order by {{ sortOrder }}
      </button>
      <!-- Tab Navigation -->
      <div class="flex justify-center space-x-8 border-b-2 pb-4 pt-2 mb-6">
        <div
          class="cursor-pointer text-gray-600 hover:text-red-700 transition-colors duration-300 text-xl font-semibold"
          @click="selectedFilter = 'daily'"
          :class="{
            'text-red-700 font-bold': selectedFilter === 'daily',
            'text-gray-600': selectedFilter !== 'daily'
          }"
        >
          Daily
        </div>
        <div
          class="cursor-pointer text-gray-600 hover:text-red-700 transition-colors duration-300 text-xl font-semibold"
          @click="selectedFilter = 'monthly'"
          :class="{
            'text-red-700 font-bold': selectedFilter === 'monthly',
            'text-gray-600': selectedFilter !== 'monthly'
          }"
        >
          Monthly
        </div>
        <div
          class="cursor-pointer text-gray-600 hover:text-red-700 transition-colors duration-300 text-xl font-semibold"
          @click="selectedFilter = 'yearly'"
          :class="{
            'text-red-700 font-bold': selectedFilter === 'yearly',
            'text-gray-600': selectedFilter !== 'yearly'
          }"
        >
          Yearly
        </div>
      </div>

      <!-- Loading and Error State -->
      <div v-if="isLoading" class="text-center py-8 text-gray-500">
        <span class="text-xl font-semibold">Loading reports...</span>
      </div>

      <div v-if="error" class="text-center py-8 text-red-600">
        <span class="text-xl font-semibold">{{ error }}</span>
      </div>

      <!-- Report List -->
      <div v-if="!isLoading && !error">
        <div
          v-for="report in filteredReports"
          :key="report.id"
          class="bg-white shadow-lg rounded-lg overflow-hidden my-6 border-t-4 border-red-500"
        >
          <!-- Order Info Section -->
          <div class="px-6 py-4">
            <h3 class="text-3xl font-bold text-gray-800">
              Order Number: <span class="text-red-600">{{ report.order_number }}</span>
            </h3>
            <p class="text-sm text-gray-600">Order Date: {{ formatDate(report.created_at) }}</p>
            <p class="text-sm text-gray-600">
              Customer Name: {{ report.customer.first_name + ' ' + report.customer.last_name }}
            </p>
            <p class="text-sm text-gray-600">Total Price: {{ formatPrice(report.total_price) }}</p>
            <p class="text-sm text-gray-600">
              Total Discount: {{ formatPrice(report.total_discount) }}
            </p>
          </div>

          <!-- Heading in each order -->
          <div class="grid grid-cols-6 gap-6 px-6 font-bold text-gray-700">
            <span>Product Name</span>
            <span>Product Price</span>
            <span>Product Quantity</span>
            <span>Total Product Price</span>
            <span>Comment</span>
          </div>

          <!-- Loop through the Order_product array and display each product in a separate row -->
          <div
            v-for="orderProduct in report.Order_product"
            :key="orderProduct.product.id"
            class="border-t border-gray-200 py-4"
          >
            <div class="grid grid-cols-6 gap-6 px-6">
              <div class="col-span-1 text-gray-800 font-medium">
                {{ orderProduct.product.product_name }}
              </div>
              <div class="col-span-1 text-gray-800">
                {{ formatPrice(orderProduct.product.product_price) }}
              </div>
              <div class="col-span-1 text-gray-800">{{ orderProduct.qty }} pcs</div>
              <div class="col-span-1 text-gray-800">
                {{ formatPrice(orderProduct.product.product_price * orderProduct.qty) }}
              </div>
              <div class="col-span-2">
                <div class="border border-gray-200 p-4 rounded-lg bg-gray-50 text-gray-700">
                  Wow, your product is very good and modern!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.bg-gray-50 {
  background-color: #f9fafb;
}

.border-red-500 {
  border-color: #ef4444;
}

.text-red-600 {
  color: #f87171;
}

.text-gray-600 {
  color: #4b5563;
}

.text-gray-800 {
  color: #1f2937;
}

.text-gray-500 {
  color: #6b7280;
}

.hover\:text-red-600:hover {
  color: #ef4444;
}
</style>
