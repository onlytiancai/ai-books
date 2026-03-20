<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Auth from '../composables/auth'
import { useSpeech } from '../composables/speech'

const router = useRouter()
const auth = new Auth()
const { speakText, stopSpeaking, isSpeaking } = useSpeech()

const favorites = ref([])
const loading = ref(true)
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)
const pageSize = ref(20)
const showTranslation = ref(false)
const expandedWord = ref(null)

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
  // Preserve reading position - get current line from localStorage if available
  const savedLine = localStorage.getItem('got-reader-current-line')
  if (savedLine) {
    router.push({ path: '/', query: { line: savedLine } })
  } else {
    router.push('/')
  }
}

function toggleTranslation() {
  showTranslation.value = !showTranslation.value
  if (showTranslation.value) {
    expandedWord.value = null
  }
}

function toggleWordExpansion(word) {
  if (expandedWord.value === word) {
    expandedWord.value = null
  } else {
    expandedWord.value = word
  }
}

function playAudio(word, type = 'us') {
  // Use Youdao audio for word pronunciation (more accurate for single words)
  const audio = new Audio(`https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(word)}&type=${type === 'us' ? 1 : 2}`)
  audio.play().catch(err => console.error('Audio play error:', err))
}

function playSentenceAudio(sentence) {
  // Use speech synthesis for sentence pronunciation
  speakText(sentence, null)
}

async function deleteFavorite(id) {
  if (!confirm('Are you sure you want to delete this favorite?')) {
    return
  }

  try {
    const res = await fetch(`/api/favorites/${id}`, { method: 'DELETE' })
    if (res.ok) {
      favorites.value = favorites.value.filter(f => f.id !== id)
      totalItems.value--
    } else {
      console.error('Failed to delete favorite')
    }
  } catch (err) {
    console.error('Delete favorite error:', err)
  }
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
        <button
          v-if="isSpeaking"
          @click="stopSpeaking"
          class="flex items-center gap-1 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors animate-pulse"
        >
          <span>🔇</span>
          <span>Stop</span>
        </button>
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
        <!-- Controls -->
        <div class="mb-4 flex items-center justify-between">
          <div class="text-sm text-gray-600">
            Showing {{ favorites.length }} of {{ totalItems }} favorites
          </div>
          <button
            @click="toggleTranslation"
            class="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
          >
            {{ showTranslation ? 'Hide All Translations' : 'Show All Translations' }}
          </button>
        </div>

        <!-- Favorites List -->
        <div class="space-y-3">
          <div
            v-for="fav in favorites"
            :key="fav.id"
            class="bg-white rounded-lg shadow p-4"
          >
            <!-- Word Header -->
            <div class="flex items-center gap-2 mb-2">
              <span class="text-lg font-semibold text-slate-800">{{ fav.word }}</span>
              <span v-if="fav.phonetic && fav.phonetic.trim()" class="text-sm text-gray-500">/{{ fav.phonetic }}/</span>
              <span v-if="fav.pos && fav.pos.trim()" class="text-xs text-gray-400 italic">{{ fav.pos }}</span>
              <span v-if="fav.chapter_id" class="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                Chapter {{ fav.chapter_id }}
              </span>
            </div>
            <!-- Audio Buttons -->
            <div class="flex gap-2 mb-2">
              <button @click="playAudio(fav.word, 'us')" class="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm">
                <span>🔊</span>
                <span>US</span>
              </button>
              <button @click="playAudio(fav.word, 'uk')" class="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm">
                <span>🔊</span>
                <span>UK</span>
              </button>
            </div>

            <!-- Sentence -->
            <div v-if="fav.sentence && fav.sentence.trim()" class="mb-2 p-3 bg-gray-50 rounded text-gray-700 text-sm flex items-start justify-between gap-2">
              <span class="flex-1">{{ fav.sentence }}</span>
              <button @click="playSentenceAudio(fav.sentence)" class="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600" title="Read sentence aloud">
                <span>🔊</span>
              </button>
            </div>
            <div v-else class="mb-2 p-3 bg-gray-50 rounded text-gray-400 text-sm italic">
              No sentence context
            </div>

            <!-- Translation -->
            <div
              v-if="fav.translation && fav.translation.trim()"
              class="cursor-pointer"
              @click="toggleWordExpansion(fav.word)"
            >
              <div
                v-if="showTranslation || expandedWord === fav.word"
                class="text-sm text-gray-600 border-t pt-2 mt-2"
              >
                {{ fav.translation }}
              </div>
              <div
                v-else
                class="text-sm text-gray-400 border-t pt-2 mt-2 italic"
              >
                Click to show translation
              </div>
            </div>

            <!-- Actions -->
            <div class="mt-3 flex justify-end">
              <button
                @click="deleteFavorite(fav.id)"
                class="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                Delete
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
