<template>
  <div class="card text-lg md:text-lg lg:text-xl">
    <main class="">
      <div>
        <header class="w-full flex flex-nowrap">
          <div v-for="(type, index) in types" :key="index">
            <button
              @click="handleTabChange(type.id, type.type_name, type.Product)"
              class="bg-slate-50 py-1 px-4 border-b-2 duration-300"
              :class="{ 'text-red-500 border-red-500': activeTab === type.id }"
            >
              {{ type.type_name }}
            </button>
          </div>
        </header>

        <div class="p-6">
          <ProductListComponent
            v-model="selectedTab"
            :title="activeTitle"
            :product="activeProduct"
            @afterSubmit="handleAddProduct"
            @editProduct="editProduct"
            @productDeleted="handleProductDeleted"
          >
            <AddProductComponent @afterSubmit="handleAddProduct" />
          </ProductListComponent>
          <UpdateProductComponent
            :isEditing="isEditing"
            :selectedProduct="selectedProduct"
            :activeProduct="activeProduct"
            :activeTab="activeTab"
            @update:isEditing="isEditing = $event"
            @update:selectedProduct="selectedProduct = $event"
            @productUpdated="handleProductUpdated"
            @cancelEdit="closeEdit"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import AddProductComponent from './AddProductComponent.vue'
import ProductListComponent from './ProductListComponent.vue'
import UpdateProductComponent from './updateProductComponent.vue'
/**
 * import api end point url
 */
const apiUrl = import.meta.env.VITE_API_URL
// const imgUrl = import.meta.env.VITE_IMG_URL
/**
 *
 */
const tabs = ref([])
const selectedTab = ref(null)
const isLoading = ref(false)
const hasError = ref(false)
const isEditing = ref(false)
const selectedProduct = ref(null)
// const productsByTab = ref({})
const types = ref([])
const activeProduct = ref([])
const activeTab = ref('')
const activeTitle = ref('')
/**
 *
 */
const handleTabChange = async (id, title, product) => {
  activeTab.value = id
  activeTitle.value = title
  activeProduct.value = product || []
}
/**
 *Function get cookie by name
 */
const getCookie = (name) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
  return null
}
// Fetch product types from API and populate tabs
const fetchTabsData = async () => {
  const token = getCookie('api_key')
  try {
    const response = await axios.get(`${apiUrl}/get-type-product`, {
      headers: {
        Authorization: `Bearer ${token}` // Use the token from the cookie
      }
    })
    const data = response.data
    //
    types.value = response.data
    activeTab.value = response.data[0].id
    activeTitle.value = response.data[0].type_name
    activeProduct.value = response.data[0].Product
    //
    tabs.value = data.map((item) => ({
      title: item.type_name,
      value: item.id.toString()
    }))

    // Set selected tab if data is available
    if (tabs.value.length > 0) {
      selectedTab.value = tabs.value[0].value
    }
  } catch (error) {
    console.error('Error fetching product types:', error)
    hasError.value = true
  } finally {
    isLoading.value = false
  }
}
/**
 *
 */
const handleProductDeleted = async () => {
  await fetchTabsData()
}
/**
 *
 */
onMounted(async () => {
  await fetchTabsData() // Fetch tabs first
  if (tabs.value.length > 0) {
    selectedTab.value = tabs.value[0].value // Set initial selectedTab
    await fetchTabsData(selectedTab.value) // Fetch initial products
  }
})
/**
 *
 *
 */
const handleAddProduct = async (value) => {
  const token = getCookie('api_key')
  if (value) {
    await fetchTabsData(activeTab.value, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }) // Fetch tabs first
    if (tabs.value.length > 0) {
      selectedTab.value = tabs.value[0].value // Set initial selectedTab
      await fetchTabsData(selectedTab.value, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }) // Fetch initial products
    }
  }
}
/**
 *
 */
const editProduct = (product) => {
  isEditing.value = true
  selectedProduct.value = { ...product }
}
/**
 *
 */
const handleProductUpdated = async (payload) => {
  if (!payload || !payload.activeProduct || !payload.updatedProduct) {
    console.warn('Invalid payload received for product update', payload)
    return
  }
  const { activeProduct, updatedProduct } = payload

  // Ensure activeProduct is an array
  if (!Array.isArray(activeProduct)) {
    console.warn('activeProduct is not an array:', activeProduct)
    return
  }

  const index = activeProduct.findIndex(
    (product) => String(product.id) === String(updatedProduct.id)
  )
  if (index !== -1) {
    // Update the product in the array
    activeProduct[index] = { ...updatedProduct } // Spread to create a new reference
    closeEdit()
    await fetchTabsData() // Optional: Refresh data from server
  } else {
    console.warn('Updated product not found in the current tab:', updatedProduct)
  }
}
/**
 *
 */
const closeEdit = () => {
  isEditing.value = false
  selectedProduct.value = null
}
</script>
