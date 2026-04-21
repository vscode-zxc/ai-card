import React, { useState, useEffect } from 'react'
import ApiKeyModal from '../components/ApiKeyModal.jsx'
import { getQuestionCount } from '../utils/db.js'

export default function WelcomePage({ onStartGame, onReview, onMarked, showApiKeyModal, onCloseApiKeyModal, onConfirmApiKey }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    getQuestionCount().then(setCount).catch(() => setCount(0))
  }, [])

  return (
    <div className="page welcome-page">
      <div className="clouds-bg">
        <div className="cloud cloud-1 anim-float">☁️</div>
        <div className="cloud cloud-2 anim-float-delayed">☁️</div>
        <div className="cloud cloud-3 anim-float">🌸</div>
        <div className="cloud cloud-4 anim-float-delayed">✨</div>
      </div>

      <div className="welcome-content">
        <div className="welcome-icon">🎨</div>
        <h1 className="welcome-title">启蒙小达人</h1>
        <p className="welcome-subtitle">
          {count > 0 ? `已保存 ${count} 道题目` : '专为 2-3 岁宝宝设计'}
        </p>

        <div className="welcome-buttons">
          <button className="btn-review welcome-btn" onClick={onReview}>
            📚 题目回顾
          </button>
          <button className="btn-marked welcome-btn" onClick={onMarked}>
            ⭐ 标记题目
          </button>
          <button className="btn-start welcome-btn" onClick={onStartGame}>
            🎮 开始游戏
          </button>
        </div>
      </div>

      {showApiKeyModal && (
        <ApiKeyModal onClose={onCloseApiKeyModal} onConfirm={onConfirmApiKey} />
      )}

      <style>{`
        .welcome-page {
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .clouds-bg {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .cloud {
          position: absolute;
          font-size: 42px;
          opacity: 0.65;
        }

        .cloud-1 { top: 6%; left: 8%; font-size: 52px; }
        .cloud-2 { top: 14%; right: 6%; font-size: 36px; }
        .cloud-3 { top: 58%; left: 4%; font-size: 32px; }
        .cloud-4 { top: 68%; right: 10%; font-size: 46px; }

        .welcome-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 0 32px;
          animation: bounce-in 0.6s var(--transition-bounce) forwards;
        }

        .welcome-icon {
          font-size: 88px;
          margin-bottom: 8px;
          animation: pulse-glow 1.8s ease-in-out infinite;
          filter: drop-shadow(0 6px 20px rgba(255, 150, 180, 0.5));
        }

        .welcome-title {
          font-size: 28px;
          font-weight: 800;
          background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .welcome-subtitle {
          font-size: 14px;
          color: var(--color-text-light);
          margin-bottom: 12px;
        }

        .welcome-buttons {
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
          max-width: 320px;
        }

        .welcome-btn {
          width: 100%;
          padding: 18px 28px;
          font-size: 18px;
          font-weight: 700;
          border-radius: var(--radius-lg);
          color: white;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
          transition: transform 0.18s var(--transition-ease), box-shadow 0.18s;
          letter-spacing: 0.5px;
        }

        .welcome-btn:active {
          transform: scale(0.96);
        }

        /* 题目回顾 - 清新蓝绿渐变 */
        .btn-review {
          background: linear-gradient(135deg, #64B5F6, #81C784);
        }
        .btn-review:hover {
          box-shadow: 0 8px 28px rgba(100, 181, 246, 0.5);
        }

        /* 标记题目 - 浪漫紫粉渐变 */
        .btn-marked {
          background: linear-gradient(135deg, #BA68C8, #F48FB1);
        }
        .btn-marked:hover {
          box-shadow: 0 8px 28px rgba(186, 104, 200, 0.5);
        }

        /* 开始游戏 - 招牌粉黄渐变 + 脉冲动画 */
        .btn-start {
          font-size: 22px;
          padding: 20px 32px;
          background: linear-gradient(135deg, #FF80AB, #FFD54F);
          animation: btn-pulse 1.6s ease-in-out infinite;
        }

        @keyframes btn-pulse {
          0%, 100% { box-shadow: 0 6px 20px rgba(255, 128, 171, 0.4); transform: scale(1); }
          50% { box-shadow: 0 10px 40px rgba(255, 128, 171, 0.7), 0 0 60px rgba(255, 213, 79, 0.3); transform: scale(1.02); }
        }
      `}</style>
    </div>
  )
}
