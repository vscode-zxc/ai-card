import React from 'react'

export default function LoadingPage({ tip }) {
  return (
    <div className="page loading-page">
      <div className="clouds-bg">
        <div className="cloud c1">☁️</div>
        <div className="cloud c2">⭐</div>
        <div className="cloud c3">🌸</div>
        <div className="cloud c4">✨</div>
        <div className="cloud c5">🌈</div>
      </div>

      <div className="loading-center">
        {/* Cute AI brain character */}
        <div className="brain-wrap">
          <div className="brain-body">
            <div className="brain-face">
              <div className="brain-eye le" />
              <div className="brain-eye ri" />
              <div className="brain-mouth" />
            </div>
            <div className="brain-sparkles">
              <div className="sparkle s1">✨</div>
              <div className="sparkle s2">⭐</div>
              <div className="sparkle s3">✨</div>
            </div>
          </div>
          {/* Thinking dots */}
          <div className="think-dots">
            <div className="think-dot d1" />
            <div className="think-dot d2" />
            <div className="think-dot d3" />
          </div>
        </div>

        {/* 4 bouncing colored orbs */}
        <div className="orbs-row">
          <div className="orb orb-yellow" />
          <div className="orb orb-pink" />
          <div className="orb orb-blue" />
          <div className="orb orb-green" />
        </div>

        <div className="loading-text">{tip || 'AI 正在生成图片...'}</div>
      </div>

      <style>{`
        .loading-page {
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        /* Floating background clouds */
        .clouds-bg { position: absolute; inset: 0; pointer-events: none; }
        .cloud {
          position: absolute;
          font-size: 36px;
          opacity: 0.6;
        }
        .c1 { top: 7%; left: 7%; animation: float 3.5s ease-in-out infinite; }
        .c2 { top: 14%; right: 8%; font-size: 30px; animation: float-delayed 4s ease-in-out infinite; }
        .c3 { bottom: 30%; left: 5%; font-size: 26px; animation: float 4.8s ease-in-out infinite 0.5s; }
        .c4 { top: 38%; right: 6%; font-size: 24px; animation: float-delayed 3.6s ease-in-out infinite 1s; }
        .c5 { bottom: 16%; right: 10%; font-size: 40px; animation: float 3.2s ease-in-out infinite 0.8s; }

        /* Center content */
        .loading-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
          z-index: 1;
        }

        /* Brain character */
        .brain-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .brain-body {
          width: 110px;
          height: 110px;
          background: linear-gradient(145deg, #FFD54F, #FFB6C1);
          border-radius: 50% 50% 45% 45%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          box-shadow: 0 10px 32px rgba(255, 150, 180, 0.5);
          animation: brain-bounce 1.8s ease-in-out infinite;
        }

        .brain-face {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .brain-eye {
          width: 16px;
          height: 16px;
          background: #555;
          border-radius: 50%;
          position: relative;
        }
        .brain-eye::after {
          content: '';
          position: absolute;
          width: 5px;
          height: 5px;
          background: white;
          border-radius: 50%;
          top: 3px;
          right: 3px;
        }

        .brain-mouth {
          width: 28px;
          height: 14px;
          border: 3.5px solid #555;
          border-top: none;
          border-radius: 0 0 14px 14px;
        }

        /* Sparkles around brain */
        .brain-sparkles { position: absolute; inset: 0; }
        .sparkle {
          position: absolute;
          font-size: 16px;
          animation: sparkle-pop 1.3s ease-in-out infinite;
        }
        .s1 { top: -6px; right: -6px; animation-delay: 0s; }
        .s2 { bottom: 6px; left: -10px; font-size: 14px; animation-delay: 0.5s; }
        .s3 { top: 2px; left: -4px; font-size: 12px; animation-delay: 1s; }

        /* Thinking dots */
        .think-dots {
          display: flex;
          gap: 8px;
          align-items: center;
          height: 24px;
        }
        .think-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          animation: dot-pop 1.1s ease-in-out infinite;
        }
        .d1 { background: #FFD54F; animation-delay: 0s; }
        .d2 { background: #F48FB1; animation-delay: 0.2s; }
        .d3 { background: #81C784; animation-delay: 0.4s; }

        /* 4 colored orbs */
        .orbs-row {
          display: flex;
          gap: 14px;
          align-items: center;
        }
        .orb {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          animation: orb-bounce 1.2s ease-in-out infinite;
        }
        .orb-yellow { background: #FFD54F; box-shadow: 0 0 18px rgba(255, 213, 79, 0.7); }
        .orb-pink   { background: #F48FB1; box-shadow: 0 0 18px rgba(244, 143, 177, 0.7); animation-delay: 0.15s; }
        .orb-blue   { background: #64B5F6; box-shadow: 0 0 18px rgba(100, 181, 246, 0.7); animation-delay: 0.3s; }
        .orb-green  { background: #81C784; box-shadow: 0 0 18px rgba(129, 199, 132, 0.7); animation-delay: 0.45s; }

        /* Text */
        .loading-text {
          font-size: 16px;
          color: #888;
          font-weight: 500;
          text-align: center;
          padding: 0 20px;
          max-width: 280px;
          line-height: 1.5;
        }

        /* Animations */
        @keyframes brain-bounce {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.06); }
        }

        @keyframes sparkle-pop {
          0%, 100% { opacity: 0.5; transform: scale(0.7) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.4) rotate(20deg); }
        }

        @keyframes dot-pop {
          0%, 80%, 100% { transform: scale(0.5); opacity: 0.3; }
          40% { transform: scale(1.3); opacity: 1; }
        }

        @keyframes orb-bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-26px); }
        }
      `}</style>
    </div>
  )
}
