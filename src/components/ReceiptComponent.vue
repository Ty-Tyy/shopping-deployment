<template>
  <div v-if="isVisible" class="fixed inset-0 bg-white flex items-center justify-center">
    <div
      class="bg-gradient-to-b from-blue-900 to-black text-white rounded-t-3xl rounded-b-lg p-8 w-[28rem] shadow-lg overflow-hidden relative"
    >
      <div class="flex justify-center mb-6">
        <div class="bg-green-500 rounded-full p-4">
          <i class="pi pi-check text-white text-3xl"></i>
        </div>
      </div>
      <div class="text-center mb-8">
        <h2 class="text-2xl font-semibold">Payment Success</h2>
      </div>
      <div class="space-y-5 text-base">
        <div class="flex justify-between">
          <span>Date &amp; time</span>
          <span>{{ currentDate }}</span>
        </div>
        <div class="flex justify-between">
          <span>Payment method</span>
          <span>{{ paymentMethod }}</span>
        </div>
        <div class="flex justify-between">
          <span>Subtotal</span>
          <span>${{ subtotal }}</span>
        </div>
        <div class="flex justify-between">
          <span>Discount</span>
          <span>${{ discount }}</span>
        </div>
        <div class="flex justify-between font-semibold">
          <span>Total</span>
          <span>${{ total }}</span>
        </div>
      </div>
      <div class="mt-4">
        <h3 class="text-xl font-semibold mb-4">Purchased Products</h3>
        <div
          v-for="item in purchasedProducts"
          :key="item.id"
          class="flex items-center space-x-5 mb-5"
        >
          <img
            :alt="item.product_name"
            class="w-16 h-16 rounded"
            :src="`${imgUrl}/${item.product_img}`"
            width="64"
            height="64"
          />
          <div>
            <p class="text-base font-medium">{{ item.product_name }}</p>
            <p class="text-base">${{ item.product_price }}</p>
          </div>
        </div>
      </div>
      <button @click="closeReceipt" class="absolute top-4 right-6 text-blue-400">Close</button>
      <button @click="downloadReceipt" class="mt-4 text-blue-400">Download</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'

const cartStore = useStore()

const imgUrl = import.meta.env.VITE_IMG_URL
const emit = defineEmits(['update:showReceipt'])

// Clear cart
const clearCart = () => {
  cartStore.dispatch('cart/clearCart')
}

// Props
const props = defineProps({
  showReceipt: Boolean,
  paymentMethod: String,
  subtotal: Number,
  discount: Number,
  total: Number,
  purchasedProducts: Array
})

// Local visibility state
const isVisible = ref(props.showReceipt)

// Watch changes to sync with the parent component
watch(
  () => props.showReceipt,
  (newVal) => {
    isVisible.value = newVal
  }
)

// Emit close event and clear cart
const closeReceipt = () => {
  isVisible.value = false
  emit('update:showReceipt', false)
  clearCart()
}

// Download function
const downloadReceipt = () => {
  window.print()
  window.onafterprint = () => {
    window.location.href = '/' // Redirect to the homepage after printing
  }
}

// Current date and time
const currentDate = new Date().toLocaleString()
</script>

<style scoped>
/* Modal styling */
.fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
</style>
