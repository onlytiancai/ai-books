<script setup>
import { ref, onMounted } from 'vue'
import AuthModal from './components/AuthModal.vue'
import Auth from './composables/auth'

const auth = new Auth()
const showAuthModal = ref(false)
const authModalMode = ref('login')
const currentUser = ref(null)

function openLoginModal() {
  authModalMode.value = 'login'
  showAuthModal.value = true
}

function openRegisterModal() {
  authModalMode.value = 'register'
  showAuthModal.value = true
}

async function handleAuthenticated(user) {
  currentUser.value = user
}

async function handleLogout() {
  await auth.logout()
  currentUser.value = null
}

onMounted(async () => {
  await auth.init()
  currentUser.value = auth.currentUser
})
</script>

<template>
  <RouterView :current-user="currentUser" @open-login="openLoginModal" @open-register="openRegisterModal" @logout="handleLogout" />
  <AuthModal
    v-model="showAuthModal"
    :mode="authModalMode"
    @authenticated="handleAuthenticated"
  />
</template>
