<script setup>
import { inject, onMounted, ref } from 'vue'
import axios from 'axios'
import { useToast } from 'vue-toastification'

const emit = defineEmits(['afterSubmit'])
const toast = useToast()

// State management
const step = ref(1)
const isLoading = ref(false)
const showDialog = ref(false)
const promocodeForm = ref({
  promocode_name: '',
  code: '',
  amount: '',
  discound_type: '',
  start_date: '',
  expire_date: '',
  promotion_type: '',
  created_by_user_id: '',
  store_id: ''
})
// const promotionProductForm = ref({
//   product_id: [],
//   promocode_id: '',
//   type_id: '',
//   created_by_user_id: ''
// })
const promotionProductForm = ref([
  {
    product_id: [],
    promocode_id: '',
    type_id: '',
    created_by_user_id: ''
  }
])

const groupedTypes = ref([]) // for product types
const selectedTypes = ref([]) // for selected products
/**
 *
 */
const $cookies = inject('$cookies')
const profile = $cookies.get('profile')
const apiUrl = import.meta.env.VITE_API_URL
const imgUrl = import.meta.env.VITE_IMG_URL

// Step 1: Initialize the form with store and user data
onMounted(() => {
  fetchProductTypes()
  promocodeForm.value.created_by_user_id = profile.id
  promocodeForm.value.store_id = profile.store.id
})

// Fetch product types and structure data
const fetchProductTypes = async () => {
  const token = getCookie('api_key')
  try {
    const response = await axios.get(`${apiUrl}/get-type-product`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    // Structure the response for MultiSelect usage
    groupedTypes.value = response.data.map((type) => ({
      type_name: type.type_name,
      id: type.id,
      Product: type.Product.map((Product) => ({
        label: Product.product_name, // Display product name
        value: Product.id, // Use product ID as value
        product_img: Product.product_img,
        product_price: Product.product_price
      }))
    }))
  } catch (error) {
    console.error('Failed to fetch product types:', error)
  }
}

// Cookie helper function
const getCookie = (name) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
  return null
}

// Step 2: Handle the submission of the promocode form
const handlePromoCodeSubmit = async () => {
  isLoading.value = true
  const token = getCookie('api_key')
  try {
    const response = await axios.post(`${apiUrl}/insertpromocode`, promocodeForm.value, {
      headers: { Authorization: `Bearer ${token}` }
    })

    // Store the promocode ID and show the next step (product selection)
    promocodeForm.value.id = response.data.id
    step.value = 2 // Show the product selection form
    toast.success('Promotion code created successfully')
  } catch (error) {
    console.error(error)
    toast.error('Failed to create promotion code')
  } finally {
    isLoading.value = false
  }
}

