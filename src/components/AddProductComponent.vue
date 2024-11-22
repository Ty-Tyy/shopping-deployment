<script setup>
import { inject, onMounted, ref } from 'vue'
import { useToast } from 'vue-toastification'
import axios from 'axios'
/**
 *
 */
const emit = defineEmits(['afterSubmit'])
const toast = useToast()
// Function to send the message to the parent
const sendToParent = () => {
  const message = true
  emit('afterSubmit', message)
}
/**
 *
 */
const apiUrl = import.meta.env.VITE_API_URL
const $cookies = inject('$cookies')
const showDialog = ref(false)
const isLoading = ref(false)
const types = ref([])
const product_img = ref(null)
const profile = $cookies.get('profile')
/**
 * Function to get cookie by name
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
const product = ref({
  product_name: '',
  product_img: '',
  product_price: '',
  product_qty: '',
  description: '',
  store_id: '',
  type_id: '',
  created_by_user_id: ''
})
/**
 *
 */
onMounted(async () => {
  fetchStore()
  fetchTypes()
  product.value.store_id = profile.store.id
  product.value.created_by_user_id = profile.id
})
/**
 *
 */
const fetchStore = async () => {
  const token = getCookie('api_key')
  await axios
    .get(`${apiUrl}/get-store`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(async (res) => {
      product.value.store_id = res.data[0].id
      product.value.created_by_user_id = res.data[0].created_by_user.id
    })
    .catch(async (error) => {
      console.log(error)
    })
}
/**
 *
 */
const fetchTypes = async () => {
  const token = getCookie('api_key')
  await axios
    .get(`${apiUrl}/gettype`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(async (res) => {
      types.value = res.data
    })
    .catch(async (error) => {
      console.log(error)
    })
}
/**
 *
 */
const onFileChange = (event) => {
  product_img.value = event.target.files[0]
}
/**
 *
 */
const validateForm = () => {
  if (
    product_img.value !== null &&
    product.value.product_name !== '' &&
    product.value.product_price !== '' &&
    product.value.product_qty !== '' &&
    product.value.store_id !== '' &&
    product.value.type_id !== ''
  ) {
    insertProduct()
  } else {
    console.log('Required')
  }
}
/**
 *
 */
const insertProduct = async () => {
  // Set loading state to true
  isLoading.value = true

  const token = getCookie('api_key')
  const formData = new FormData()

  // Add product image if it exists
  if (product_img.value) {
    formData.append('product_img', product_img.value)
  }

  try {
    // Step 1: Upload Product Image
    const uploadResponse = await axios.post(`${apiUrl}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    })

    // Update product with uploaded image filename
    product.value.product_img = uploadResponse.data.fileName

    // Step 2: Insert Product
    await axios.post(`${apiUrl}/insertproduct`, product.value, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    // Step 3: Post-Insertion Success Handling
    sendToParent()
    toast.success('Product added successfully!')

    // Reset the product state
    product.value = {
      product_name: '',
      product_price: '',
      product_qty: '',
      description: '',
      product_img: '',
      store_id: profile.store.id,
      created_by_user_id: profile.id
    }

    // Close dialog
    showDialog.value = false
  } catch (error) {
    // Handle Errors
    toast.error('Failed to add product. Please try again.')
    console.error('Error:', error)
  } finally {
    // Reset loading state
    isLoading.value = false
  }
}
</script>

<template>
  <Button label="Add New Product" icon="pi pi-plus" @click="showDialog = !showDialog" />
  <!--  -->
  <Dialog v-model:visible="showDialog" modal header="Add New Product">
    <form @submit.prevent="validateForm">
      <div class="flex mb-4 space-x-4">
        <div class="w-1/2">
          <label class="block text-gray-700 text-sm font-bold mb-2">Product Name</label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            v-model="product.product_name"
            required
          />
        </div>
        <div class="w-1/2">
          <label class="block text-gray-700 text-sm font-bold mb-2">Product Quantity</label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            v-model="product.product_qty"
            required
          />
        </div>
      </div>

      <div class="flex mb-4 space-x-4">
        <div class="w-1/2">
          <label class="block text-gray-700 text-sm font-bold mb-2">Product Price</label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            v-model="product.product_price"
            required
          />
        </div>
        <div class="w-1/2">
          <label class="block text-gray-700 text-sm font-bold mb-2">Product Category</label>
          <select
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            v-model="product.type_id"
            required
          >
            <option v-for="type in types" :key="type.id" :value="type.id">
              {{ type.type_name }}
            </option>
          </select>
        </div>
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">Product Image</label>
        <input type="file" @change="onFileChange" />
      </div>

      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2">Description</label>
        <textarea
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          v-model="product.description"
          rows="5"
          required
        ></textarea>
      </div>

      <div class="flex items-center justify-center">
        <button
          :disabled="isLoading"
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline m-5"
          type="submit"
        >
          <span v-if="isLoading">Adding</span>
          <span v-else>Add</span>
        </button>
      </div>
    </form>
  </Dialog>
</template>
