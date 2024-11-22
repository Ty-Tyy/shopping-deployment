<script setup>
import AdminHeader from '@/components/AdminHeader.vue'
import axios from 'axios'
import { ref, onMounted } from 'vue'
import moment from 'moment'

// Date for the current day
const Date = moment().format('MMMM D, YYYY h:mm a')

// Order data state
const orderData = ref([])

// API URLs
const apiUrl = import.meta.env.VITE_API_URL
const imgUrl = import.meta.env.VITE_IMG_URL

// Fetch order data from API
const fetchOrderProduct = async () => {
  const response = await axios.get(`${apiUrl}/getorder`)
  orderData.value = response.data
}

// On mounted, fetch order data
onMounted(async () => {
  await fetchOrderProduct()
})
</script>

<template>
  <main>
    <AdminHeader />
    <div class="max-w-7xl mx-auto p-6 mt-8 bg-white border border-gray-200 shadow rounded-lg">
      <!-- Header Section -->
      <div
        class="flex flex-col md:flex-row justify-between items-center border-b border-gray-200 pb-4 mb-6 mx-2"
      >
        <div class="text-left mb-2 md:mb-0">
          <span class="font-bold text-gray-700"> Date: </span>
          <span class="font-bold text-lg text-blue-600">{{ Date }}</span>
        </div>
        <div class="flex space-x-4 md:space-x-10">
          <span class="font-semibold text-gray-600">Quantity</span>
          <span class="font-semibold text-gray-600">Total</span>
          <span class="font-semibold text-gray-600">Customer Name</span>
          <span class="font-semibold text-gray-600">Request</span>
        </div>
      </div>

      <!-- Loop through orders -->
      <div
        v-for="(order, index) in orderData"
        :key="(order.id, index)"
        class="my-6 bg-gray-50 p-4 rounded-lg shadow-lg overflow-hidden border-t-8 border-red-500"
      >
        <!-- Order Header -->
        <div class="flex justify-between items-center mb-4">
          <div class="font-semibold text-gray-700">
            Order Date: {{ moment(order.created_at).format('MMMM D, YYYY h:mm a') }}
          </div>
        </div>

        <!-- Loop through each Order_product within the order -->
        <div
          v-for="(orderProduct, prodIndex) in order.Order_product"
          :key="(orderProduct.id, prodIndex)"
          class="flex flex-col md:flex-row items-center bg-white p-4 mb-4 rounded-lg border border-gray-200 shadow"
        >
          <!-- Product Image -->
          <img
            :src="`${imgUrl}/${orderProduct.product.product_img}`"
            :alt="orderProduct.product.product_name"
            class="w-24 h-24 rounded-lg object-cover"
            height="100"
            width="100"
          />
          <!-- Product Details -->
          <div class="flex-1 ml-4">
            <div class="text-lg font-semibold text-gray-800">
              {{ orderProduct.product.product_name }}
            </div>
            <div class="text-sm text-gray-600">
              Price:
              <span class="font-bold text-blue-600">${{ orderProduct.product.product_price }}</span>
            </div>
          </div>
          <!-- Quantity, Total, and Customer Info -->
          <div class="flex space-x-6 md:space-x-16 items-center">
            <span class="text-gray-700">{{ orderProduct.qty }}</span>
            <span class="font-bold text-blue-600">${{ orderProduct.price }}</span>
            <span class="text-gray-600"
              >{{ order.customer.first_name }} {{ order.customer.last_name }}</span
            >
            <!-- Action Buttons -->
            <div class="flex gap-2">
              <button
                aria-label="Confirm"
                class="pi pi-check-circle text-green-500 hover:text-green-700 transition duration-300"
                style="font-size: 1.5rem"
              ></button>
              <button
                aria-label="Cancel"
                class="pi pi-times-circle text-red-500 hover:text-red-700 transition duration-300"
                style="font-size: 1.5rem"
              ></button>
            </div>
          </div>
        </div>

        <!-- Order Total and Discount -->
        <div class="flex justify-end mt-4 gap-8">
          <span class="font-bold text-gray-700"
            >Total: <span class="text-blue-600">${{ order.total_price }}</span></span
          >
          <span class="font-bold text-gray-700"
            >Discount: <span class="text-green-600">${{ order.total_discount }}</span></span
          >
        </div>

        <!-- Divider between orders -->
        <hr class="my-6 border-gray-300" />
      </div>
    </div>
  </main>
</template>

<style scoped>
.bg-white {
  background-color: #ffffff;
}
.bg-gray-50 {
  background-color: #f9fafb;
}
.border-gray-200 {
  border-color: #e5e7eb;
}
.text-blue-600 {
  color: #2563eb;
}
.text-green-600 {
  color: #16a34a;
}
.text-gray-700 {
  color: #374151;
}
.text-gray-600 {
  color: #4b5563;
}
.hover\:text-green-700:hover {
  color: #15803d;
}
.hover\:text-red-700:hover {
  color: #b91c1c;
}
</style>
