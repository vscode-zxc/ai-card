import React, { useState, useRef, useEffect } from 'react'

export default function GridImage({ items, gridImageBase64, selectedIndex, correctIndex, showFeedback, onSelect }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [rootSize, setRootSize] = useState(0)
  const rootRef = useRef(null)
  const imgRef = useRef(null)

  // 监听根容器宽度，强制正方形
  useEffect(() => {
    if (!rootRef.current) return
    const el = rootRef.current

    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        const w = Math.floor(entry.contentRect.width)
        setRootSize(w)
      }
    })
    ro.observe(el)

    // 初始读取
    const w = Math.floor(el.getBoundingClientRect().width)
    if (w > 0) setRootSize(w)

    return () => ro.disconnect()
  }, [])

  const hasImage = !!(gridImageBase64 && !imgError)
  const showPlaceholders = !hasImage || !imgLoaded
  const squareSize = rootSize > 0 ? rootSize : 300

  const cellClass = (i) => {
    let cls = 'qi-cell'
    if (selectedIndex === i && !showFeedback) cls += ' qi-selected'
    if (showFeedback === 'success' && i === correctIndex) cls += ' qi-correct'
    if (showFeedback === 'error' && i === selectedIndex && i !== correctIndex) cls += ' qi-error'
    return cls
  }

  return (
    <div className="qi-root" ref={rootRef}>
      {/* 正方形内部容器 */}
      <div className="qi-inner" style={{ width: squareSize, height: squareSize }}>

        {/* 底层图片 */}
        {hasImage && (
          <img
            ref={imgRef}
            src={`data:image/png;base64,${gridImageBase64}`}
            alt="四宫格认知图"
            className="qi-img"
            style={{ width: squareSize, height: squareSize }}
            onLoad={() => setImgLoaded(true)}
            onError={() => { setImgError(true); setImgLoaded(false) }}
            draggable="false"
          />
        )}

        {/* 四格点击覆盖层 */}
        <div className="qi-overlay" style={{ width: squareSize, height: squareSize }}>
          {items.map((item, i) => (
            <div
              key={i}
              className={cellClass(i)}
              style={{ width: squareSize / 2, height: squareSize / 2 }}
              onClick={() => onSelect(i)}
              role="button"
              aria-label={`选项${i + 1}：${item.colorName}的${item.word}`}
            >
              {showFeedback === 'success' && i === correctIndex && (
                <div className="qi-badge qi-badge-ok">✓</div>
              )}
              {showFeedback === 'error' && i === selectedIndex && i !== correctIndex && (
                <div className="qi-badge qi-badge-no">✗</div>
              )}
            </div>
          ))}
        </div>

        {/* 占位格子 */}
        {showPlaceholders && (
          <div className="qi-ph" style={{ width: squareSize, height: squareSize }}>
            {items.map((item, i) => (
              <div
                key={i}
                className="qi-ph-cell"
                style={{ width: squareSize / 2, height: squareSize / 2, background: item.colorValue + '22' }}
              >
                <span className="qi-ph-color" style={{ color: item.colorValue }}>{item.colorName}</span>
                <span className="qi-ph-word">{item.word}</span>
              </div>
            ))}
          </div>
        )}

        {/* 加载中 */}
        {hasImage && !imgLoaded && !imgError && (
          <div className="qi-loading">
            <div className="qi-ring" />
            <span>图片加载中...</span>
          </div>
        )}
      </div>

      <style>{`
        .qi-root {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 0;
          flex: 1 1 auto;
        }

        .qi-inner {
          position: relative;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: #ece8e0;
          box-shadow: 0 2px 12px rgba(0,0,0,.1);
          flex-shrink: 0;
        }

        /* 图片完整显示，不裁切 */
        .qi-img {
          position: absolute;
          top: 0;
          left: 0;
          object-fit: contain;
          z-index: 1;
        }

        /* 四格点击层 */
        .qi-overlay {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 10;
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr;
        }

        .qi-cell {
          position: relative;
          cursor: pointer;
          border: 3px solid transparent;
          transition: border-color 0.15s;
          box-sizing: border-box;
        }

        .qi-selected {
          border-color: #FFB6C1;
          background: rgba(255, 182, 193, 0.2);
        }

        .qi-correct {
          border-color: #4CAF50;
          background: rgba(76, 175, 80, 0.2);
        }

        .qi-error {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.15);
          animation: shake 0.4s ease;
        }

        /* 正确/错误图标 */
        .qi-badge {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          font-weight: bold;
          color: white;
          z-index: 20;
        }

        .qi-badge-ok { background: rgba(76, 175, 80, 0.9); }
        .qi-badge-no { background: rgba(239, 68, 68, 0.9); }

        /* 占位格子 */
        .qi-ph {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 5;
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr;
        }

        .qi-ph-cell {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          border: 1px solid rgba(0,0,0,.06);
        }

        .qi-ph-color {
          font-size: 15px;
          font-weight: 800;
        }

        .qi-ph-word {
          font-size: 13px;
          color: #555;
        }

        /* 加载中 */
        .qi-loading {
          position: absolute;
          inset: 0;
          z-index: 15;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: rgba(255, 250, 245, 0.88);
          font-size: 13px;
          color: #999;
          -webkit-backdrop-filter: blur(4px);
          backdrop-filter: blur(4px);
        }

        .qi-ring {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(255, 182, 193, 0.3);
          border-top-color: #FFB6C1;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
      `}</style>
    </div>
  )
}
