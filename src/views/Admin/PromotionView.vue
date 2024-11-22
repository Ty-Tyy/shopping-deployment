<script setup>
import { ref, onMounted, inject } from 'vue'
import { format } from 'date-fns'
import { useToast } from 'vue-toastification'
import axios from 'axios'
import AddPromtoionButtonComponent from '@/components/AddPromtoionButtonComponent.vue'
/**
 *
 */
const $cookies = inject('$cookies')
const user_id = $cookies.get('profile')
const imgUrl = import.meta.env.VITE_IMG_URL
const apiUrl = import.meta.env.VITE_API_URL
/**
 *
 */
const deleteDialog = ref(false)
const selectedPromoProductID = ref(null)
const isLoading = ref(false)
const promotionProducts = ref([])
const toast = useToast()
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
 * Format the date function
 */
const formatDate = (dateString) => {
  return format(new Date(dateString), 'MMMM dd, yyyy')
}
/**
 *
 */
const fetchPromotionProduct = async () => {
  isLoading.value = true
  const token = getCookie('api_key')
  try {
    const response = await axios.get(`${apiUrl}/getpromotion_product`, {
      headers: {
        Authorization: `Bearer ${token}` // Use the token from cookie
      }
    })
    promotionProducts.value = response.data
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
/**
 *
 */
const handleDeletePromoProduct = (id) => {
  selectedPromoProductID.value = id
  deleteDialog.value = true
}
/**
 *
 */
const deletePromoProduct = async () => {
  const token = getCookie('api_key')
  if (selectedPromoProductID.value) {
    // Ensure both promotion product ID and user IDs are available
    try {
      await axios.delete(
        `${apiUrl}/deletepromotion_product/${selectedPromoProductID.value}/${user_id.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      toast.success('Promotion Product deleted successfully')
      deleteDialog.value = false
      await fetchPromotionProduct()
    } catch (error) {
      console.error('Error deleting promotion product:', error)
      toast.error('Error deleting promotion product:', error)
    }
  } else {
    console.error('No promotion product ID or user ID found for deletion')
    toast.error('No promotion product ID or user ID found for deletion')
  }
}
/**
 *
 */
onMounted(fetchPromotionProduct)
</script>

<template>
  <AdminHeader />
  <div class="flex justify-between items-center bg-red-600 p-4 rounded-t-lg">
    <h1 class="text-white text-lg font-semibold">Promotion Products</h1>
    <AddPromtoionButtonComponent @afterSubmit="fetchPromotionProduct" />
  </div>
  <div class="bg-white shadow-md rounded-b-lg">
    <div v-if="isLoading" class="text-center py-4">Loading Promotion Products...</div>
    <table v-else class="min-w-full text-left table-auto">
      <thead>
        <tr class="bg-gray-200 text-center">
          <th class="p-4">Image</th>
          <th class="p-4">Product Name</th>
          <th class="p-4">Promotion Type</th>
          <th class="p-4">Promocode</th>
          <th class="p-4">Product Type</th>
          <th class="p-4">Discount</th>
          <th class="p-4">Start Promo Date</th>
          <th class="p-4">Expire Promo Date</th>
          <th class="p-4">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="promotionProducts.length === 0">
          <td colspan="7" class="text-center py-4 pl-10">No promotion products</td>
        </tr>
        <!-- Loop through promotion products -->
        <tr
          v-for="(promoProducts, index) in promotionProducts"
          :key="(index, promoProducts.id)"
          class="border-b text-center"
        >
          <td class="py-4 pl-6">
            <img
              :src="`${imgUrl}/${promoProducts.product.product_img}`"
              :alt="promoProducts.product.product_name"
              class="w-18 h-16 rounded-md"
            />
          </td>
          <td class="p-4">{{ promoProducts.product.product_name }}</td>
          <td class="py-4">{{ promoProducts.promocode.promotion_type }}</td>
          <td class="py-4">{{ promoProducts.promocode.code }}</td>
          <td class="p-4">{{ promoProducts.type.type_name }}</td>
          <td v-if="promoProducts.promocode.discound_type === 'Percentage'" class="p-4">
            {{ promoProducts.promocode.amount }}%
          </td>
          <td v-if="promoProducts.promocode.discound_type === 'FixedAmount'" class="p-4">
            ${{ promoProducts.promocode.amount }}
          </td>
          <td class="p-4">{{ formatDate(promoProducts.promocode.start_date) }}</td>
          <td class="p-4">{{ formatDate(promoProducts.promocode.expire_date) }}</td>
          <td class="p-4">
            <button
              type="button"
              @click="handleDeletePromoProduct(promoProducts.id)"
              class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              Delete
            </button>
          </td>
        </tr>
        <!-- Delete Promotion Product Dialog -->
        <Dialog
          v-model:visible="deleteDialog"
          modal
          header="Deleting Promotion Product"
          :style="{ width: '32rem', borderRadius: '1rem', padding: '1rem' }"
          @keydown.escape="deleteDialog = false"
          class="text-center shadow-lg"
        >
          <div class="my-6 text-gray-600">
            <p class="text-lg font-medium">Are you sure you want to delete this promotion?</p>
            <p class="text-sm text-gray-500 mt-2">
              This action is irreversible. The promotion product's will be permanently removed.
            </p>
          </div>
          <div class="flex justify-end gap-4 mt-6">
            <Button
              type="button"
              label="Cancel"
              class="p-button-outlined p-button-secondary"
              :style="{
                padding: '0.75rem 1.5rem',
                fontSize: '0.9rem',
                borderRadius: '0.375rem'
              }"
              @click="deleteDialog = false"
            />
            <Button
              type="button"
              label="Confirm"
              class="p-button-danger"
              :style="{
                padding: '0.75rem 1.5rem',
                fontSize: '0.9rem',
                borderRadius: '0.375rem'
              }"
              @click="deletePromoProduct(selectedPromoProductID.value)"
            />
          </div>
        </Dialog>
      </tbody>
    </table>
  </div>
</template>
