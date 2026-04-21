import React, { useState, useCallback } from 'react'
import WelcomePage from './pages/WelcomePage.jsx'
import LoadingPage from './pages/LoadingPage.jsx'
import QuizPage from './pages/QuizPage.jsx'
import { generateQuestion, getApiKey, saveApiKey } from './utils/gameEngine.js'
import { saveQuestion, getRandomQuestion, getMarkedQuestions } from './utils/db.js'
import { generateGridImage } from './utils/api.js'

export default function App() {
  const [page, setPage] = useState('welcome')
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [loading, setLoading] = useState({ active: false, progress: 0, total: 1, tip: '' })
  const [mode, setMode] = useState(null)
  const [showApiKeyModal, setShowApiKeyModal] = useState(false)
  const [questionPool, setQuestionPool] = useState([])
  const [poolIndex, setPoolIndex] = useState(0)

  const startNewGame = useCallback(async (apiKey) => {
    if (!apiKey) {
      setShowApiKeyModal(true)
      return
    }
    saveApiKey(apiKey)
    setMode('new')

    const question = generateQuestion()
    setCurrentQuestion(question)
    setPage('loading')
    setLoading({ active: true, progress: 0, total: 1, tip: 'AI 正在生成四宫格图片...' })

    try {
      const gridImageBase64 = await generateGridImage(apiKey, question.items, (p, t, tip) => {
        setLoading({ active: true, progress: p, total: t, tip })
      })

      const finalQuestion = { ...question, gridImageBase64 }
      await saveQuestion(finalQuestion)
      setCurrentQuestion(finalQuestion)
      setLoading({ active: false })
      setPage('quiz')
    } catch (err) {
      console.error('生成失败:', err)
      alert('图片生成失败：' + err.message)
      setLoading({ active: false })
      setPage('welcome')
    }
  }, [])

  const handleNextQuestion = useCallback(async () => {
    if (mode === 'new') {
      await startNewGame(getApiKey())
    } else if (mode === 'review' || mode === 'marked') {
      if (poolIndex < questionPool.length - 1) {
        const nextIdx = poolIndex + 1
        setPoolIndex(nextIdx)
        setCurrentQuestion({ ...questionPool[nextIdx], answered: false })
        setPage('quiz')
      }
    }
  }, [mode, questionPool, poolIndex, startNewGame])

  const handleReview = useCallback(async () => {
    const all = []
    const total = await getQuestionCount()
    for (let i = 0; i < Math.min(total, 20); i++) {
      const q = await getRandomQuestion()
      if (q && !all.find(x => x.id === q.id)) all.push(q)
    }
    if (!all.length) {
      alert('暂无已保存的题目，请先"开始游戏"生成题目')
      return
    }
    setQuestionPool(all)
    setPoolIndex(0)
    setCurrentQuestion({ ...all[0], answered: false })
    setMode('review')
    setPage('quiz')
  }, [])

  const handleMarked = useCallback(async () => {
    const marked = await getMarkedQuestions()
    if (!marked.length) {
      alert('暂无标记的题目')
      return
    }
    setQuestionPool(marked)
    setPoolIndex(0)
    setCurrentQuestion({ ...marked[0], answered: false })
    setMode('marked')
    setPage('quiz')
  }, [])

  const handleExit = useCallback(() => {
    setCurrentQuestion(null)
    setMode(null)
    setQuestionPool([])
    setPoolIndex(0)
    setPage('welcome')
  }, [])

  const handleDelete = useCallback(async () => {
    if (!currentQuestion) return
    if (!confirm('确定删除此题？')) return
    await deleteQuestion(currentQuestion.id)
    if (poolIndex < questionPool.length - 1) {
      handleNextQuestion()
    } else {
      handleExit()
    }
  }, [currentQuestion, questionPool, poolIndex, handleNextQuestion, handleExit])

  const handleToggleMark = useCallback(async () => {
    if (!currentQuestion) return
    const updated = await toggleMarkQuestion(currentQuestion.id)
    setCurrentQuestion({ ...currentQuestion, isMarked: updated.isMarked })
  }, [currentQuestion])

  const handleAnswered = useCallback((correct) => {
    if (!currentQuestion) return
    if (correct) {
      setCurrentQuestion({ ...currentQuestion, answered: true })
    }
  }, [currentQuestion])

  const getNextLabel = () => {
    if (mode === 'new') return '下一题'
    if (poolIndex < questionPool.length - 1) return '下一题'
    return '已是最后一题'
  }

  if (page === 'welcome') {
    return (
      <WelcomePage
        onStartGame={() => setShowApiKeyModal(true)}
        onReview={handleReview}
        onMarked={handleMarked}
        showApiKeyModal={showApiKeyModal}
        onCloseApiKeyModal={() => setShowApiKeyModal(false)}
        onConfirmApiKey={(key) => { setShowApiKeyModal(false); startNewGame(key) }}
      />
    )
  }

  if (page === 'loading') {
    return <LoadingPage progress={loading.progress} total={loading.total} tip={loading.tip} />
  }

  if (page === 'quiz' && currentQuestion) {
    const isReviewMode = mode === 'review' || mode === 'marked'
    return (
      <QuizPage
        question={currentQuestion}
        onAnswered={handleAnswered}
        onExit={handleExit}
        onNext={currentQuestion.answered ? handleNextQuestion : null}
        onDelete={isReviewMode ? handleDelete : null}
        onToggleMark={isReviewMode ? handleToggleMark : null}
        nextLabel={getNextLabel()}
        isReviewMode={isReviewMode}
      />
    )
  }

  return null
}

async function getQuestionCount() {
  const { getAllQuestions } = await import('./utils/db.js')
  const all = await getAllQuestions()
  return all.length
}

async function deleteQuestion(id) {
  const { deleteQuestion: del } = await import('./utils/db.js')
  await del(id)
}

async function toggleMarkQuestion(id) {
  const { toggleMarkQuestion: toggle } = await import('./utils/db.js')
  return toggle(id)
}
