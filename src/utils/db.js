const DB_NAME = 'ai-card-db'
const DB_VERSION = 1
const STORE_NAME = 'questions'

let dbInstance = null

function openDB() {
  if (dbInstance) return Promise.resolve(dbInstance)

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        store.createIndex('createdAt', 'createdAt', { unique: false })
        store.createIndex('isMarked', 'isMarked', { unique: false })
      }
    }

    request.onsuccess = (event) => {
      dbInstance = event.target.result
      resolve(dbInstance)
    }

    request.onerror = (event) => {
      reject(event.target.error)
    }
  })
}

export async function saveQuestion(question) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const request = store.put(question)
    request.onsuccess = () => resolve(question)
    request.onerror = (e) => reject(e.target.error)
  })
}

export async function getAllQuestions() {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const request = store.getAll()
    request.onsuccess = () => resolve(request.result)
    request.onerror = (e) => reject(e.target.error)
  })
}

export async function getRandomQuestion() {
  const all = await getAllQuestions()
  if (!all.length) return null
  return all[Math.floor(Math.random() * all.length)]
}

export async function getMarkedQuestions() {
  const all = await getAllQuestions()
  return all.filter(q => q.isMarked)
}

export async function deleteQuestion(id) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const request = store.delete(id)
    request.onsuccess = () => resolve()
    request.onerror = (e) => reject(e.target.error)
  })
}

export async function toggleMarkQuestion(id) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const getReq = store.get(id)
    getReq.onsuccess = () => {
      const question = getReq.result
      if (!question) return reject(new Error('Question not found'))
      question.isMarked = !question.isMarked
      const putReq = store.put(question)
      putReq.onsuccess = () => resolve(question)
      putReq.onerror = (e) => reject(e.target.error)
    }
    getReq.onerror = (e) => reject(e.target.error)
  })
}

export async function getQuestionCount() {
  const all = await getAllQuestions()
  return all.length
}
