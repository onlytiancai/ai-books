<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Auth from '../../composables/auth'

const router = useRouter()
const auth = new Auth()

const users = ref([])
const loading = ref(true)
const error = ref('')
const resetForm = ref({ userId: null, password: '', passwordHint: '' })
const showResetModal = ref(false)

async function loadUsers() {
  loading.value = true
  try {
    const res = await fetch('/api/users')
    if (res.ok) {
      const data = await res.json()
      users.value = data.users || []
    } else if (res.status === 403) {
      error.value = 'Access denied. Admin privileges required.'
      router.push('/')
    }
  } catch (err) {
    error.value = 'Failed to load users'
    console.error(err)
  }
  loading.value = false
}

function openResetModal(user) {
  resetForm.value = { userId: user.id, password: '', passwordHint: '' }
  showResetModal.value = true
}

async function resetPassword() {
  if (resetForm.value.password.length < 6) {
    error.value = 'Password must be at least 6 characters'
    return
  }

  try {
    const res = await fetch(`/api/users/${resetForm.value.userId}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        password: resetForm.value.password,
        passwordHint: resetForm.value.passwordHint
      })
    })

    if (res.ok) {
      showResetModal.value = false
      alert('Password reset successfully')
    } else {
      const data = await res.json()
      error.value = data.error || 'Failed to reset password'
    }
  } catch (err) {
    error.value = 'Failed to reset password'
    console.error(err)
  }
}

async function deleteUser(userId, username) {
  if (!confirm(`Are you sure you want to delete user "${username}"?`)) {
    return
  }

  try {
    const res = await fetch(`/api/users/${userId}`, { method: 'DELETE' })
    if (res.ok) {
      users.value = users.value.filter(u => u.id !== userId)
    } else {
      const data = await res.json()
      error.value = data.error || 'Failed to delete user'
    }
  } catch (err) {
    error.value = 'Failed to delete user'
    console.error(err)
  }
}

onMounted(async () => {
  await auth.init()
  if (!auth.currentUser || !auth.currentUser.is_admin) {
    router.push('/')
    return
  }
  loadUsers()
})
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <!-- Header -->
    <header class="bg-slate-800 text-white px-4 py-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
      <div class="flex items-center gap-4">
        <button @click="router.push('/')" class="text-lg font-medium hover:text-blue-200 transition-colors">
          ← Back to Reader
        </button>
        <h1 class="text-xl font-semibold">User Management</h1>
      </div>
      <div v-if="auth.currentUser" class="flex items-center gap-2">
        <span class="text-sm">{{ auth.currentUser.username }}</span>
        <span v-if="auth.currentUser.is_admin" class="px-2 py-0.5 bg-red-500 text-xs rounded font-bold">ADMIN</span>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 max-w-4xl mx-auto p-4 w-full">
      <div v-if="loading" class="text-center py-10 text-gray-500">
        Loading users...
      </div>

      <div v-else-if="error" class="text-center py-10 text-red-600">
        {{ error }}
      </div>

      <div v-else-if="users.length === 0" class="text-center py-10">
        <p class="text-gray-500">No users found</p>
      </div>

      <div v-else class="space-y-4">
        <!-- Users Table -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Password Hint</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in users" :key="user.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ user.username }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span v-if="user.is_admin" class="px-2 py-1 bg-red-100 text-red-800 text-xs rounded font-medium">Admin</span>
                  <span v-else class="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">User</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.password_hint || '-' }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ new Date(user.created_at).toLocaleDateString() }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button @click="openResetModal(user)" class="text-blue-600 hover:text-blue-900 mr-3">Reset Password</button>
                  <button
                    v-if="user.id !== auth.currentUser?.id"
                    @click="deleteUser(user.id, user.username)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- Reset Password Modal -->
    <div v-if="showResetModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-semibold mb-4">Reset Password</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              v-model="resetForm.password"
              type="password"
              minlength="6"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password Hint (optional)</label>
            <input
              v-model="resetForm.passwordHint"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
          </div>
          <div class="flex gap-2 pt-4">
            <button @click="showResetModal = false" class="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">Cancel</button>
            <button @click="resetPassword" class="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Reset Password</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
