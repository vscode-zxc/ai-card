import React, { useState } from 'react'
import { getApiKey } from '../utils/gameEngine.js'

export default function ApiKeyModal({ onClose, onConfirm }) {
  const [key, setKey] = useState(getApiKey())

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!key.trim()) {
      alert('请输入 API Key')
      return
    }
    onConfirm(key.trim())
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card anim-bounce-in" onClick={e => e.stopPropagation()}>
        <div className="modal-icon">🔑</div>
        <h2 className="modal-title">配置 MiniMax API Key</h2>
        <p className="modal-desc">请输入您的 MiniMax API Key，用于生成儿童认知图片</p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            className="api-key-input"
            placeholder="输入 API Key..."
            value={key}
            onChange={e => setKey(e.target.value)}
            autoFocus
          />
          <div className="modal-buttons">
            <button type="button" className="btn-secondary" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="btn-primary">
              开始游戏
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-icon {
          font-size: 40px;
          text-align: center;
          margin-bottom: 8px;
        }

        .modal-title {
          font-size: 20px;
          font-weight: 700;
          text-align: center;
          color: var(--color-text);
          margin-bottom: 6px;
        }

        .modal-desc {
          font-size: 13px;
          color: var(--color-text-light);
          text-align: center;
          margin-bottom: 20px;
          line-height: 1.5;
        }

        .api-key-input {
          width: 100%;
          padding: 12px 14px;
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-sm);
          font-size: 14px;
          background: #fafafa;
          color: var(--color-text);
          transition: border-color 0.2s;
          margin-bottom: 16px;
          box-sizing: border-box;
        }

        .api-key-input:focus {
          border-color: var(--color-primary);
          background: white;
        }

        .modal-buttons {
          display: flex;
          gap: 10px;
        }

        .modal-buttons button {
          flex: 1;
          padding: 11px;
          font-size: 15px;
          border-radius: var(--radius-md);
        }
      `}</style>
    </div>
  )
}
