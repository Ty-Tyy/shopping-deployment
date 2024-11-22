<script setup>
import { onMounted, ref, inject } from 'vue'
import { useToast } from 'vue-toastification'
import axios from 'axios'
import Dialog from 'primevue/dialog'
/**
 *
 */
const apiUrl = import.meta.env.VITE_API_URL
const $cookies = inject('$cookies')
const user_id = $cookies.get('profile')
const toast = useToast()
const userData = ref()
const deleteDialog = ref(false)
const selectedUserID = ref(null)
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
const fetchUser = async () => {
  const response = await axios.get(`${apiUrl}/getuser`)
  userData.value = response.data
}
/**
 *
 */
const handleDeleteUser = (id) => {
  selectedUserID.value = id
  deleteDialog.value = true
}
/**
 *
 */
const deleteUser = async () => {
  const token = getCookie('api_key')
  if (selectedUserID.value) {
    // Ensure both client ID and user IDs are available
    try {
      await axios.delete(`${apiUrl}/deleteuser/${selectedUserID.value}/${user_id.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      toast.success('User deleted successfully')
      deleteDialog.value = false
      await fetchUser()
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Error deleting user')
    }
  } else {
    console.error('No client ID or user ID found for deletion')
    toast.error('No client ID or user ID found for deletion')
  }
}
/**
 *
 */
onMounted(async () => {
  await fetchUser()
})
</script>

<template>
  <main>
    <AdminHeader />

    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div
        class="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 p-4 bg-white dark:bg-red-600"
      >
        <label for="table-search" class="sr-only">Search</label>
        <div class="relative">
          <div
            class="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none"
          >
            <svg
              class="w-4 h-4 text-red-400 dark:text-red-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="text"
            id="table-search-users"
            class="block p-2 ps-10 text-sm text-red-600 border border-red-300 rounded-lg w-80 bg-red-50 focus:ring-blue-200 focus:border-blue-200 dark:bg-red-600 dark:border-red-600 dark:placeholder-red-300 dark:text-white dark:focus:ring-blue-200 dark:focus:border-blue-200"
            placeholder="Search for users"
          />
        </div>
      </div>

      <div>
        <table class="w-full text-sm text-left rtl:text-right text-red-300 dark:text-red-300">
          <thead
            class="text-xs text-red-600 uppercase bg-red-200 dark:bg-red-500 dark:text-red-400"
          >
            <tr>
              <th scope="col" class="p-4">
                <div class="flex items-center">
                  <input
                    id="checkbox-all-search"
                    type="checkbox"
                    class="w-4 h-4 text-blue-600 bg-red-100 border-red-300 rounded focus:ring-blue-200 dark:focus:ring-blue-600 dark:ring-offset-red-500 dark:focus:ring-offset-red-500 focus:ring-2 dark:bg-red-700 dark:border-red-600"
                  />
                  <label for="checkbox-all-search" class="sr-only">checkbox</label>
                </div>
              </th>
              <th scope="col" class="px-6 py-3">Username</th>
              <th scope="col" class="px-6 py-3">Role</th>
              <!-- <th scope="col" class="px-6 py-3">Status</th> -->
              <th scope="col" class="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody v-for="user in userData" :key="user.id">
            <tr
              class="bg-white border-b dark:bg-red-500 dark:border-red-500 hover:bg-red-100 dark:hover:bg-red-600"
            >
              <td class="w-4 p-4">
                <div class="flex items-center">
                  <input
                    id="checkbox-table-search-1"
                    type="checkbox"
                    class="w-4 h-4 text-blue-600 bg-red-100 border-red-300 rounded focus:ring-blue-200 dark:focus:ring-blue-600 dark:ring-offset-red-800 dark:focus:ring-offset-red-800 focus:ring-2 dark:bg-red-400 dark:border-red-400"
                  />
                  <label for="checkbox-table-search-1" class="sr-only">checkbox</label>
                </div>
              </td>
              <th
                scope="row"
                class="flex items-center px-6 py-4 text-red-500 whitespace-nowrap dark:text-white"
              >
                <div class="ps-3">
                  <div class="text-base font-semibold">{{ user.username }}</div>
                  <div class="font-normal text-red-200">{{ user.email }}</div>
                </div>
              </th>
              <td class="px-6 py-4">{{ user.role?.role_name }}</td>
              <!-- <td class="px-6 py-4">
              <div class="flex items-center">
                <div class="h-2.5 w-2.5 rounded-full bg-red-200 me-2"></div>
                Online
              </div>
            </td> -->
              <td class="px-6 py-4">
                <!-- <a class="font-medium text-blue-600 dark:text-blue-200 hover:underline"
                  >Coming Soon</a
                > -->
                <button
                  type="button"
                  @click="handleDeleteUser(user.id)"
                  class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                >
                  Delete
                </button>
              </td>
            </tr>

            <!-- Delete User Dialog -->
            <Dialog
              v-model:visible="deleteDialog"
              modal
              header="Deleting User"
              :style="{ width: '32rem', borderRadius: '1rem', padding: '1rem' }"
              @keydown.escape="deleteDialog = false"
              class="text-center shadow-lg"
            >
              <div class="my-6 text-gray-600">
                <p class="text-lg font-medium">Are you sure you want to delete this user?</p>
                <p class="text-sm text-gray-500 mt-2">
                  This action is irreversible. The user's data will be permanently removed.
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
                  @click="deleteUser(selectedUserID.value)"
                />
              </div>
            </Dialog>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>
