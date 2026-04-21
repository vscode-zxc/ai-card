const API_BASE = '/api/minimax'

function buildGridPrompt(items) {
  const descriptions = items.map((item, i) => {
    return `主体${i + 1}. ${item.colorName}的${item.word}，2.5D 可爱卡通风格，适合 2-3 岁儿童，形象具象不简约，背景为极淡的奶白色或浅灰，整体干净简洁，角色指定颜色要大于70%`
  }).join('；') + '；'

  return `生成 1:1 正方形单张四宫格图片，${descriptions}四个主体分别放在对应的格子里，背景颜色极淡，整体协调统一。`
}

export async function generateGridImage(apiKey, items, onProgress) {
  const prompt = buildGridPrompt(items)
  onProgress?.(1, 1, 'AI 正在生成四宫格图片...')

  let response
  try {
    response = await fetch(`${API_BASE}/v1/image_generation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'image-01',
        prompt,
        aspect_ratio: '1:1',
        response_format: 'base64'
      })
    })
  } catch (err) {
    throw new Error('网络请求失败：' + err.message)
  }

  const data = await response.json()

  if (data.base_resp?.status_code !== 0) {
    const msg = data.base_resp?.status_msg || `API错误: ${data.base_resp?.status_code}`
    throw new Error(msg)
  }

  const base64 = data.data?.image_base64?.[0] || data.data?.image_urls?.[0]
  if (!base64) {
    throw new Error('未返回图片数据')
  }

  return base64
}
