<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import WordPopup from './WordPopup.vue'

const router = useRouter()

const props = defineProps({
  currentUser: { type: Object, default: null }
})

const emit = defineEmits(['openLogin', 'openRegister', 'logout'])

// State
const currentStartLine = ref(0)
const pageSize = ref(10)
const totalLines = ref(0)
const currentData = ref([])
const showTranslation = ref(true)
const showNotes = ref(true)
const activeWord = ref(null)
const popupPosition = ref({ top: 0, left: 0 })
const jumpInput = ref(0)
const mobileMenuOpen = ref(false)
const userDropdownOpen = ref(false)

// Computed
const currentPage = computed(() => Math.floor(currentStartLine.value / pageSize.value) + 1)
const totalPages = computed(() => Math.ceil(totalLines.value / pageSize.value) || 1)
const canGoPrev = computed(() => currentStartLine.value > 0)
const canGoNext = computed(() => currentStartLine.value + pageSize.value < totalLines.value)
const currentChapter = computed(() => {
  if (currentData.value.length > 0 && currentData.value[0].chapter_id) {
    return currentData.value[0].chapter_id
  }
  return '-'
})

// Methods
function handleLogout() {
  emit('logout')
  userDropdownOpen.value = false
  router.push('/')
}

async function loadTotalLines() {
  try {
    const res = await fetch('/api/total')
    const data = await res.json()
    totalLines.value = data.total
  } catch (err) {
    console.error('Error loading total lines:', err)
  }
}

async function loadLines(start) {
  currentData.value = []

  try {
    const res = await fetch(`/api/lines?start=${start}&count=${pageSize.value}`)
    currentData.value = await res.json()
    await nextTick()
    attachWordClickHandlers()
  } catch (err) {
    console.error('Error loading lines:', err)
  }
}

function attachWordClickHandlers() {
  document.querySelectorAll('.vocab-word').forEach(el => {
    el.addEventListener('click', handleWordClick)
  })

  document.querySelectorAll('.dict-word').forEach(el => {
    el.addEventListener('click', handleWordClick)
  })
}

function handleWordClick(e) {
  e.stopPropagation()
  const word = e.target.dataset.word
  const isVocab = e.target.classList.contains('vocab-word')

  const lineContainer = e.target.closest('.line-container')
  const lineNum = lineContainer?.dataset.line || currentStartLine.value
  const chapterId = lineContainer?.dataset.chapter || null

  activeWord.value = {
    word,
    lineNumber: parseInt(lineNum, 10),
    chapterId,
    isVocab
  }

  const rect = e.target.getBoundingClientRect()
  popupPosition.value = {
    top: rect.bottom + 8,
    left: Math.max(10, rect.left - 200)
  }
}

function goPrev() {
  if (canGoPrev.value) {
    currentStartLine.value = Math.max(0, currentStartLine.value - pageSize.value)
    loadLines(currentStartLine.value)
    updateURL()
  }
}

function goNext() {
  if (canGoNext.value) {
    currentStartLine.value += pageSize.value
    loadLines(currentStartLine.value)
    updateURL()
  }
}

function jumpToLine() {
  const lineNum = parseInt(jumpInput.value, 10)
  if (!isNaN(lineNum) && lineNum >= 0 && lineNum < totalLines.value) {
    const page = Math.floor(lineNum / pageSize.value)
    currentStartLine.value = page * pageSize.value
    loadLines(currentStartLine.value)
    updateURL()
  }
}

function updateURL() {
  const url = new URL(window.location)
  url.searchParams.set('line', currentStartLine.value)
  window.history.pushState({}, '', url)
}

function loadFromURL() {
  const params = new URLSearchParams(window.location.search)
  const lineParam = params.get('line')
  if (lineParam) {
    const lineNum = parseInt(lineParam, 10)
    if (!isNaN(lineNum) && lineNum >= 0) {
      currentStartLine.value = Math.floor(lineNum / pageSize.value) * pageSize.value
      jumpInput.value = currentStartLine.value
    }
  }
}

function closePopup() {
  activeWord.value = null
}

function toggleTranslation() {
  showTranslation.value = !showTranslation.value
}

function toggleNotes() {
  showNotes.value = !showNotes.value
}

