<script setup>
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useToast } from 'vue-toastification'
import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL
const imgUrl = import.meta.env.VITE_IMG_URL

const toast = useToast()
const cartStore = useStore()

// Computed properties for cart items and discount
const cartItems = computed(() => cartStore.getters['cart/cartItems'] || [])
const discount = computed(() => cartStore.getters['cart/discount'] || 0)

const subtotal = computed(() => {
  const value = cartItems.value.reduce(
    (sum, item) => sum + (item.product_qty || 0) * (item.product_price || 0),
    0
  )
  return value
})

const total = computed(() => {
  const value = (subtotal.value || 0) - (discount.value || 0)
  return value
})

const promoCode = ref('')
const isLoading = ref(false)
const showDialog = ref(false)

const applyPromoCode = async () => {
  isLoading.value = true
  if (!promoCode.value) {
    toast.error('Please enter a promo code.')
    isLoading.value = false
    return
  }
  try {
    const response = await axios.post(`${apiUrl}/verifypromocode/${promoCode.value}`)
    const promo = response.data
    let newDiscount = 0
    if (promo.discound_type === 'Percentage') {
      newDiscount = (subtotal.value * promo.amount) / 100
    } else if (promo.discound_type === 'FixedAmount') {
      newDiscount = promo.amount
    } else {
      toast.error('Unsupported discount type.')
      return
    }
    // Show success message
    toast.success('Promo code applied successfully')
    // Commit the discount to the Vuex store
    cartStore.commit('cart/applyDiscount', newDiscount)
    // Clear the promocode input
    promoCode.value = ''
  } catch (error) {
    toast.error('Failed to apply promo code. Please try again.')
  } finally {
    isLoading.value = false
  }
}

const updateQuantity = (itemId, action) => {
  const product = cartItems.value.find((item) => item.id === itemId)
  if (!product) {
    toast.error('Product not found in cart.')
    return
  }

  let newQuantity = product.product_qty
  if (action === 'increment') {
    newQuantity++
  } else if (action === 'decrement') {
    newQuantity--
  }

  if (newQuantity < 1) {
    cartStore.dispatch('cart/removeItem', itemId)
  } else {
    cartStore.dispatch('cart/updateQuantity', { itemId, product_qty: newQuantity })
  }
}

const removeItem = (itemId) => {
  cartStore.dispatch('cart/removeItem', itemId)
}

watch(subtotal, (newValue) => {
  console.log('Updated Subtotal:', newValue)
})

watch(discount, (newValue) => {
  console.log('Updated Discount:', newValue)
})

watch(total, (newValue) => {
  console.log('Updated Total:', newValue)
})
</script>

<template>
  <div class="font-sans">
    <h2
      aria-label="Your shopping cart"
      class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 text-center"
    >
      Your shopping cart
    </h2>

    <p v-if="!cartItems?.length" class="text-gray-600 text-2xl m-10" id="empty-cart">
      Your cart is empty!
    </p>

    <div class="grid grid-cols-auto lg:grid-cols-3 gap-4 max-lg:max-w-3xl mx-auto mt-4">
      <!-- Left side with items -->
      <div class="lg:col-span-2 bg-white divide-y divide-gray-300 px-5">
        <div
          v-for="product in cartItems"
          :key="product.id"
          class="grid md:grid-cols-4 items-center gap-4 py-4"
        >
          <div class="col-span-2 flex items-center gap-6">
            <div class="w-28 h-28 shrink-0">
              <img
                class="w-full h-full rounded-2xl object-contain"
                :src="`${imgUrl}/${product.product_img}`"
                :alt="product.product_name"
                style="max-width: 300px; max-height: 300px"
              />
            </div>
            <div>
              <h3 class="text-base font-bold text-gray-800">{{ product.product_name }}</h3>
              <h6 class="text-sm text-gray-500 mt-1">
                <span class="ml-2 font-semibold">{{ product.description }}</span>
              </h6>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <button
              type="button"
              @click="updateQuantity(product.id, 'decrement')"
              :disabled="product.product_qty === 1"
              class="flex items-center justify-center w-5 h-5 bg-blue-600 outline-none rounded-full"
            >
              -
            </button>
            <span class="font-bold text-sm leading-[18px]">{{ product.product_qty }}</span>
            <button
              type="button"
              @click="updateQuantity(product.id, 'increment')"
              class="flex items-center justify-center w-5 h-5 bg-blue-600 outline-none rounded-full"
            >
              +
            </button>
          </div>
          <div class="flex items-center">
            <h4 class="text-base font-bold text-gray-800">$ {{ product.product_price }}</h4>
            <svg
              type="button"
              @click="removeItem(product.id)"
              xmlns="http://www.w3.org/2000/svg"
              class="w-3 cursor-pointer shrink-0 fill-gray-400 hover:fill-red-500 ml-auto"
              viewBox="0 0 320.591 320.591"
            >
              <path
                d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
              />
              <path
                d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- Right side with Summary -->
      <div class="bg-gradient-to-tl from-[#B0EBB4] via-[#BFF6C3] to-[#E0FBE2] p-6 lg:sticky top-0">
        <ul class="text-gray-800 divide-y divide-gray-300">
          <li class="flex flex-wrap gap-4 text-sm pb-4 font-semibold">
            Subtotal <span class="ml-auto">$ {{ subtotal }}</span>
          </li>
          <li class="flex flex-wrap gap-4 text-sm py-4 font-semibold">
            Discount <span class="ml-auto">$ {{ discount }}</span>
          </li>
          <li class="flex flex-wrap gap-4 text-sm py-4 font-semibold">
            Shipping <span class="ml-auto">$ 0</span>
          </li>
          <li class="flex flex-wrap gap-4 text-sm py-4 font-semibold">
            Tax <span class="ml-auto">$ 0</span>
          </li>
          <li class="flex flex-wrap gap-4 text-sm pt-4 font-bold">
            Total <span class="ml-auto">$ {{ total }}</span>
          </li>
        </ul>
        <div class="mt-8">
          <h3 class="text-base font-bold text-gray-800">Apply promo code</h3>
          <div class="flex border border-blue-600 overflow-hidden max-w-md rounded-lg mt-4">
            <input
              v-model="promoCode"
              type="text"
              placeholder="Enter promo code"
              :disabled="isLoading"
              class="w-full outline-none text-gray-800 text-sm px-4 py-3 bg-white"
            />
            <button
              @click="applyPromoCode"
              :disabled="isLoading"
              type="button"
              class="flex items-center justify-center bg-blue-600 hover:bg-blue-700 px-6 py-3 font-semibold tracking-wide text-sm text-white outline-none"
            >
              <span v-if="isLoading">Applying...</span>
              <span v-else>Apply</span>
            </button>
          </div>
        </div>

        <!-- Checkout button -->
        <button
          type="button"
          @click="showDialog = !showDialog"
          class="flex justify-self-center w-full"
        >
          <CheckoutPage />
        </button>

        <RouterLink :to="{ name: 'home' }">
          <button
            type="button"
            class="mt-2 max-w-md text-sm px-6 py-2 w-full border-blue-600 border-2 text-black hover:bg-blue-700 hover:text-white font-semibold tracking-wide rounded-lg"
          >
            Continue Shopping
          </button>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