// Step 3: Handle the submission of the promotion product form
const handlePromotionProductSubmit = async () => {
  isLoading.value = true

  const token = getCookie('api_key')

  // Prepare the promo_data array to hold product information
  const promo_data = []

  // Loop through each selected product to create a separate product entry
  const selectedProducts = selectedTypes.value.map((item) => item.value)

  // Extract type_ids from selected products
  const selectedProductTypes = selectedTypes.value
    .map((item) => {
      const product = groupedTypes.value.find((group) =>
        group.Product.some((prod) => prod.value === item.value)
      )
      return product ? product.id : null
    })
    .filter((id) => id !== null)

  // Ensure all selected products belong to the same type
  if (new Set(selectedProductTypes).size > 1) {
    toast.error('All selected products must belong to the same type.')
    isLoading.value = false
    return
  }

  const type_id = selectedProductTypes[0] // Assign the type_id to the first product type

  // Create a new promo_data entry for each selected product
  selectedProducts.forEach((product_id) => {
    promo_data.push({
      promocode_id: promocodeForm.value.id, // Use the current promocode ID
      type_id: type_id, // Set the shared type_id for all products
      product_id: product_id, // Set individual product ID
      created_by_user_id: profile.id // User ID of the creator
    })
  })

  try {
    // Submit the promo_data array to the backend
    await axios.post(`${apiUrl}/insertpromotion_product`, promo_data, {
      headers: { Authorization: `Bearer ${token}` }
    })

    toast.success('Promotion products added successfully')
    emit('afterSubmit', true) // Notify parent component

    // Close the dialog after successful submission
    showDialog.value = false

    // Reset after submission, if you want to clear the array
    promotionProductForm.value = [
      {
        product_id: [],
        promocode_id: '',
        type_id: '',
        created_by_user_id: ''
      }
    ]
  } catch (error) {
    console.error(error)
    toast.error('Failed to add promotion product')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <Button
    label="Add Promotion Product"
    icon="pi pi-plus"
    @click="showDialog = !showDialog"
    class="mb-4 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700 transition duration-300"
  />

  <!-- Dialog for Adding Promotion -->
  <Dialog v-model:visible="showDialog" modal header="Add Promotion" class="max-w-4xl mx-auto">
    <!-- Step 1: Promo Code Form -->
    <div v-if="step === 1">
      <form @submit.prevent="handlePromoCodeSubmit">
        <div class="space-y-6 p-8 bg-white rounded-lg shadow-md">
          <!-- Promocode Name Input -->
          <div>
            <label for="promocode_name" class="block text-lg font-semibold text-gray-700"
              >Promocode Name</label
            >
            <input
              v-model="promocodeForm.promocode_name"
              type="text"
              id="promocode_name"
              placeholder="Enter a promocode name"
              class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-gray-700 p-3 text-lg"
              required
            />
          </div>

          <!-- Promotion Code Input -->
          <div>
            <label for="code" class="block text-lg font-semibold text-gray-700"
              >Promotion Code</label
            >
            <input
              v-model="promocodeForm.code"
              type="text"
              id="code"
              placeholder="Enter a promocode"
              class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-gray-700 p-3 text-lg"
              required
            />
          </div>

          <!-- Promotion Amount Input -->
          <div>
            <label for="amount" class="block text-lg font-semibold text-gray-700"
              >Promotion Amount</label
            >
            <input
              v-model="promocodeForm.amount"
              type="text"
              id="amount"
              placeholder="Enter amount"
              class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-gray-700 p-3 text-lg"
              required
            />
          </div>

          <!-- Discount Type Select -->
          <div>
            <label for="discound_type" class="block text-lg font-semibold text-gray-700"
              >Discount Type</label
            >
            <SelectButton
              v-model="promocodeForm.discound_type"
              :options="['Percentage', 'FixedAmount']"
              id="discound_type"
              class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-gray-700 p-3 text-lg"
            />
          </div>

          <!-- Start Date Input -->
          <div>
            <label for="start_date" class="block text-lg font-semibold text-gray-700"
              >Start date of the promotion</label
            >
            <input
              v-model="promocodeForm.start_date"
              type="date"
              id="start_date"
              placeholder="yy-mm-dd"
              class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-gray-700 p-3 text-lg"
              required
            />
          </div>

          <!-- Expiry Date Input -->
          <div>
            <label for="expire_date" class="block text-lg font-semibold text-gray-700"
              >Expire date of the promotion</label
            >
            <input
              v-model="promocodeForm.expire_date"
              type="date"
              id="expire_date"
              placeholder="yy-mm-dd"
              class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-gray-700 p-3 text-lg"
              required
            />
          </div>

          <!-- Promotion Type Input -->
          <div>
            <label for="promotion_type" class="block text-lg font-semibold text-gray-700"
              >Promotion Type</label
            >
            <input
              v-model="promocodeForm.promotion_type"
              type="text"
              id="promotion_type"
              placeholder="Enter a promotion type"
              class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-gray-700 p-3 text-lg"
              required
            />
          </div>

          <!-- Submit Button -->
          <div class="pt-6">
            <button
              class="w-full bg-red-600 text-white font-bold py-3 px-6 rounded-md transition duration-300 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              :disabled="isLoading"
            >
              <span v-if="isLoading">Creating...</span>
              <span v-else>Create Promocode</span>
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- Step 2: Product Selection Form -->
    <div v-if="step === 2">
      <form @submit.prevent="handlePromotionProductSubmit">
        <div class="space-y-6 p-8 bg-white rounded-lg shadow-md">
          <!-- Product Selection -->
          <div>
            <label for="product_types" class="block text-lg font-semibold text-gray-700"
              >Select Products</label
            >
            <MultiSelect
              v-model="selectedTypes"
              :options="groupedTypes"
              optionLabel="label"
              filter
              optionGroupLabel="type_name"
              optionGroupChildren="Product"
              display="chip"
              placeholder="Select Products"
              class="w-full md:w-80"
            >
              <template #optiongroup="slotProps">
                <div class="flex items-center cursor-pointer">{{ slotProps.option.type_name }}</div>
              </template>
              <template #option="slotProps">
                <div class="flex items-center">
                  {{ slotProps.option.label }}
                  <img
                    :src="`${imgUrl}/${slotProps.option.product_img}`"
                    :alt="slotProps.option.label"
                    class="w-6 h-6 rounded-lg object-cover ml-2"
                  />
                </div>
              </template>
            </MultiSelect>
          </div>

          <!-- Submit Button -->
          <div class="pt-6">
            <button
              class="w-full bg-red-600 text-white font-bold py-3 px-6 rounded-md transition duration-300 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              :disabled="isLoading"
            >
              <span v-if="isLoading">Submitting...</span>
              <span v-else>Submit Promotion Product</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </Dialog>
</template>
