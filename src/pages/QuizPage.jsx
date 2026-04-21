import React, { useState, useCallback, useEffect } from 'react'
import GridImage from '../components/GridImage.jsx'
import ButtonBar from '../components/ButtonBar.jsx'
import FeedbackModal from '../components/FeedbackModal.jsx'

function renderQuestion(raw) {
  const match = raw.match(/^(.*「)(.*)(」.*)$/)
  if (!match) return <span className="question-text">{raw}</span>
  return (
    <span className="question-text">
      {match[1]}<span className="answer-highlight">{match[2]}</span>{match[3]}
    </span>
  )
}

export default function QuizPage({ question, onAnswered, onExit, onNext, onDelete, onToggleMark, nextLabel, isReviewMode }) {
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [showFeedback, setShowFeedback] = useState(null)

  // 切换题目时重置选择状态
  useEffect(() => {
    setSelectedIndex(null)
    setShowFeedback(null)
  }, [question.id])

  // 答对成功弹窗 5 秒后自动下一题
  useEffect(() => {
    if (showFeedback !== 'success') return
    const t = setTimeout(() => {
      setShowFeedback(null)
      setSelectedIndex(null)
      onNext?.()
    }, 5000)
    return () => clearTimeout(t)
  }, [showFeedback, onNext])

  const handleSelect = useCallback((index) => {
    if (selectedIndex !== null) return
    setSelectedIndex(index)
    const correct = index === question.correctIndex
    setShowFeedback(correct ? 'success' : 'error')
    onAnswered(correct)
  }, [selectedIndex, question.correctIndex, onAnswered])

  const handleFeedbackClose = useCallback(() => {
    setShowFeedback(null)
    setSelectedIndex(null)
  }, [])

  return (
    <div className="page quiz-page">
      <div className="quiz-header">
        <div className="question-card">
          {renderQuestion(question.question)}
        </div>
      </div>

      <div className="quiz-grid">
        <GridImage
          items={question.items}
          gridImageBase64={question.gridImageBase64}
          selectedIndex={selectedIndex}
          correctIndex={question.correctIndex}
          showFeedback={showFeedback}
          onSelect={handleSelect}
        />
      </div>

      <div className="quiz-footer">
        <ButtonBar
          onExit={onExit}
          onNext={onNext}
          onDelete={onDelete}
          onToggleMark={onToggleMark}
          isMarked={question.isMarked}
          nextLabel={nextLabel}
          nextDisabled={!question.answered}
          isReviewMode={isReviewMode}
        />
      </div>

      {showFeedback && (
        <FeedbackModal
          type={showFeedback}
          onClose={handleFeedbackClose}
        />
      )}

      <style>{`
        .quiz-page {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .quiz-header {
          padding: 12px 16px;
          flex-shrink: 0;
        }

        .question-card {
          background: rgba(255, 182, 193, 0.2);
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 12px 16px;
          text-align: center;
        }

        .question-text {
          font-size: 18px;
          font-weight: 600;
          color: var(--color-text);
          line-height: 1.4;
        }

        .question-text .answer-highlight {
          color: var(--color-answer);
          font-weight: 700;
        }

        .quiz-grid {
          flex: 1 1 0%;
          min-height: 0;
          padding: 8px 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .quiz-footer {
          flex-shrink: 0;
          padding: 8px 16px 20px;
        }
      `}</style>
    </div>
  )
}
