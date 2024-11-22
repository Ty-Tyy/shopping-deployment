<script setup>
import { ref, onMounted, inject, computed } from 'vue'
import { useToast } from 'vue-toastification'
import { useStore } from 'vuex'
import axios from 'axios'
import ReceiptPopup from './ReceiptComponent.vue'

const toast = useToast()
const cartStore = useStore()
const showReceipt = ref(false)

// State for cart and discount
const cartItems = computed(() => cartStore.getters['cart/cartItems'])

const total = computed(() => {
  return (
    cartItems.value.reduce((sum, item) => sum + item.product_qty * item.product_price, 0) -
    discount.value
  )
})

const subtotal = computed(() => {
  const value = cartItems.value.reduce(
    (sum, item) => sum + (item.product_qty || 0) * (item.product_price || 0),
    0
  )
  return value
})
const discount = computed(() => cartStore.getters['cart/discount'])

const apiUrl = import.meta.env.VITE_API_URL
const $cookies = inject('$cookies')
const store = $cookies.get('profile')

// Form and UI states
const phoneInput = ref('')
// const otpInput = ref('')
const otpDigits = ref(Array(6).fill(''))
const actualOtp = ref(null)
const isPhoneVerified = ref(false)
const showDialog = ref(false)
const orderID = ref(null)
const customerID = ref(null)
const isLoading = ref(false)
const paymentMethods = ref([])
const selectedPaymentMethod = ref('')
const showPaymentMethod = ref(false)
const showCustomerForm = ref(false)

// Initial form data for customer details
const forminput = ref({
  first_name: '',
  last_name: '',
  phone_number: '',
  email_address: '',
  store_id: store?.store?.id || ''
})

// Fetch payment methods on mount
const fetchPaymentMethods = async () => {
  if (paymentMethods.value.length) return // Avoid re-fetching
  isLoading.value = true
  try {
    const response = await axios.get(`${apiUrl}/getpayment_method`)
    paymentMethods.value = response.data
  } catch (error) {
    toast.error('Failed to load payment methods. Please try again.')
  } finally {
    isLoading.value = false
  }
}

// Handle phone number verification
const handlePhoneSubmit = async () => {
  isLoading.value = true
  try {
    const response = await axios.get(`${apiUrl}/getcustomerbyphone/${phoneInput.value}`)
    if (response.data && response.data.phone_number === phoneInput.value) {
      setExistingCustomerData(response.data)
      showPaymentMethod.value = true
      toast.success('Phone number found! You can now select a payment method.')
    } else {
      prepareForNewCustomerRegistration()
      toast.info('Phone number not found! Please provide your details.')
    }
  } catch (error) {
    toast.error('An error occurred while checking the phone number. Please try again.')
  } finally {
    isLoading.value = false
  }
}

// Set data for an existing customer
const setExistingCustomerData = (data) => {
  customerID.value = data.id
  forminput.value = {
    first_name: data.first_name,
    last_name: data.last_name,
    phone_number: data.phone_number,
    email_address: data.email_address,
    store_id: forminput.value.store_id
  }
  isPhoneVerified.value = true // Skip OTP if customer already exists
}

// Prepare form for new customer registration
const prepareForNewCustomerRegistration = () => {
  forminput.value.phone_number = phoneInput.value
  showCustomerForm.value = true
}

// Send OTP to the customer (only for new customer)
const sendOtp = async () => {
  isLoading.value = true
  try {
    const response = await axios.post(`${apiUrl}/verify-customer`, {
      phone_number: phoneInput.value
    })
    actualOtp.value = response.data
    console.log(actualOtp.value)
    toast.success('Verification code sent! Please check your phone.')
  } catch (error) {
    toast.error('Failed to send OTP. Please try again.')
  } finally {
    isLoading.value = false
  }
}

const handleOtpInput = (index) => {
  if (otpDigits.value[index].length === 1 && index < otpDigits.value.length - 1) {
    // Move to the next input
    document.querySelectorAll('input')[index + 1].focus()
  }
}

// Validate OTP
const validateOtp = async () => {
  isLoading.value = true
  const enteredOtp = otpDigits.value.join('')
  if (enteredOtp === actualOtp.value) {
    toast.success('Verification successful!!!')
    await registerCustomer()
    isPhoneVerified.value = true
    showCustomerForm.value = false
    showPaymentMethod.value = true
  } else {
    toast.error('Incorrect Code. Please try again.')
    otpDigits.value = Array(6).fill('') // Clear the inputs
  }
  isLoading.value = false
}

