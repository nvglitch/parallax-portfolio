# 画廊重构 - Awwwards 级别视觉体验

## 🎨 核心改进

### 1. 治愈"发灰"问题
- **NoiseOverlay 组件**：全局噪点质感层
  - `mix-blend-mode: overlay` + `opacity: 0.08`
  - 高质量 SVG 噪点滤镜（4 octaves）
  - 所有图片自动应用 `saturate(120%) contrast(105%)`

### 2. Asymmetric Bento Grid 布局
- **非对称网格**：打破常规的 6 种卡片尺寸组合
  - 2x2 大块
  - 1x1 小块
  - 1x2 竖长
  - 2x1 横长
- **响应式**：移动端优雅降级为单列，保持 24px 圆角

### 3. GSAP 高级动效

#### 入场揭示 (Reveal Animation)
```javascript
gsap.fromTo(cards, {
  y: 80,
  opacity: 0,
  clipPath: 'inset(100% 0% 0% 0%)',
}, {
  duration: 1.2,
  ease: 'power4.out',
  stagger: 0.08,
})
```

#### 图片内部视差 (Image Parallax)
- 图片高度设为容器的 120%
- ScrollTrigger 绑定滚动，反向 Y 轴位移 -15%
- `scrub: 1.5` 实现丝滑阻尼感

#### 悬浮聚焦 (Hover Focus)
- 悬浮图片：`scale(1.05)` + 保持饱和度
- 其他图片：`brightness(0.7) blur(2px)`
- 过渡时间：700ms `ease-out`

## 🚀 使用方式

```tsx
<BentoGallery
  items={galleryItems}
  title="Amazon"
  accentColor="#6667AB"
/>
```

## 📦 新增依赖
- `gsap` - 高级动画引擎
- `gsap/ScrollTrigger` - 滚动触发器

## 🎯 技术亮点
1. **零本地资产**：使用 `https://picsum.photos` 作为占位符
2. **禁用廉价动画**：完全移除 `transition: all 0.3s`
3. **GSAP 阻尼感**：`power4.out` / `expo.out` 缓动函数
4. **视觉层次**：通过模糊和亮度压暗制造聚焦效果
