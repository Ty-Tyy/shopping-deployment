<script setup>
import axios from 'axios'
import { ref, inject } from 'vue'
import { useToast } from 'vue-toastification'
/**
 *
 */
const toast = useToast()
const $cookies = inject('$cookies')
const emit = defineEmits(['editProduct', 'afterSubmit', 'productDeleted'])
const selectedProductId = ref(null)
const imgUrl = import.meta.env.VITE_IMG_URL
const apiUrl = import.meta.env.VITE_API_URL
const deleteDialog = ref(false)
// Function to send the message to the parent
const sendToParent = () => {
  const message = true
  emit('afterSubmit', message)
}
/**
 *
 */
const props = defineProps({
  title: {
    required: true
  },
  product: {
    required: true
  },
  modelValue: String
})
/**
 *
 */
const handleAddProduct = async (value) => {
  if (value) {
    sendToParent()
  }
}
/**
 *
 */
const user_id = $cookies.get('profile')
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
 *Delete product function
 */
const deleteProduct = async () => {
  const token = getCookie('api_key')
  if (selectedProductId.value) {
    // Ensure both product and user IDs are available
    try {
      await axios.delete(`${apiUrl}/deleteproduct/${selectedProductId.value}/${user_id.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      toast.success('Product deleted successfully')
      deleteDialog.value = false
      emit('productDeleted')
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Error deleting product')
    }
  } else {
    console.error('No product ID or user ID found for deletion')
    toast.error('No product ID or user ID found for deletion')
  }
}
/**
 *
 */
const handleDeleteProduct = (id) => {
  selectedProductId.value = id
  deleteDialog.value = true
}
</script>

<template>
  <div class="flex justify-between items-center bg-red-600 p-4 rounded-t-lg">
    <h1 class="text-white text-lg font-semibold">Products ({{ title }})</h1>
    <AddProductComponent @afterSubmit="handleAddProduct" />
  </div>
  <div class="bg-white shadow-md rounded-b-lg">
    <table class="min-w-full text-left table-auto">
      <thead>
        <tr class="bg-gray-200">
          <th class="p-4">Image</th>
          <th class="p-4">Name</th>
          <th class="p-4">Product Quantity</th>
          <th class="p-4">Price</th>
          <th class="p-4">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="props.product.length === 0">
          <td colspan="5" class="text-center py-4">No products available for this Category</td>
        </tr>
        <tr v-for="product in props.product" :key="product.id" class="border-b">
          <td class="py-4 pl-4">
            <img
              :src="`${imgUrl}/${product.product_img}`"
              :alt="product.product_name"
              class="w-18 h-16 rounded-md"
            />
          </td>
          <td class="p-4">{{ product.product_name }}</td>
          <td class="py-4 pl-16">{{ product.product_qty }}</td>
          <td class="p-4">${{ product.product_price }}</td>
          <td class="p-4 flex space-x-2">
            <button
              type="button"
              @click="handleDeleteProduct(product.id)"
              class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
            >
              Delete
            </button>

            <button
              type="button"
              @click="$emit('editProduct', product)"
              class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Update
            </button>
          </td>
        </tr>
      </tbody>
      <!--  -->
      <Dialog
        v-model:visible="deleteDialog"
        modal
        header="Delete Product"
        :style="{ width: '25rem' }"
      >
        <div class="my-5">
          <p>Are you sure you want to delete this product?</p>
        </div>
        <div class="flex justify-end gap-2">
          <Button type="button" label="Cancel" severity="secondary" @click="deleteDialog = false" />
          <Button type="button" label="Delete" @click="deleteProduct(selectedProductId.value)" />
        </div>
      </Dialog>
    </table>
  </div>
</template>
