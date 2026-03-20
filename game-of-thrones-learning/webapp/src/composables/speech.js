import { ref } from 'vue'

const currentUtterance = ref(null)
const currentSpeakerBtn = ref(null)
const isSpeaking = ref(false)

export function useSpeech() {
  function speakText(text, btnElement) {
    // Cancel current speech
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
    }
    // Clear previous callbacks to prevent race conditions
    if (currentUtterance.value) {
      currentUtterance.value.onend = null
      currentUtterance.value.onerror = null
    }

    if (currentSpeakerBtn.value) {
      currentSpeakerBtn.value.classList.remove('speaking')
    }

    if (!('speechSynthesis' in window)) {
      console.error('Speech synthesis not supported')
      return
    }

    currentUtterance.value = new SpeechSynthesisUtterance(text)
    currentSpeakerBtn.value = btnElement

    currentUtterance.value.lang = 'en-US'
    currentUtterance.value.rate = 0.9

    if (btnElement) {
      btnElement.classList.add('speaking')
    }
    isSpeaking.value = true

    currentUtterance.value.onend = () => {
      if (currentSpeakerBtn.value) {
        currentSpeakerBtn.value.classList.remove('speaking')
      }
      isSpeaking.value = false
      currentUtterance.value = null
      currentSpeakerBtn.value = null
    }

    currentUtterance.value.onerror = () => {
      if (currentSpeakerBtn.value) {
        currentSpeakerBtn.value.classList.remove('speaking')
      }
      isSpeaking.value = false
      currentUtterance.value = null
      currentSpeakerBtn.value = null
    }

    speechSynthesis.speak(currentUtterance.value)
  }

  function stopSpeaking() {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
    }
    // Clear callbacks to prevent race conditions
    if (currentUtterance.value) {
      currentUtterance.value.onend = null
      currentUtterance.value.onerror = null
    }
    if (currentSpeakerBtn.value) {
      currentSpeakerBtn.value.classList.remove('speaking')
    }
    isSpeaking.value = false
    currentUtterance.value = null
    currentSpeakerBtn.value = null
  }

  return {
    isSpeaking,
    speakText,
    stopSpeaking
  }
}