// Register new customer
const registerCustomer = async () => {
  try {
    const response = await axios.post(`${apiUrl}/insertcustomer`, {
      first_name: forminput.value.first_name,
      last_name: forminput.value.last_name,
      phone_number: forminput.value.phone_number,
      email_address: forminput.value.email_address,
      store_id: forminput.value.store_id
    })
    customerID.value = response.data.id
    toast.success('Customer registered successfully!')
  } catch (error) {
    toast.error('Failed to register customer. Please try again.')
    isPhoneVerified.value = false
  }
}

// Submit order (payment is processed after order submission)
const handleOrderSubmit = async () => {
  if (!isPhoneVerified.value) {
    // Register new customer only if OTP code is verified
    if (showCustomerForm.value) {
      await registerCustomer()
    } else {
      toast.error('Please verify your phone number first.')
      return
    }
  }
  await submitOrder()
}

// Create order
const submitOrder = async () => {
  isLoading.value = true

  // Create order products array based on cart items
  const OrderProducts = cartItems.value.map((item) => ({
    product_id: item.id,
    id: '', // This can be left empty if your backend generates it
    total_price: item.product_price * item.product_qty,
    qty: item.product_qty,
    price: item.product_price,
    discount: discount.value || 0, // Default to 0 if no discount
    order_id: '', // This can be updated later after the order is created
    created_by_user_id: store?.user_id || '',
    created_at: '',
    updated_by_user_id: null,
    updated_at: null,
    delete_by_user_id: null,
    delete_at: null
  }))

  const orderData = {
    customer_id: customerID.value,
    total_qty: cartItems.value.reduce((total, item) => total + item.product_qty, 0),
    total_price: total.value,
    total_discount: discount.value,
    store_id: forminput.value.store_id,
    order_products: OrderProducts
  }

  try {
    const response = await axios.post(`${apiUrl}/insertorder`, orderData)
    orderID.value = response.data.data.id
    toast.success('Order created successfully!')
    await processPayment(customerID.value)
  } catch (error) {
    toast.error('Order submission failed. Please try again.')
  } finally {
    isLoading.value = false
  }
}

// Process payment
const processPayment = async (customer_id) => {
  isLoading.value = true
  const paymentData = {
    method_name: selectedPaymentMethod.value.method_name,
    store_id: forminput.value.store_id,
    payment_price: total.value,
    order_id: orderID.value,
    paid_by_customer_id: customer_id
  }
  try {
    await axios.post(`${apiUrl}/insertpayment`, paymentData)
    showDialog.value = false
    toast.success('Payment processed successfully.')
    showReceipt.value = true // Show receipt after successful payment
  } catch (error) {
    toast.error('Payment failed. Please try again.')
  } finally {
    isLoading.value = false
  }
}

// Fetch payment methods on mounted
onMounted(fetchPaymentMethods)
</script>

