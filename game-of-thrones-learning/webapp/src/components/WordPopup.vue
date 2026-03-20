<script setup>
import { ref, computed, onMounted } from 'vue'
import Auth from '../composables/auth'

const props = defineProps({
  word: { type: String, required: true },
  lineNumber: { type: Number, required: true },
  chapterId: { type: String, default: null },
  isVocab: { type: Boolean, default: false },
  vocabData: { type: Object, default: null },
  sentence: { type: String, default: null },
  position: { type: Object, default: () => ({ top: 0, left: 0 }) },
  currentUser: { type: Object, default: null }
})

const emit = defineEmits(['close', 'openLogin'])

const auth = new Auth()
const dictData = ref(null)
const loading = ref(true)
const isFavorite = ref(false)
const favoriteId = ref(null)

const popupStyle = computed(() => ({
  top: `${props.position.top}px`,
  left: `${props.position.left}px`
}))

async function loadDictionary() {
  loading.value = true
  try {
    const res = await fetch(`/api/dictionary/lookup?word=${encodeURIComponent(props.word)}`)
    if (res.ok) {
      dictData.value = await res.json()
    }
  } catch (err) {
    console.error('Dictionary lookup error:', err)
  }
  loading.value = false
}

async function checkFavorite() {
  if (!props.currentUser) return

  try {
    const res = await fetch(`/api/favorites/check/${encodeURIComponent(props.word)}/${props.lineNumber}`)
    if (res.ok) {
      const data = await res.json()
      isFavorite.value = data.isFavorite
      favoriteId.value = data.favorite?.id
    }
  } catch (err) {
    console.error('Check favorite error:', err)
  }
}

async function toggleFavorite() {
  if (!props.currentUser) {
    emit('openLogin')
    return
  }

  if (isFavorite.value) {
    // Remove favorite
    if (favoriteId.value) {
      try {
        const res = await fetch(`/api/favorites/${favoriteId.value}`, { method: 'DELETE' })
        if (res.ok) {
          isFavorite.value = false
          favoriteId.value = null
        }
      } catch (err) {
        console.error('Remove favorite error:', err)
      }
    }
  } else {
    // Add favorite
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: props.word,
          lineNumber: props.lineNumber,
          chapterId: props.chapterId,
          sentence: props.sentence
        })
      })
      if (res.ok) {
        isFavorite.value = true
        const data = await res.json()
        favoriteId.value = data.favorite?.id
      }
    } catch (err) {
      console.error('Add favorite error:', err)
    }
  }
}

function playAudio(type) {
  const audio = new Audio(`https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(props.word)}&type=${type === 'us' ? 1 : 2}`)
  audio.play().catch(err => console.error('Audio play error:', err))
}

onMounted(async () => {
  await loadDictionary()
  await checkFavorite()
})
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed z-50 bg-white rounded-lg shadow-xl border min-w-[280px] max-w-[360px] p-4 animate-fade-in"
      :style="popupStyle"
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-center gap-2 mb-2 relative">
        <span class="text-lg font-semibold text-slate-800">{{ word }}</span>
        <span v-if="dictData?.phonetic" class="text-sm text-gray-500">{{ dictData.phonetic }}</span>
        <button @click="$emit('close')" class="absolute right-0 text-gray-400 hover:text-gray-600 text-xl">×</button>
      </div>

      <!-- Audio Buttons -->
      <div class="flex gap-2 mb-2">
        <button @click="playAudio('us')" class="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm">
          <span>🔊</span>
          <span>US</span>
        </button>
        <button @click="playAudio('uk')" class="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm">
          <span>🔊</span>
          <span>UK</span>
        </button>
      </div>

      <!-- Part of Speech -->
      <div v-if="dictData?.pos" class="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs mb-2">
        {{ dictData.pos }}
      </div>

      <!-- Translations -->
      <div v-if="dictData?.translation" class="mb-2">
        <div v-for="(line, i) in dictData.translation.split('\n').filter(l => l.trim())" :key="i" class="text-sm text-gray-700">
          {{ line }}
        </div>
      </div>

      <!-- Definitions -->
      <div v-if="dictData?.definition" class="mb-2 pt-2 border-t">
        <div v-for="(line, i) in dictData.definition.split('\n').filter(l => l.trim())" :key="i" class="text-xs text-gray-500">
          {{ line }}
        </div>
      </div>

      <!-- Word Meta -->
      <div v-if="dictData" class="flex items-center gap-2 pt-2 border-t text-xs">
        <span v-if="dictData.collins" class="text-amber-500">{{ '★'.repeat(Math.min(dictData.collins, 5)) }}</span>
        <span v-if="dictData.oxford" class="px-1 py-0.5 bg-purple-500 text-white rounded text-[10px]">OXFORD</span>
        <span v-if="dictData.tag" class="px-1 py-0.5 bg-gray-100 rounded text-gray-500">{{ dictData.tag }}</span>
      </div>

      <!-- Favorite Button -->
      <button
        v-if="props.currentUser"
        @click="toggleFavorite"
        class="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 rounded border transition-colors"
        :class="isFavorite ? 'bg-amber-50 border-amber-300' : 'bg-gray-50 border-gray-300 hover:bg-blue-50 hover:border-blue-300'"
      >
        <span :class="isFavorite ? 'text-amber-500' : 'text-gray-400'" class="text-lg">
          {{ isFavorite ? '★' : '☆' }}
        </span>
        <span class="text-sm font-medium">{{ isFavorite ? 'Remove from favorites' : 'Add to favorites' }}</span>
      </button>
      <button
        v-else
        @click="emit('openLogin')"
        class="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        <span class="text-lg">☆</span>
        <span class="text-sm font-medium">Login to add to favorites</span>
      </button>
    </div>
  </Teleport>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.15s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
