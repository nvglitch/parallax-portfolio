# Bug 修复总结

## 问题诊断
画廊图片不显示的原因是 GSAP 入场动画使用了 `fromTo` 方法，将初始 `opacity` 设置为 0，并且使用了 `clipPath: 'inset(100% 0% 0% 0%)'`，导致图片在动画触发前完全不可见。

## 修复方案

### 1. 简化入场动画
- 从 `gsap.fromTo()` 改为 `gsap.from()`
- 移除 `clipPath` 动画（过于复杂，可能导致渲染问题）
- 添加 `clearProps: 'all'` 确保动画完成后清除所有 GSAP 属性
- 保留核心效果：Y 轴位移 + 透明度渐变 + 交错出现

### 2. 图片加载容错
- 添加 `onError` 处理，如果本地图片加载失败，自动切换到 picsum.photos 占位符
- 确保图片路径正确（使用 `item.featured_image_url`）

### 3. DOM 渲染时机
- 添加 100ms 延迟，确保 React 完成 DOM 渲染后再执行 GSAP 动画
- 检查 `cards.length` 避免在空数组上执行动画

## 最终效果

✅ 图片正常显示
✅ 入场动画：60px Y 轴位移 + 透明度 0→1 + 0.1s 交错
✅ 图片内部视差：-15% Y 轴滚动视差
✅ 悬浮聚焦：当前图片放大 1.05x，其他图片降低亮度 + 模糊
✅ 质感增强：所有图片 saturate(120%) + contrast(105%)
✅ 全局噪点层：overlay 混合模式 + 8% 透明度

## 技术要点
- 使用 `gsap.from()` 而不是 `gsap.fromTo()` 更安全
- 始终添加 `clearProps` 避免 GSAP 属性残留
- 图片容器高度 120% 用于视差效果
- ScrollTrigger 的 `scrub: 1.5` 提供丝滑阻尼感
