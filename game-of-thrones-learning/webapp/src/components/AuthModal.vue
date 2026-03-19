<script setup>
import { ref, watch } from 'vue'
import Auth from '../composables/auth'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  mode: { type: String, default: 'login' }
})

const emit = defineEmits(['update:modelValue', 'authenticated'])

const auth = new Auth()

// Form state
const loginForm = ref({ username: '', password: '' })
const registerForm = ref({ username: '', password: '', passwordHint: '' })
const error = ref('')
const loading = ref(false)
const currentMode = ref(props.mode)

// Watch for mode changes
watch(() => props.mode, (newMode) => {
  currentMode.value = newMode
})

// Watch for modal open/close
watch(() => props.modelValue, (newVal) => {
  if (!newVal) {
    // Modal closed, reset forms
    resetForms()
  }
})

function resetForms() {
  loginForm.value.username = ''
  loginForm.value.password = ''
  registerForm.value.username = ''
  registerForm.value.password = ''
  registerForm.value.passwordHint = ''
  error.value = ''
  loading.value = false
}

function switchMode() {
  error.value = ''
  currentMode.value = currentMode.value === 'login' ? 'register' : 'login'
}

async function handleLogin() {
  error.value = ''
  loading.value = true

  const result = await auth.login(loginForm.value.username, loginForm.value.password)

  loading.value = false
  if (result.success) {
    emit('authenticated', result.user)
    emit('update:modelValue', false)
    resetForms()
  } else {
    error.value = result.error
  }
}

async function handleRegister() {
  error.value = ''
  loading.value = true

  const result = await auth.register(
    registerForm.value.username,
    registerForm.value.password,
    registerForm.value.passwordHint
  )

  loading.value = false
  if (result.success) {
    emit('authenticated', result.user)
    emit('update:modelValue', false)
    resetForms()
  } else {
    error.value = result.error
  }
}

function closeModal() {
  emit('update:modelValue', false)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        @click.self="closeModal"
      >
        <div class="bg-white rounded-xl p-6 md:p-8 w-full max-w-md relative shadow-2xl animate-scale-in">
          <!-- Close button -->
          <button
            @click="closeModal"
            class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>

          <!-- Login Form -->
          <form v-if="currentMode === 'login'" @submit.prevent="handleLogin">
            <h2 class="text-2xl font-semibold text-slate-800 mb-6 text-center">Login</h2>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                v-model="loginForm.username"
                type="text"
                required
                minlength="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                autocomplete="username"
              >
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                v-model="loginForm.password"
                type="password"
                required
                minlength="6"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                autocomplete="current-password"
              >
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {{ loading ? 'Logging in...' : 'Login' }}
            </button>

            <p class="mt-4 text-center text-sm text-gray-600">
              Don't have an account?
              <button type="button" @click="switchMode" class="text-blue-500 hover:underline font-medium">
                Register
              </button>
            </p>
          </form>

          <!-- Register Form -->
          <form v-else @submit.prevent="handleRegister">
            <h2 class="text-2xl font-semibold text-slate-800 mb-6 text-center">Register</h2>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                v-model="registerForm.username"
                type="text"
                required
                minlength="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                autocomplete="username"
              >
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                v-model="registerForm.password"
                type="password"
                required
                minlength="6"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                autocomplete="new-password"
              >
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Password Hint (optional)</label>
              <input
                v-model="registerForm.passwordHint"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              >
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {{ loading ? 'Registering...' : 'Register' }}
            </button>

            <p class="mt-4 text-center text-sm text-gray-600">
              Already have an account?
              <button type="button" @click="switchMode" class="text-blue-500 hover:underline font-medium">
                Login
              </button>
            </p>
          </form>

          <!-- Error Message -->
          <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {{ error }}
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.95);
}

.animate-scale-in {
  animation: scaleIn 0.2s ease-out;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
