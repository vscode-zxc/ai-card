# AI 认知卡片 PWA — 设计文档

## 概述

一款纯前端 PWA 儿童认知卡片应用，面向 2-3 岁宝宝，通过 AI 文生图生成四宫格选择题，支持本地 IndexedDB 存储，无后端依赖，可安装到安卓/iOS 桌面。

---

## 技术选型

- **框架**：React 18 + Vite（JS + SCSS）
- **AI 图片生成**：MiniMax `minimax-image-v2` 模型，API 调用绕过跨域（直接前端调用，或通过 Vite 代理）
- **本地存储**：IndexedDB（题目+图片 Base64）
- **PWA**：Vite PWA 插件 + Service Worker
- **状态管理**：React Context / useReducer
- **样式**：纯 SCSS + CSS Variables，响应式移动优先

---

## 视觉风格

**马卡龙柔和风**

| 元素 | 颜色 / 样式 |
|------|------------|
| 背景渐变 | `#FEF9EF` → `#FFF0F7`（奶油白 → 淡粉） |
| 主色调 | `#FFB6C1`（粉）、`#FFD700`（黄） |
| 按钮渐变 | `linear-gradient(135deg, #FFB6C1, #FFD700)` |
| 卡片白 | `#FFFFFF`，圆角 14px |
| 阴影 | `rgba(255, 150, 180, 0.2)` 柔和粉影 |
| 文字主色 | `#555555` |
| 文字强调 | `#e8003d`（红色，用于答案高亮） |
| 动画风格 | 缓动曲线 `cubic-bezier(0.34, 1.56, 0.64, 1)` 弹跳感 |

---

## 页面结构

### 1. 首页（Welcome）

- 全屏奶油渐变背景 + 云朵/星星漂浮 CSS 动画
- 标题"AI 认知卡片"居中
- 副标题（可选：显示已存题目数量）
- 三个主按钮（垂直排列，圆角 14px）：
  - 「题目回顾」→ 从本地随机取题
  - 「标记题目」→ 从本地标记题目取题
  - 「开始游戏」→ 输入/配置 API Key 后进入 AI 生成流程
- 点击「开始游戏」时若未配置 API Key：弹出 Modal 输入框

### 2. API Key 配置 Modal

- 居中卡片，背景半透明遮罩
- 输入框：MiniMax API Key
- 保存到 localStorage
- 「开始游戏」按钮

### 3. Loading 页面

- 全屏遮罩 + 居中加载动画（旋转的彩虹色圆环 + 文字"AI 正在生成图片..."）
- 进度提示："正在生成第 1/4 张..."

### 4. 答题页面

- **顶部**：题目栏（粉色淡底卡片），格式：`请选择「[答案]」？`，答案红色高亮
- **中部**：四宫格图片，占页面 ~70% 高度，等分 2×2，每个格子可点击
- **底部按钮**：退出、标记、下一题（下一题默认禁用，答对后解锁）

### 5. 反馈弹窗

- 答对：居中白色圆角卡片（弹跳缩放动画），大字"恭喜，小朋友太棒了 🎉"，2秒后自动消失或点击关闭
- 答错：同位置红色震动卡片，"答错了，小朋友请再想想 🤔"，点击任意处关闭

### 6. 题目回顾页 / 标记题目页

- 布局同答题页面
- 底部按钮：退出、删除、标记/取消标记、下一题
- 下一题默认禁用（答对后解锁）

---

## 核心流程

### 开始游戏流程

```
首页 → [未配置API Key?] → Modal输入Key → 保存localStorage
     → Loading状态
        → 随机选4个babyWords，分别配不同颜色 → 随机选1个为答案
        → 拼装Prompt → 调用MiniMax API × 4次（生成四宫格）
        → 存IndexedDB（题目+4张图片Base64+答案+是否标记+时间戳）
     → 答题页
     → [用户点击格子]
        → 高亮选中格
        → 与答案对比
        → 对：显示恭喜弹窗，解锁下一题
          错：显示再想弹窗
     → [点下一题] → Loading... → 重复
```

### 题目回顾流程

```
首页 → 题目回顾 → 随机取1条本地题目 → 答题页(只读，无AI)
     → 底部：退出、删除、标记/取消标记、下一题(禁用→答对解锁)
```

### 标记题目流程

```
首页 → 标记题目 → 取本地标记题目 → 答题页(只读，无AI)
     → 底部：退出、删除、标记/取消标记、下一题
```

---

## 数据模型

```js
// IndexedDB Store: "questions"
{
  id: string,              // UUID
  createdAt: number,       // timestamp
  isMarked: boolean,
  // 以下为题目内容
  question: string,        // e.g. "请选择「白色的袜子」？"
  answer: string,         // e.g. "白色的袜子"
  items: [                 // 4个选项
    { word: string, color: string, imageBase64: string },
    ...
  ],
  correctIndex: number,    // 0-3，答案在items中的索引
  answered: boolean,       // 本次会话是否已答对（用于解锁下一题）
}
```

---

## MiniMax API 调用

- **接口**：`POST https://api.minimax.chat/v1/text2imagev2`
- **请求体**：
  ```json
  {
    "model": "minimax-image-01",
    "prompt": "<四宫格提示词>",
    "image_size": "1024x1024",
    "response_format": "base64"
  }
  ```
- **鉴权**：`Authorization: Bearer <API_KEY>`
- **跨域处理**：Vite 开发服务器配置代理 `/api/minimax` → `https://api.minimax.chat`

**四宫格固定 Prompt 模板**：

```
生成 1:1 正方形单张四宫格图片，2.5D 可爱卡通风格，适合 2-3 岁儿童，
每个格子一个主体，角色的颜色占比≥70%，形象具象不简约，无背景干扰，
指定颜色要大于70%，四个角色分别为：
黄色的猫咪、白色的袜子、蓝色的公交车、绿色的房子
```

---

## PWA 配置

- `manifest.json`：name="AI认知卡片"，icons（192/512），display=standalone
- Service Worker：缓存静态资源 + IndexedDB 数据本地持久化
- 可添加到主屏幕

---

## 组件列表

| 组件 | 职责 |
|------|------|
| `App.jsx` | 路由/状态总控 |
| `WelcomePage.jsx` | 首页 |
| `ApiKeyModal.jsx` | API Key 输入 |
| `LoadingPage.jsx` | 生成中状态 |
| `QuizPage.jsx` | 答题主体 |
| `FeedbackModal.jsx` | 答题反馈弹窗 |
| `ButtonBar.jsx` | 底部操作按钮栏 |
| `GridImage.jsx` | 四宫格可点击图片 |
| `db.js` | IndexedDB CRUD 封装 |
| `api.js` | MiniMax API 调用封装 |
| `gameEngine.js` | 题目生成逻辑 |

---

## 文件结构

```
ai-card/
├── index.html
├── vite.config.js        # 代理配置 + PWA
├── package.json
├── public/
│   ├── manifest.json
│   └── icons/
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── styles/
│   │   ├── variables.scss
│   │   ├── base.scss
│   │   └── animations.scss
│   ├── pages/
│   │   ├── WelcomePage.jsx
│   │   ├── LoadingPage.jsx
│   │   └── QuizPage.jsx
│   ├── components/
│   │   ├── ApiKeyModal.jsx
│   │   ├── FeedbackModal.jsx
│   │   ├── ButtonBar.jsx
│   │   └── GridImage.jsx
│   ├── utils/
│   │   ├── db.js
│   │   ├── api.js
│   │   └── gameEngine.js
│   └── data/
│       └── babyWords.js   # 词汇数组 + 颜色数组
```