function parseTextIntoWords(text, vocabulary) {
  if (!text) return []

  const vocabSet = new Set((vocabulary || []).map(v => v.word.toLowerCase()))
  const words = []
  const regex = /(\b[\w']+\b)|(\s+)|(.)/g
  let match

  while ((match = regex.exec(text)) !== null) {
    if (match[1]) {
      const word = match[1]
      const isVocab = vocabSet.has(word.toLowerCase())
      words.push({ type: 'word', text: word, isVocab })
    } else if (match[2]) {
      words.push({ type: 'space', text: match[2] })
    } else if (match[3]) {
      words.push({ type: 'punct', text: match[3] })
    }
  }

  return words
}

onMounted(async () => {
  await loadTotalLines()
  loadFromURL()
  await loadLines(currentStartLine.value)
  jumpInput.value = currentStartLine.value

  document.addEventListener('click', closePopup)
  document.addEventListener('click', () => userDropdownOpen.value = false)
})
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <!-- Header -->
    <header class="bg-slate-800 text-white px-3 py-3 flex items-center justify-between sticky top-0 z-40 shadow-md">
      <!-- Left: Chapter info -->
      <div class="flex items-center gap-2 md:gap-4">
        <span class="text-xs md:text-sm font-medium truncate max-w-[120px] md:max-w-none">Chapter: {{ currentChapter }}</span>
      </div>

      <!-- Center: Navigation (hidden on mobile) -->
      <div class="hidden md:flex items-center gap-4">
        <button
          @click="goPrev"
          :disabled="!canGoPrev"
          class="px-3 py-1.5 bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm transition-colors"
        >
          ← Prev
        </button>
        <span class="text-sm min-w-[80px] text-center">{{ currentPage }} / {{ totalPages }}</span>
        <button
          @click="goNext"
          :disabled="!canGoNext"
          class="px-3 py-1.5 bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm transition-colors"
        >
          Next →
        </button>
      </div>

      <!-- Right: Settings and User -->
      <div class="flex items-center gap-2 md:gap-4">
        <!-- Translation toggle -->
        <label class="flex items-center gap-1 md:gap-2 text-xs md:text-sm cursor-pointer select-none" title="Translation">
          <input type="checkbox" :checked="showTranslation" @change="toggleTranslation" class="w-3 h-3 md:w-4 md:h-4">
          <span class="hidden sm:inline">Translation</span>
        </label>
        <!-- Notes toggle -->
        <label class="flex items-center gap-1 md:gap-2 text-xs md:text-sm cursor-pointer select-none" title="Notes">
          <input type="checkbox" :checked="showNotes" @change="toggleNotes" class="w-3 h-3 md:w-4 md:h-4">
          <span class="hidden sm:inline">Notes</span>
        </label>

        <!-- User Menu / Login Button -->
        <template v-if="props.currentUser">
          <div class="relative">
            <button @click.stop="userDropdownOpen = !userDropdownOpen" class="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 bg-blue-500 rounded hover:bg-blue-600 text-xs md:text-sm transition-colors">
              <span class="hidden xs:inline">{{ props.currentUser.username }}</span>
              <span v-if="props.currentUser.is_admin" class="px-1 py-0.5 bg-red-500 text-[10px] md:text-xs rounded font-bold">ADMIN</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            <!-- Dropdown menu -->
            <div v-if="userDropdownOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border z-50">
              <button @click.stop="router.push('/favorites')" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <span class="flex items-center gap-2">
                  <span>☆</span>
                  <span>My Favorites</span>
                </span>
              </button>
              <button v-if="props.currentUser?.is_admin" @click.stop="router.push('/admin/users')" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t">
                <span class="flex items-center gap-2">
                  <span>⚙️</span>
                  <span>User Management</span>
                </span>
              </button>
              <button @click.stop="handleLogout" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t">
                <span class="flex items-center gap-2">
                  <span>🚪</span>
                  <span>Logout</span>
                </span>
              </button>
            </div>
          </div>
        </template>
        <template v-else>
          <button @click="emit('openLogin')" class="px-2 md:px-3 py-1 md:py-1.5 bg-blue-500 rounded hover:bg-blue-600 text-xs md:text-sm transition-colors flex items-center gap-1">
            <span class="hidden xs:inline">Login</span>
            <span class="xs:hidden">👤</span>
          </button>
        </template>

        <!-- Mobile menu button -->
        <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden p-2 text-white">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'"/>
          </svg>
        </button>
      </div>
    </header>

    <!-- Mobile Menu -->
    <div v-if="mobileMenuOpen" class="md:hidden bg-slate-700 text-white p-4 space-y-4">
      <div class="flex items-center justify-center gap-4">
        <button
          @click="goPrev"
          :disabled="!canGoPrev"
          class="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm transition-colors"
        >
          ← Prev
        </button>
        <span class="text-sm min-w-[80px] text-center">{{ currentPage }} / {{ totalPages }}</span>
        <button
          @click="goNext"
          :disabled="!canGoNext"
          class="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm transition-colors"
        >
          Next →
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <main class="flex-1 max-w-4xl mx-auto p-2 md:p-4 w-full">
      <div v-if="currentData.length === 0" class="text-center py-10 text-gray-500">
        Loading...
      </div>

      <div
        v-for="line in currentData"
        :key="line.line_number"
        :data-line="line.line_number"
        :data-chapter="line.chapter_id"
        class="line-container mb-3 md:mb-4 bg-white rounded-lg shadow overflow-hidden"
      >
        <div class="px-3 md:px-4 py-2 md:py-3 bg-gray-50 border-b flex justify-between items-center">
          <span class="text-[10px] md:text-xs text-gray-500 truncate">
            Line {{ line.line_number }}
            <span v-if="line.chapter_id">| {{ line.chapter_id }}</span>
          </span>
        </div>

        <!-- Original Text -->
        <div class="px-3 md:px-4 py-3 md:py-4 bg-gray-50/50">
          <div class="text-base md:text-lg leading-relaxed break-words">
            <template v-for="(segment, i) in parseTextIntoWords(line.original, line.vocabulary)" :key="i">
              <mark
                v-if="segment.type === 'word' && segment.isVocab"
                :data-word="segment.text"
                class="vocab-word cursor-pointer bg-yellow-100 border-b-2 border-yellow-400 px-0.5 rounded hover:bg-yellow-200"
              >{{ segment.text }}</mark>
              <span
                v-else-if="segment.type === 'word'"
                :data-word="segment.text"
                class="dict-word cursor-pointer hover:bg-blue-50 rounded"
              >{{ segment.text }}</span>
              <span v-else>{{ segment.text }}</span>
            </template>
            <button class="ml-2 text-gray-400 hover:text-gray-600" title="Read aloud">🔊</button>
          </div>
        </div>

        <!-- Translation -->
        <div v-if="showTranslation && line.translation" class="px-3 md:px-4 py-3 border-t">
          <div class="text-gray-600 text-sm md:text-lg">{{ line.translation }}</div>
        </div>

        <!-- Notes -->
        <div v-if="showNotes && line.notes" class="px-3 md:px-4 py-3 border-t bg-yellow-50">
          <div class="text-xs md:text-sm text-gray-600">{{ line.notes }}</div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-slate-800 text-white px-3 py-3 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 mt-auto">
      <label class="flex items-center gap-2 text-xs md:text-sm">
        Lines per page:
        <select v-model="pageSize" @change="loadLines(currentStartLine)" class="px-2 py-1 rounded text-gray-800 text-xs md:text-sm">
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
        </select>
      </label>
      <div class="flex items-center gap-2">
        <span class="text-xs md:text-sm">Jump:</span>
        <input
          v-model="jumpInput"
          @keydown.enter="jumpToLine"
          type="number"
          min="0"
          class="w-20 px-2 py-1 rounded text-gray-800 text-xs md:text-sm"
        >
        <button @click="jumpToLine" class="px-3 py-1 bg-blue-500 rounded hover:bg-blue-600 text-xs md:text-sm transition-colors">
          Go
        </button>
      </div>
    </footer>

    <!-- Word Popup -->
    <WordPopup
      v-if="activeWord"
      :word="activeWord.word"
      :line-number="activeWord.lineNumber"
      :chapter-id="activeWord.chapterId"
      :is-vocab="activeWord.isVocab"
      :position="popupPosition"
      :current-user="props.currentUser"
      @close="closePopup"
      @open-login="emit('openLogin')"
    />
  </div>
</template>

<style scoped>
.vocab-word {
  background-color: #fff3b0;
  border-bottom: 2px solid #ffc107;
  padding: 2px 4px;
  border-radius: 2px;
  transition: background-color 0.2s;
}

.vocab-word:hover {
  background-color: #ffe57f;
}
</style>
