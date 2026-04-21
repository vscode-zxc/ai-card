import React from 'react'

export default function ButtonBar({ onExit, onNext, onDelete, onToggleMark, isMarked, nextLabel, nextDisabled, isReviewMode }) {
  return (
    <div className="button-bar">
      <button className="bar-btn bar-btn-exit btn-secondary" onClick={onExit}>
        退出
      </button>

      {isReviewMode && (
        <>
          <button className="bar-btn bar-btn-delete btn-secondary" onClick={onDelete}>
            删除
          </button>
          <button className="bar-btn bar-btn-mark btn-secondary" onClick={onToggleMark}>
            {isMarked ? '取消标记 ⭐' : '标记 ⭐'}
          </button>
        </>
      )}

      <button
        className={`bar-btn bar-btn-next btn-primary ${!nextDisabled ? 'anim-pulse-glow' : ''}`}
        onClick={nextDisabled ? undefined : onNext}
        disabled={nextDisabled}
      >
        {nextLabel || '下一题 →'}
      </button>

      <style>{`
        .button-bar {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .bar-btn {
          flex: 1;
          padding: 11px 8px;
          font-size: 14px;
          border-radius: var(--radius-md);
          font-weight: 600;
        }

        .bar-btn-exit {
          flex: 0 0 auto;
          padding: 11px 16px;
          background: rgba(200, 200, 200, 0.3);
          color: var(--color-text-light);
          border-color: transparent;
        }

        .bar-btn-delete {
          color: var(--color-error);
          border-color: rgba(239, 68, 68, 0.3);
          background: rgba(239, 68, 68, 0.05);
        }

        .bar-btn-mark {
          color: #e89000;
          border-color: rgba(234, 179, 8, 0.3);
          background: rgba(234, 179, 8, 0.05);
        }

        .bar-btn-next {
          flex: 2;
        }
      `}</style>
    </div>
  )
}
