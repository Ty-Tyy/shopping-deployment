<template>
  <main>
    <section class="bg-gray-50 dark:bg-gray-900">
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div
          class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
        >
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1
              class="text-xl font-bold leading-tight tracking-tight text-center text-gray-900 md:text-2xl dark:text-white"
            >
              Admin Login
            </h1>
            <form @submit.prevent="validateForm" class="space-y-4 md:space-y-6">
              <div>
                <label
                  for="email"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Gmail</label
                >
                <input
                  v-model="forminput.email"
                  :invalid="!formValidate.email"
                  type="email"
                  name="email"
                  id="email"
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="example@gmail.com"
                />
                <Message v-if="!formValidate.email" class="error">{{
                  errorMessages.email
                }}</Message>
              </div>
              <div>
                <label
                  for="password"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Password</label
                >
                <input
                  v-model="forminput.password"
                  :invalid="!formValidate.password"
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                <Message severity="error" v-if="!formValidate.password" class="error">{{
                  errorMessages.password
                }}</Message>
              </div>

              <button
                :disabled="isLoading"
                type="submit"
                class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                <span v-if="isLoading">Login...</span>
                <span v-else>Login</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import axios from 'axios'
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'

const $cookies = inject('$cookies')

const forminput = ref({
  email: '',
  password: '',
  date: null,
  checked: true
})

const formValidate = ref({
  email: true,
  password: true,
  date: true,
  checked: true
})

const errorMessages = ref({
  email: '',
  password: ''
})

const router = useRouter()
const apiURL = import.meta.env.VITE_API_URL
const isLoading = ref(false)
const loginCache = ref(null) // Cache to store login data

const validateForm = () => {
  formValidate.value.email = validateEmail(forminput.value.email)
  formValidate.value.password = validatePassword(forminput.value.password)

  if (formValidate.value.email && formValidate.value.password) {
    submitform()
  }
}

const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!emailRegex.test(email)) {
    errorMessages.value.email = 'Invalid email'
    return false
  }
  return true
}

const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  if (!passwordRegex.test(password)) {
    errorMessages.value.password = 'Incorrect password!!'
    return false
  }
  return true
}

const submitform = async () => {
  isLoading.value = true

  // Check cache first
  if (loginCache.value && loginCache.value.email === forminput.value.email) {
    console.log('Using cached login data')
    useCachedData(loginCache.value)
    return
  }

  try {
    const response = await axios.post(`${apiURL}/login`, forminput.value)
    console.log(response.data.user)

    // Cache the user data
    loginCache.value = response.data.user

    $cookies.set('api_key', response.data.user.access_token)
    $cookies.set('profile', response.data.user)

    setTimeout(() => {
      const access_token = $cookies.get('api_key')
      if (access_token) {
        router.push('/admin/ordering')
      }
    }, 500)
  } catch (error) {
    if (error.response && error.response.status === 401) {
      errorMessages.value.email = 'Invalid email or password'
    } else {
      errorMessages.value.email = 'An error occurred. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}

// Function to handle cached data if available
const useCachedData = (cachedUser) => {
  $cookies.set('api_key', cachedUser.access_token)
  $cookies.set('profile', cachedUser)
  router.push('/admin/ordering')
}
</script>
