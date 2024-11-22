<script setup>
import { ref, onMounted, inject } from 'vue'
import AdminHeader from '@/components/AdminHeader.vue'
import axios from 'axios'
import { useToast } from 'vue-toastification'

/**
 * Function to get API key from cookie
 */
const getCookie = (name) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  return parts.length === 2 ? parts.pop().split(';').shift() : null
}

/**
 * API URL and dependencies
 */
const apiURL = import.meta.env.VITE_API_URL
const $cookies = inject('$cookies')
const toast = useToast()
const profile = $cookies.get('profile')

/**
 * State
 */
const isLoading = ref(false)
const roles = ref([])

const forminput = ref({
  email: '',
  password: '',
  first_name: '',
  last_name: '',
  username: '',
  phone: '',
  role_id: '',
  store_id: '',
  created_by_user_id: '',
  checked: true
})
/**
 * Fetch roles
 */
async function fetchRoles() {
  const token = getCookie('api_key')
  isLoading.value = true
  try {
    const response = await axios.get(`${apiURL}/getrole`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    roles.value = response.data
  } catch (error) {
    console.error('Failed to fetch roles:', error)
  } finally {
    isLoading.value = false
  }
}
/**
 * Reset form function
 */
const resetForm = () => {
  forminput.value = {
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    username: '',
    phone: '',
    role_id: '',
    store_id: profile?.store?.id || '',
    created_by_user_id: profile?.id || '',
    checked: true
  }

  // Optional: Refocus on the first input field
  const firstInput = document.querySelector('input[name="first_name"]')
  if (firstInput) {
    firstInput.focus()
  }
}
/**
 * Submit form function
 */
const submitform = async () => {
  const token = getCookie('api_key')
  isLoading.value = true
  try {
    await axios.post(`${apiURL}/insertuser`, forminput.value, {
      headers: { Authorization: `Bearer ${token}` }
    })

    toast.success('User added successfully!')
    resetForm()
  } catch (error) {
    toast.error('Failed to add user!')
    console.error('Error:', error)
  } finally {
    isLoading.value = false
  }
}

/**
 * Lifecycle hook
 */
onMounted(async () => {
  await fetchRoles()
  resetForm()
})
</script>

<template>
  <main>
    <AdminHeader />
    <div class="bg-gray-50 min-h-screen flex items-center justify-center">
      <section class="w-full max-w-lg bg-white dark:bg-red-600 rounded-lg shadow-lg p-6 md:p-8">
        <h1 class="text-3xl font-bold text-center text-red-700 dark:text-white mb-6">Register</h1>
        <form @submit.prevent="submitform" class="space-y-6">
          <!-- Name Fields -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="first_name" class="form-label">First Name</label>
              <input
                v-model="forminput.first_name"
                type="text"
                name="first_name"
                class="input-field"
                placeholder="First Name"
              />
            </div>
            <div>
              <label for="last_name" class="form-label">Last Name</label>
              <input
                v-model="forminput.last_name"
                type="text"
                name="last_name"
                class="input-field"
                placeholder="Last Name"
              />
            </div>
          </div>

          <!-- Username -->
          <div>
            <label for="username" class="form-label">Username</label>
            <input
              v-model="forminput.username"
              type="text"
              name="username"
              class="input-field"
              placeholder="Username"
            />
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="form-label">Email</label>
            <input
              v-model="forminput.email"
              type="email"
              name="email"
              class="input-field"
              placeholder="example@gmail.com"
            />
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="form-label">Password</label>
            <input
              v-model="forminput.password"
              type="password"
              name="password"
              class="input-field"
              placeholder="••••••••"
            />
          </div>

          <!-- Phone -->
          <div>
            <label for="phone" class="form-label">Phone Number</label>
            <input
              v-model="forminput.phone"
              type="tel"
              name="phone"
              class="input-field"
              placeholder="Phone number"
            />
          </div>

          <!-- Role -->
          <div>
            <label for="role" class="form-label">Select Role</label>
            <select
              v-model="forminput.role_id"
              class="input-field"
              required
              placeholder="Select Role"
            >
              <option v-for="role in roles" :key="role.id" :value="role.id">
                {{ role.role_name }}
              </option>
            </select>
          </div>

          <!-- Submit Button -->
          <button type="submit" :disabled="isLoading" class="submit-btn">
            <span v-if="isLoading">Registering...</span>
            <span v-else>Register Now!</span>
          </button>
        </form>
      </section>
    </div>
  </main>
</template>

<style scoped>
/* General Input Field Styling */
.input-field {
  background-color: #f9fafb;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  outline: none;
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
}
.input-field:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
}
.input-field::placeholder {
  color: #9ca3af;
}

/* Label Styling */
.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #000000;
}
.dark .form-label {
  color: #e5e7eb;
}

/* Button Styling */
.submit-btn {
  width: 100%;
  background: linear-gradient(to right, #ef4444, #dc2626);
  color: #ffffff;
  font-weight: 600;
  text-align: center;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition:
    background 0.3s,
    transform 0.2s;
}
.submit-btn:hover {
  background: linear-gradient(to right, #dc2626, #b91c1c);
  transform: scale(1.03);
}
.submit-btn:disabled {
  background: #d1d5db;
  color: #9ca3af;
  cursor: not-allowed;
}
</style>
