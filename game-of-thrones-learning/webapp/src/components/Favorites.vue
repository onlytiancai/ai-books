<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Auth from '../composables/auth'

const router = useRouter()
const auth = new Auth()

const favorites = ref([])
const loading = ref(true)
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)
const pageSize = ref(20)

async function loadFavorites(page = 1) {
  loading.value = true
  try {
    const res = await fetch(`/api/favorites?page=${page}&pageSize=${pageSize.value}`)
    if (res.ok) {
      const data = await res.json()
      favorites.value = data.favorites
      currentPage.value = data.page
      totalPages.value = data.totalPages
      totalItems.value = data.total
    }
  } catch (err) {
    console.error('Error loading favorites:', err)
  }
  loading.value = false
}

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    loadFavorites(page)
  }
}

function goBack() {
  router.push('/')
}

function viewContext(lineNumber) {
  router.push({ query: { line: Math.max(0, lineNumber - 5) } })
}

onMounted(async () => {
  await auth.init()
  if (!auth.currentUser) {
    router.push('/')
    return
  }
  loadFavorites()
})
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <!-- Header -->
    <header class="bg-slate-800 text-white px-4 py-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
      <div class="flex items-center gap-4">
        <button @click="goBack" class="text-lg font-medium hover:text-blue-200 transition-colors">
          ← Back to Reader
        </button>
        <h1 class="text-xl font-semibold">My Favorites</h1>
      </div>
      <div v-if="auth.currentUser" class="flex items-center gap-2">
        <span class="text-sm">{{ auth.currentUser.username }}</span>
        <span v-if="auth.currentUser.is_admin" class="px-2 py-0.5 bg-red-500 text-xs rounded font-bold">ADMIN</span>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 max-w-4xl mx-auto p-4 w-full">
      <div v-if="loading" class="text-center py-10 text-gray-500">
        Loading favorites...
      </div>

      <div v-else-if="favorites.length === 0" class="text-center py-10">
        <div class="text-6xl mb-4">☆</div>
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">No favorites yet</h2>
        <p class="text-gray-500 mb-4">Click on highlighted words while reading to add them to your favorites.</p>
        <button @click="router.push('/')" class="inline-block px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          Start Reading
        </button>
      </div>

      <div v-else>
        <!-- Stats -->
        <div class="mb-4 text-sm text-gray-600">
          Showing {{ favorites.length }} of {{ totalItems }} favorites
        </div>

        <!-- Favorites List -->
        <div class="space-y-3">
          <div
            v-for="fav in favorites"
            :key="fav.id"
            class="bg-white rounded-lg shadow p-4 flex items-center justify-between"
          >
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-lg font-semibold text-slate-800">{{ fav.word }}</span>
                <span v-if="fav.chapter_id" class="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  Chapter {{ fav.chapter_id }}
                </span>
              </div>
              <div class="text-sm text-gray-500">
                Line {{ fav.line_number }}
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="viewContext(fav.line_number)"
                class="px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
              >
                View Context
              </button>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="mt-6 flex items-center justify-center gap-2">
          <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage <= 1"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            ← Prev
          </button>
          <span class="text-sm text-gray-600">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          <button
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage >= totalPages"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>
      </div>
    </main>
  </div>
</template>
