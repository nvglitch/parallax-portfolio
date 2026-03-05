# Parallax Portfolio

一个融合了视差交互、数据工程美学（Dataviz & Swiss Style）与瀑布流画廊的创意作品集网站。

## 技术栈

- **框架**: React 19 + TypeScript
- **构建工具**: Vite 7
- **样式**: Tailwind CSS 4
- **动画**: Framer Motion 12

## 项目结构

```
src/
├── App.tsx        # 主应用组件（包含全部页面逻辑与视觉层级）
├── App.css        # 基础样式
├── index.css      # Tailwind 入口
└── main.tsx       # 应用入口

public/
└── gallery/       # 画廊海报资产（1.jpg ~ 7.jpg）
```

## 页面架构

项目包含两个场景，通过 AnimatePresence 实现平滑切换：

### Hero 首页

- **巨型 Slogan**: "CREATIVE VISION"，使用 Playfair Display 衬线体
- **鼠标变焦模糊**: 每个字母根据鼠标距离实时计算高斯模糊值
- **字母粒子碎裂**: 点击任意字母触发 Canvas 粒子爆炸动画
- **视差跟随**: 文字区域跟随鼠标产生微弱的视差位移

### Gallery 画廊

- **CSS 多列瀑布流**: 使用 `columns` 布局，响应式 1/2/3 列自适应
- **自适应容器**: `break-inside-avoid` 防止图片截断，高度由图片自然撑开
- **画框留白**: 每张图片外围 `p-2` 内边距，模拟实体画框效果
- **Hover 交互**: 初始 30% 去色，悬停恢复色彩并缓慢放大（700ms ease-out）

## 视觉层级（Z-Axis）

从底层到顶层的完整渲染顺序：

| 层级 | 内容 | Z-Index |
|------|------|---------|
| Layer 0 | `#F9F8F6` 暖白底色 | - |
| Layer 1 | 弥散光（长春花蓝 + 暖橙渐变，blur 100px） | z-0 |
| Layer 2 | 点阵网格 + 细线网格（仅 Hero 页面） | z-1 |
| Layer 3 | SVG 噪波纹理（fractalNoise，全局） | z-10 |
| Layer 4 | 页面内容（Slogan / 画廊 / HUD 装饰） | z-20+ |
| Layer 5 | Canvas 粒子系统 | z-50 |

## HUD 装饰元素

Hero 页面叠加了数据工程美学风格的前景装饰：

- **十字准星**: Slogan 首字母旁的空心圆环 + 内部十字线（长春花蓝 #6667AB）
- **连接虚线**: SVG 绘制的 1px 虚线路径
- **微型坐标文本**: 等宽字体技术标注（`coordinates: 0x4A7B`）
- **定义块排版**: 页面底部 Playfair Display 极小字号装饰文本
- **斜线阵列**: 画廊顶部 45 度 `repeating-linear-gradient` 装饰带

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 设计色板

| 用途 | 色值 |
|------|------|
| 底色 | `#F9F8F6` |
| 主文字 | `#1C1C1C` |
| 长春花蓝（弥散光 / HUD） | `#6667AB` |
| 暖橙（弥散光） | `#FFBE98` |
