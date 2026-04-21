import { babyWords, highContrastColors } from '../data/babyWords.js'

function randomPick(arr, count) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

export function generateQuestion() {
  const colors = randomPick(highContrastColors, 4)
  const words = randomPick(babyWords, 4)

  const items = words.map((word, i) => ({
    word,
    colorName: colors[i].name,
    colorValue: colors[i].value
  }))

  const correctIndex = Math.floor(Math.random() * 4)
  const answer = items[correctIndex]

  return {
    id: generateId(),
    createdAt: Date.now(),
    isMarked: false,
    question: `请选择「${answer.colorName}的${answer.word}」？`,
    answer: answer.colorName + '的' + answer.word,
    items,
    correctIndex,
    answered: false
  }
}

export function getApiKey() {
  return localStorage.getItem('minimax_api_key') || ''
}

export function saveApiKey(key) {
  localStorage.setItem('minimax_api_key', key.trim())
}