<template>
  <!-- Checkout Button -->
  <Button
    label="Checkout"
    @click="showDialog = !showDialog"
    class="mt-8 max-w-md text-sm px-6 py-3 w-full text-white font-semibold tracking-wide rounded-lg"
  />

  <!-- Checkout Dialog -->
  <Dialog v-model:visible="showDialog" modal header="Checking Out">
    <form @submit.prevent="handleOrderSubmit">
      <div class="bg-white shadow-md rounded-lg p-6 lg:pr-6">
        <div class="grid gap-6 lg:grid-cols-2">
          <!-- Phone Number Verification -->
          <section class="lg:col-span-2 max-w-4xl mx-auto w-full">
            <div class="mt-10">
              <h2 class="text-2xl font-bold text-center text-gray-800 mb-4">
                Phone Number Verification
              </h2>

              <div class="grid gap-4 mt-4">
                <label for="phone_number" class="sr-only">Phone Number</label>
                <input
                  v-model="phoneInput"
                  type="text"
                  id="phone_number"
                  placeholder="Enter your phone number"
                  required
                  class="w-full px-4 py-2 text-sm text-gray-800 bg-gray-100 border rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
                />
              </div>

              <div class="flex justify-center gap-4 mt-8">
                <button
                  type="button"
                  :loading="isLoading"
                  @click="handlePhoneSubmit"
                  class="px-6 py-3.5 min-w-[150px] text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                >
                  Check Phone Number
                </button>
              </div>
            </div>

            <!-- Customer Registration Form -->
            <div v-if="showCustomerForm" class="mt-10">
              <h2 class="text-2xl font-bold text-center text-gray-800 mb-4">
                Customer Registration
              </h2>

              <div class="grid gap-8 mt-8">
                <input
                  v-model="forminput.first_name"
                  type="text"
                  id="first_name"
                  placeholder="First Name"
                  required
                  class="w-full px-4 py-2 text-sm text-gray-800 bg-gray-100 border rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
                />

                <input
                  v-model="forminput.last_name"
                  type="text"
                  id="last_name"
                  placeholder="Last Name"
                  required
                  class="w-full px-4 py-2 text-sm text-gray-800 bg-gray-100 border rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
                />

                <input
                  v-model="forminput.email_address"
                  type="email"
                  id="email_address"
                  placeholder="Email Address"
                  required
                  class="w-full px-4 py-2 text-sm text-gray-800 bg-gray-100 border rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
                />
              </div>

              <div class="flex justify-center gap-4 mt-8">
                <button
                  :disabled="isLoading"
                  type="button"
                  @click="sendOtp"
                  class="px-6 py-3.5 min-w-[150px] text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                >
                  <span v-if="isLoading">Sending...</span>
                  <span v-else>Send verification code </span>
                </button>
              </div>

              <div v-if="actualOtp && !showPaymentMethod" class="flex justify-center mt-8 gap-2">
                <input
                  v-for="(digit, index) in otpDigits"
                  :key="index"
                  type="text"
                  v-model="otpDigits[index]"
                  maxlength="1"
                  class="w-12 h-12 text-center text-xl text-gray-800 bg-gray-100 border rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
                  @input="handleOtpInput(index)"
                />
                <button
                  :disabled="isLoading"
                  type="button"
                  @click="validateOtp"
                  class="px-6 py-3.5 min-w-[150px] text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
                >
                  <span v-if="isLoading">Verifying...</span>
                  <span v-else>Verify</span>
                </button>
              </div>
            </div>

            <!-- Payment Method Selection -->
            <div v-if="showPaymentMethod" class="mt-16">
              <h2 class="text-xl font-bold text-gray-800">Select Payment Option</h2>
              <div class="grid gap-4 mt-4 sm:grid-cols-2">
                <div
                  v-for="method in paymentMethods"
                  :key="method.id"
                  class="flex items-center p-4 border rounded-md hover:border-blue-500 transition cursor-pointer"
                  :class="{ 'border-blue-600': selectedPaymentMethod === method }"
                  @click="selectedPaymentMethod = method"
                >
                  <input
                    type="radio"
                    :value="method"
                    v-model="selectedPaymentMethod"
                    class="hidden"
                    required
                  />
                  <label class="flex items-center ml-2 text-gray-800 cursor-pointer">
                    <span class="mr-2">{{ method.method_name }}</span>
                    <img
                      v-if="method.method_name === 'Card'"
                      src="https://readymadeui.com/images/visa.webp"
                      class="w-12"
                      alt="Visa"
                    />
                    <img
                      v-if="method.method_name === 'Card'"
                      src="https://readymadeui.com/images/master.webp"
                      class="w-12"
                      alt="Mastercard"
                    />
                    <img
                      v-if="method.method_name === 'ABA'"
                      src="https://www.ababank.com/typo3conf/ext/boxmodel/Resources/Private/Templates/ABA/images/aba-web-top-logo.png"
                      class="w-12"
                      alt="ABA"
                    />
                    <img
                      v-if="method.method_name === 'ACLEDA'"
                      src="https://www.acledabank.com.kh/kh/assets/download_material/download-logo-blue.jpg"
                      class="w-12"
                      alt="Acleda"
                    />
                  </label>
                </div>
              </div>

              <button
                :disabled="isLoading"
                type="submit"
                class="mt-4 px-6 py-3.5 min-w-[150px] text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
              >
                <span v-if="isLoading">Processing...</span>
                <span v-else>Pay Now</span>
              </button>
            </div>
          </section>
        </div>
      </div>
    </form>
  </Dialog>
  <ReceiptPopup
    v-if="showReceipt"
    :showReceipt="showReceipt"
    :paymentMethod="selectedPaymentMethod?.method_name"
    :subtotal="subtotal"
    :discount="Number(discount)"
    :total="total"
    :purchasedProducts="cartItems"
    @update:showReceipt="showReceipt = $event"
  />
</template>
