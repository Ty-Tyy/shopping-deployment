<script setup>
import { ref, watch, inject } from 'vue'
import axios from 'axios'
import { useToast } from 'vue-toastification'
/**
 *
 */
const toast = useToast()
const $cookies = inject('$cookies')
const user_id = $cookies.get('profile')
const store_id = $cookies.get('profile')
/**
 *Function get cookie by name
 */
const getCookie = (name) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
  return null
}
/**
 *
 */
const props = defineProps({
  isEditing: Boolean,
  selectedProduct: Object,
  activeTab: {
    type: String,
    default: ''
  },
  activeProduct: {
    type: Array,
    default: () => []
  }
})
/**
 *
 */
const emit = defineEmits([
  'update:isEditing',
  'update:selectedProduct',
  'productUpdated',
  'cancelEdit'
])
/**
 *
 */
const apiUrl = import.meta.env.VITE_API_URL
// Initialize product state
const product = ref({
  product_name: '',
  product_price: '',
  product_img: '',
  product_qty: '',
  description: '',
  type_id: props.activeTab || '',
  store_id: store_id.store.id || '',
  updated_by_user_id: user_id.id || '',
  visble: true
})
// Watch for changes to selectedProduct and update product state
watch(
  () => props.selectedProduct,
  (newProduct) => {
    if (newProduct) {
      product.value = {
        product_name: newProduct.product_name || '',
        product_price: newProduct.product_price || '',
        product_img: newProduct.product_img || '',
        product_qty: newProduct.product_qty || '',
        description: newProduct.description || '',
        type_id: newProduct.type_id || props.activeTab,
        store_id: newProduct.store_id || store_id.store.id,
        updated_by_user_id: user_id.id,
        visble: newProduct.visble || true
      }
    }
  },
  { immediate: true }
)
// Update product details
const updateProduct = async () => {
  const token = getCookie('api_key')
  if (!props.selectedProduct || typeof props.selectedProduct !== 'object' || !props.activeProduct) {
    toast.error('Invalid product data for update')
    return
  }

  try {
    const response = await axios.put(
      `${apiUrl}/updateproduct/${props.selectedProduct.id}`,
      product.value,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    // Use the updated product from the response (if returned)
    const updatedProduct = response.data

    toast.success('Product updated successfully!')

    // Emit the productUpdated event with the updated product
    emit('productUpdated', {
      activeProduct: props.activeProduct,
      updatedProduct: updatedProduct
    })

    emit('update:isEditing', false)
  } catch (error) {
    console.error('Failed to update product:', error)
    toast.error('Failed to update product. Please try again.')
  }
}
// Cancel editing and reset state
const cancelEdit = () => {
  emit('cancelEdit')
  toast.info('Edit cancelled')
}
</script>

<template>
  <main>
    <div
      v-if="isEditing"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white p-6 rounded shadow-lg w-96">
        <h2 class="text-lg font-semibold mb-4">Update Product</h2>
        <div>
          <label class="block mb-2">Name</label>
          <input
            type="text"
            v-model="product.product_name"
            class="border p-2 w-full mb-4"
            required
          />
          <label class="block mb-2">Quantity</label>
          <input
            type="number"
            v-model="product.product_qty"
            class="border p-2 w-full mb-4"
            required
          />
          <label class="block mb-2">Price</label>
          <input
            type="number"
            v-model="product.product_price"
            class="border p-2 w-full mb-4"
            required
          />
          <label class="block mb-2">Description</label>
          <input
            type="text"
            v-model="product.description"
            class="border p-2 w-full mb-4"
            required
          />
        </div>
        <div class="flex justify-end">
          <button
            @click="updateProduct"
            class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mr-2"
          >
            Save
          </button>
          <button
            @click="cancelEdit"
            class="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
