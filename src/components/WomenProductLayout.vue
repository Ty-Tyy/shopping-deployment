<template>
  <div class="card">
    <DataView :value="products" :layout="layout">
      <template #header>
        <div class="flex justify-end">
          <SelectButton v-model="layout" :options="options" :allowEmpty="false">
            <template #option="{ option }">
              <i :class="[option === 'list' ? 'pi pi-bars' : 'pi pi-table']" />
            </template>
          </SelectButton>
        </div>
      </template>

      <template #list="{ items }">
        <div class="flex flex-col" v-if="items && items.length">
          <div v-for="product in items" :key="product.id">
            <div class="flex flex-col sm:flex-row sm:items-center p-6 gap-4">
              <div class="md:w-40 relative">
                <img
                  class="block xl:block mx-auto rounded w-full"
                  :src="`${imgUrl}/${product.product_img}`"
                  :alt="product.product_name || 'Product Image'"
                />
                <Tag class="absolute dark:!bg-surface-900" style="left: 4px; top: 4px"></Tag>
              </div>
              <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                  <div>
                    <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">
                      {{ product.type?.type_name }}
                    </span>
                    <div class="text-lg font-medium mt-2">
                      {{ product.product_name || 'Unnamed Product' }}
                    </div>
                  </div>
                </div>
                <div class="flex flex-col md:items-end gap-8">
                  <span class="text-xl font-semibold">${{ product.product_price || '0.00' }}</span>
                  <Button
                    icon="pi pi-shopping-cart"
                    label="Add to Cart"
                    @click="addToCart(product)"
                    class="flex-auto whitespace-nowrap"
                  ></Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #grid="{ items }">
        <div class="grid grid-cols-12 gap-4" v-if="items && items.length">
          <div
            v-for="product in items"
            :key="product.id"
            class="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 p-2"
          >
            <div
              class="px-4 md:px-6 lg:px-8 pt-2 md:pt-4 lg:pt-6 pb-4 md:pb-6 lg:pb-8 border border-surface-100 dark:border-surface-700 bg-surface-0 dark:bg-neutral-300 rounded flex flex-col"
            >
              <div class="bg-neutral-600 flex justify-center rounded p-1">
                <div class="relative mx-auto">
                  <img
                    class="rounded w-full"
                    :src="`${imgUrl}/${product.product_img}`"
                    :alt="product.product_name || 'Product Image'"
                  />
                  <Tag class="absolute dark:!bg-surface-900" style="left: 4px; top: 4px"></Tag>
                </div>
              </div>
              <div class="pt-6">
                <div class="flex flex-row justify-between items-start gap-2">
                  <div>
                    <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">
                      {{ product.type?.type_name }}
                    </span>
                    <div class="text-lg font-medium mt-2">
                      {{ product.product_name || 'Unnamed Product' }}
                    </div>
                  </div>
                </div>
                <div class="flex flex-row justify-between items-end gap-8">
                  <span class="text-xl font-semibold">${{ product.product_price || '0.00' }}</span>
                  <Button
                    icon="pi pi-shopping-cart"
                    label="Add to Cart"
                    @click="addToCart(product)"
                    class="flex-auto whitespace-nowrap"
                  ></Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </DataView>
  </div>
</template>

<script setup>
import { ref, onMounted, markRaw } from 'vue'
import axios from 'axios'
import { useStore } from 'vuex'

const cartStore = useStore()
const products = ref([])
const layout = ref('grid')
const options = ref(['list', 'grid'])
const imgUrl = import.meta.env.VITE_IMG_URL
const apiUrl = import.meta.env.VITE_API_URL
/**
 * On Component Mount, Load Data and Cart
 */
onMounted(async () => {
  await fetchWomenProducts()
  await cartStore.dispatch('cart/loadCart')
})
/**
 * Fetch Women's Products Data
 */
const fetchWomenProducts = async () => {
  try {
    const response = await axios.get(`${apiUrl}/getproduct`)
    const womenProducts = response.data.filter((item) => item.type?.type_name === 'Women')
    products.value = markRaw(womenProducts)
  } catch (error) {
    console.error('Error fetching women’s product data:', error)
  }
}
/**
 * Add Product to Cart
 */
const addToCart = (product) => {
  cartStore.dispatch('cart/addToCart', product)
}
</script>
