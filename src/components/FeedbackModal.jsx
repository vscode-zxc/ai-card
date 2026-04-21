import React, { useEffect, useState, useRef } from 'react'

export default function FeedbackModal({ type, onClose }) {
  const isSuccess = type === 'success'
  const [countdown, setCountdown] = useState(isSuccess ? 5 : 0)

  // 成功时倒计时
  useEffect(() => {
    if (!isSuccess) {
      setCountdown(0)
      return
    }
    setCountdown(5)
    const id = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(id); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [isSuccess])

  // 错误时：2秒后关闭
  useEffect(() => {
    if (!isSuccess) {
      const t = setTimeout(onClose, 2000)
      return () => clearTimeout(t)
    }
  }, [isSuccess, onClose])

  return (
    <div
      className={`modal-overlay ${isSuccess ? 'overlay-success' : 'overlay-error'}`}
      onClick={onClose}
    >
      {/* 成功时的彩带星星装饰 */}
      {isSuccess && (
        <div className="confetti-field">
          {['🌟','⭐','✨','🌸','💖','🎉','🌈','💛','🧡','💜','🤍','💚'].map((e, i) => (
            <div key={i} className={`confetti c${i + 1}`}>{e}</div>
          ))}
        </div>
      )}

      <div className={`feedback-card ${isSuccess ? 'card-success' : 'card-error'} anim-bounce-in`}>
        {isSuccess ? (
          <>
            <div className="success-banner">🎉 🎊 🎉 🎊 🎉</div>
            <div className="success-main-emoji">🎉</div>
            <div className="success-title">太棒了！</div>
            <div className="success-sub">小朋友答对了，真厉害！</div>

            {/* 星星倒计时 */}
            <div className="countdown-row">
              {[1,2,3,4,5].map(i => (
                <div key={i} className={`star-dot ${i <= (5 - countdown) ? 'star-filled' : 'star-empty'}`}>
                  {i <= (5 - countdown) ? '⭐' : '☆'}
                </div>
              ))}
            </div>
            <div className="countdown-text">
              {countdown > 0 ? `${countdown}秒后自动进入下一题` : '即将进入下一题...'}
            </div>
            <div className="success-hint">点击任意处立即下一题</div>
          </>
        ) : (
          <>
            <div className="error-main-emoji">🤔</div>
            <div className="error-title">答错了</div>
            <div className="error-sub">小朋友请再想想哦～</div>
            <div className="error-hint">点击任意处关闭</div>
          </>
        )}
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          -webkit-backdrop-filter: blur(3px);
          backdrop-filter: blur(3px);
          animation: scale-in 0.25s ease forwards;
        }

        .overlay-success { background: rgba(255, 223, 186, 0.6); }
        .overlay-error   { background: rgba(180, 160, 160, 0.5); }

        /* 彩带 */
        .confetti-field { position: fixed; inset: 0; pointer-events: none; overflow: hidden; }
        .confetti { position: absolute; font-size: 28px; animation: confetti-fall linear forwards; }
        .c1  { left: 5%;  animation-duration: 2.2s; animation-delay: 0s;    font-size: 32px; }
        .c2  { left: 12%; animation-duration: 2.5s; animation-delay: 0.1s;  font-size: 22px; }
        .c3  { left: 20%; animation-duration: 2.0s; animation-delay: 0.2s;  font-size: 26px; }
        .c4  { left: 28%; animation-duration: 2.8s; animation-delay: 0.05s; font-size: 30px; }
        .c5  { left: 36%; animation-duration: 2.3s; animation-delay: 0.3s;  font-size: 20px; }
        .c6  { left: 45%; animation-duration: 2.6s; animation-delay: 0.15s; font-size: 34px; }
        .c7  { left: 54%; animation-duration: 2.1s; animation-delay: 0.25s; font-size: 24px; }
        .c8  { left: 62%; animation-duration: 2.4s; animation-delay: 0.08s; font-size: 28px; }
        .c9  { left: 70%; animation-duration: 2.7s; animation-delay: 0.35s; font-size: 20px; }
        .c10 { left: 78%; animation-duration: 2.0s; animation-delay: 0.12s; font-size: 26px; }
        .c11 { left: 86%; animation-duration: 2.9s; animation-delay: 0.2s;  font-size: 22px; }
        .c12 { left: 93%; animation-duration: 2.3s; animation-delay: 0.4s;  font-size: 30px; }

        @keyframes confetti-fall {
          0%   { top: -10%; opacity: 1; transform: translateX(0) rotate(0deg) scale(1); }
          25%  { opacity: 1; transform: translateX(15px) rotate(20deg) scale(1.1); }
          50%  { opacity: 1; transform: translateX(-10px) rotate(-15deg) scale(1.05); }
          75%  { opacity: 0.8; transform: translateX(8px) rotate(10deg) scale(1); }
          100% { top: 110%; opacity: 0; transform: translateX(-5px) rotate(-25deg) scale(0.8); }
        }

        /* 卡片 */
        .feedback-card {
          background: white;
          border-radius: 24px;
          padding: 32px 36px;
          text-align: center;
          box-shadow: 0 12px 48px rgba(0,0,0,.18);
          min-width: 300px;
          max-width: 360px;
          position: relative;
          z-index: 10;
          overflow: hidden;
        }

        .card-success { border: 3px solid #FFD54F; }
        .card-error   { border: 3px solid #ef4444; animation: shake 0.5s ease; }

        /* 成功页 */
        .success-banner {
          font-size: 22px;
          letter-spacing: 6px;
          margin-bottom: 6px;
          animation: banner-sway 1.5s ease-in-out infinite;
        }
        @keyframes banner-sway {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(1.05); }
        }

        .success-main-emoji {
          font-size: 80px;
          line-height: 1;
          margin-bottom: 8px;
          animation: emoji-pop 0.6s var(--transition-bounce) forwards, emoji-wobble 1s ease-in-out 0.6s infinite;
        }
        @keyframes emoji-pop {
          0% { transform: scale(0) rotate(-20deg); opacity: 0; }
          70% { transform: scale(1.2) rotate(10deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes emoji-wobble {
          0%, 100% { transform: rotate(-5deg) scale(1.05); }
          50% { transform: rotate(5deg) scale(1.05); }
        }

        .success-title {
          font-size: 32px;
          font-weight: 900;
          color: #FFD54F;
          margin-bottom: 6px;
          text-shadow: 0 2px 8px rgba(255, 213, 79, 0.4);
        }

        .success-sub {
          font-size: 16px;
          color: #888;
          margin-bottom: 20px;
        }

        .countdown-row {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .star-dot {
          font-size: 26px;
          transition: transform 0.3s var(--transition-bounce);
        }
        .star-filled {
          transform: scale(1.2);
          animation: star-pop 0.4s var(--transition-bounce);
        }
        .star-empty { opacity: 0.3; filter: grayscale(1); }
        @keyframes star-pop {
          0% { transform: scale(0.5); }
          60% { transform: scale(1.4); }
          100% { transform: scale(1.2); }
        }

        .countdown-text {
          font-size: 13px;
          color: #aaa;
          margin-bottom: 12px;
        }

        .success-hint {
          font-size: 12px;
          color: #ccc;
        }

        /* 错误页 */
        .error-main-emoji {
          font-size: 72px;
          margin-bottom: 12px;
          animation: emoji-pop 0.5s var(--transition-bounce) forwards;
        }
        .error-title {
          font-size: 28px;
          font-weight: 800;
          color: #ef4444;
          margin-bottom: 8px;
        }
        .error-sub {
          font-size: 15px;
          color: #888;
          margin-bottom: 16px;
        }
        .error-hint {
          font-size: 12px;
          color: #ccc;
        }
      `}</style>
    </div>
  )
}
