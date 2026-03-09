import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import type { PortfolioItem } from './services/wordpress'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  alpha: number
}

const particles: Particle[] = []

function Letter({ char, mouseX, mouseY, onExplode }: { char: string; mouseX: any; mouseY: any; onExplode: (x: number, y: number) => void }) {
  const ref = useRef<HTMLSpanElement>(null)
  const centerX = useMotionValue(0)
  const centerY = useMotionValue(0)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    centerX.set(rect.left + rect.width / 2)
    centerY.set(rect.top + rect.height / 2)
  }, [])

  const blur = useTransform([mouseX, mouseY, centerX, centerY], ([mx, my, cx, cy]: number[]) => {
    const distance = Math.hypot(mx - cx, my - cy)
    const blurValue = Math.min((distance / 500) * 12, 12)
    return `blur(${blurValue}px)`
  })

  const handleClick = () => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2

    setHidden(true)
    onExplode(x, y)

    setTimeout(() => setHidden(false), 2000)
  }

  return (
    <motion.span
      ref={ref}
      style={{ filter: blur, willChange: 'filter', opacity: hidden ? 0 : 1, transition: 'opacity 0.3s' }}
      className="inline-block cursor-pointer"
      onClick={handleClick}
    >
      {char === ' ' ? '\u00A0' : char}
    </motion.span>
  )
}

function App() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [buttonHidden, setButtonHidden] = useState(false)
  const [aboutButtonHidden, setAboutButtonHidden] = useState(false)
  const [currentScene, setCurrentScene] = useState<'hero' | 'gallery' | 'about'>('hero')
  const [galleryItems, setGalleryItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)

  const blurX = useMotionValue(0)
  const blurY = useMotionValue(0)
  const springBlurX = useSpring(blurX, { stiffness: 150, damping: 30 })
  const springBlurY = useSpring(blurY, { stiffness: 150, damping: 30 })

  const parallaxX = useSpring(useMotionValue(0), { stiffness: 150, damping: 30 })
  const parallaxY = useSpring(useMotionValue(0), { stiffness: 150, damping: 30 })

  const text = "CREATIVE VISION"

  const createExplosion = (x: number, y: number) => {
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 2 + Math.random() * 4
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        radius: 2 + Math.random() * 3,
        alpha: 1
      })
    }
  }

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2

    setButtonHidden(true)
    createExplosion(x, y)

    setTimeout(() => {
      setButtonHidden(false)
      setCurrentScene('gallery')
    }, 300)
  }

  const handleAboutButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2

    setAboutButtonHidden(true)
    createExplosion(x, y)

    setTimeout(() => {
      setAboutButtonHidden(false)
      setCurrentScene('about')
    }, 300)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')!
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.vy += 0.15
        p.x += p.vx
        p.y += p.vy
        p.alpha -= 0.015

        if (p.alpha <= 0) {
          particles.splice(i, 1)
          continue
        }

        ctx.globalAlpha = p.alpha
        ctx.fillStyle = '#1C1C1C'
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()
      }

      requestAnimationFrame(animate)
    }

    animate()
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      blurX.set((e.clientX / window.innerWidth - 0.5) * 100)
      blurY.set((e.clientY / window.innerHeight - 0.5) * 100)
      parallaxX.set((e.clientX / window.innerWidth - 0.5) * 20)
      parallaxY.set((e.clientY / window.innerHeight - 0.5) * 20)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    async function loadPortfolioItems() {
      setLoading(true)
      // 本地开发模式：直接使用本地图片，不调用 API
      const localItems = [
        { name: 'a1', ext: 'jpg' },
        { name: 'a2', ext: 'jpg' },
        { name: 'a3', ext: 'jpg' },
        { name: 'a4', ext: 'jpg' },
        { name: 'a5', ext: 'jpg' },
        { name: 'b1', ext: 'jpg' },
        { name: 'b2', ext: 'jpg' },
        { name: 'b3', ext: 'jpg' },
        { name: 'b4', ext: 'jpg' },
        { name: 'p1', ext: 'png' },
        { name: 'p2', ext: 'png' },
      ].map((item, index) => ({
        id: index + 1,
        title: { rendered: item.name },
        content: { rendered: '' },
        featured_image_url: `${import.meta.env.BASE_URL}gallery/${item.name}.${item.ext}`,
        meta: {
          aspect_ratio: '210/297',
          order: index
        }
      }))

      setGalleryItems(localItems)
      setLoading(false)
    }
    loadPortfolioItems()
  }, [])

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#F9F8F6]">
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />

      <motion.div className="fixed inset-0 pointer-events-none z-0" style={{ x: springBlurX, y: springBlurY }}>
        <div
          className="absolute top-1/4 left-1/4 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] md:w-[800px] md:h-[800px] rounded-full opacity-40"
          style={{
            background: 'radial-gradient(circle, #FFBE98 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-[450px] h-[450px] sm:w-[700px] sm:h-[700px] md:w-[900px] md:h-[900px] rounded-full opacity-35"
          style={{
            background: 'radial-gradient(circle, #6667AB 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </motion.div>

      <div className="fixed inset-0 pointer-events-none z-10 opacity-50 mix-blend-multiply">
        <svg className="w-full h-full">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      <AnimatePresence mode="wait">
        {currentScene === 'hero' && (
          <motion.section
            key="hero"
            initial={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 bg-transparent"
          >
            <div className="absolute inset-0 pointer-events-none z-[1]" style={{
              backgroundImage: 'radial-gradient(circle, #1C1C1C 1px, transparent 1px), repeating-linear-gradient(0deg, rgba(102, 103, 171, 0.1) 0px, transparent 1px, transparent 40px, rgba(102, 103, 171, 0.1) 41px), repeating-linear-gradient(90deg, rgba(102, 103, 171, 0.1) 0px, transparent 1px, transparent 40px, rgba(102, 103, 171, 0.1) 41px)',
              backgroundSize: '8px 8px, 40px 40px, 40px 40px',
              opacity: 0.15
            }} />
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center gap-12"
              style={{ x: parallaxX, y: parallaxY }}
            >
              <div className="relative px-4">
                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-wider text-[#1C1C1C] select-none" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {text.split('').map((char, i) => (
                    <Letter key={i} char={char} mouseX={mouseX} mouseY={mouseY} onExplode={createExplosion} />
                  ))}
                </h1>

                <div className="hidden md:block absolute -left-20 top-0 w-4 h-4 border border-[#6667AB] rounded-full pointer-events-none" style={{ opacity: 0.6 }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[1px] h-full bg-[#6667AB]" />
                    <div className="w-full h-[1px] bg-[#6667AB] absolute" />
                  </div>
                </div>

                <svg className="hidden md:block absolute -left-20 top-2 w-16 h-1 pointer-events-none" style={{ opacity: 0.6 }}>
                  <line x1="0" y1="0" x2="64" y2="0" stroke="#6667AB" strokeWidth="1" strokeDasharray="2,2" />
                </svg>

                <div className="hidden md:block absolute -right-24 bottom-4 text-[8px] text-[#6667AB] font-mono pointer-events-none" style={{ opacity: 0.5 }}>
                  coordinates: 0x4A7B
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center px-4">
                <div className="relative">
                  <button
                    onClick={handleButtonClick}
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      opacity: buttonHidden ? 0 : 1,
                      transition: 'all 0.3s'
                    }}
                    className="px-6 sm:px-8 py-3 text-xs sm:text-sm font-medium tracking-widest text-[#1C1C1C] border-2 border-[#1C1C1C] hover:bg-[#1C1C1C] hover:text-[#F9F8F6] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    VIEW WORKS
                  </button>

                  <div className="hidden sm:block absolute -right-16 top-1/2 -translate-y-1/2 w-2 h-2 pointer-events-none" style={{ opacity: 0.6 }}>
                    <div className="w-[1px] h-full bg-[#6667AB] absolute left-1/2 -translate-x-1/2" />
                    <div className="w-full h-[1px] bg-[#6667AB] absolute top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="relative">
                  <button
                    onClick={handleAboutButtonClick}
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      opacity: aboutButtonHidden ? 0 : 1,
                      transition: 'all 0.3s'
                    }}
                    className="px-6 sm:px-8 py-3 text-xs sm:text-sm font-medium tracking-widest text-[#1C1C1C] border-2 border-[#1C1C1C] hover:bg-[#1C1C1C] hover:text-[#F9F8F6] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    ABOUT ME
                  </button>

                  <div className="hidden sm:block absolute -left-16 top-1/2 -translate-y-1/2 w-2 h-2 pointer-events-none" style={{ opacity: 0.6 }}>
                    <div className="w-[1px] h-full bg-[#FFBE98] absolute left-1/2 -translate-x-1/2" />
                    <div className="w-full h-[1px] bg-[#FFBE98] absolute top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div className="absolute bottom-8 sm:bottom-16 left-1/2 -translate-x-1/2 text-[8px] sm:text-[10px] text-[#1C1C1C]/40 max-w-xs sm:max-w-md text-center px-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                digital: a synthesis of form and function through computational aesthetics
              </div>
            </motion.div>
          </motion.section>
        )}

        {currentScene === 'gallery' && (
          <motion.section
            key="gallery"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 bg-transparent overflow-y-auto"
          >
            <div className="min-h-screen px-4 sm:px-8 md:px-12 py-12 sm:py-16 md:py-20">
              <button
                onClick={() => setCurrentScene('hero')}
                style={{ fontFamily: "'Inter', sans-serif" }}
                className="mb-8 sm:mb-12 px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium tracking-widest text-[#1C1C1C] bg-transparent border-[1px] border-[#1C1C1C]/30 hover:border-[#1C1C1C]/80 transition-colors duration-300 cursor-pointer"
              >
                [ ← BACK TO HOME ]
              </button>

              {loading ? (
                <div className="text-center text-[#1C1C1C]/60">Loading portfolio...</div>
              ) : (
                <>
                  {/* Amazon Section */}
                  {galleryItems.filter(item => item.title.rendered.toLowerCase().startsWith('a')).length > 0 && (
                    <div className="mb-20">
                      <div className="flex items-center justify-center mb-8 sm:mb-10 md:mb-12 gap-4 sm:gap-6 md:gap-8">
                        <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#6667AB]/30 to-[#6667AB]/30" />
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-wider text-[#1C1C1C]" style={{ fontFamily: "'Playfair Display', serif" }}>
                          Amazon
                        </h2>
                        <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#6667AB]/30 to-[#6667AB]/30" />
                      </div>
                      <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
                        {galleryItems
                          .filter(item => item.title.rendered.toLowerCase().startsWith('a'))
                          .map((item) => (
                            <div
                              key={item.id}
                              className="break-inside-avoid mb-6 bg-transparent border-[1px] border-[#1C1C1C]/30 hover:border-[#1C1C1C]/80 transition-colors duration-300 rounded-sm overflow-hidden p-2 group"
                            >
                              <img
                                src={item.featured_image_url || `${import.meta.env.BASE_URL}gallery/a1.jpg`}
                                alt={item.title.rendered}
                                className="w-full h-auto block grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Alibaba Section */}
                  {galleryItems.filter(item => item.title.rendered.toLowerCase().startsWith('b')).length > 0 && (
                    <div className="mb-20">
                      <div className="flex items-center justify-center mb-8 sm:mb-10 md:mb-12 gap-4 sm:gap-6 md:gap-8">
                        <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#FFBE98]/40 to-[#FFBE98]/40" />
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-wider text-[#1C1C1C]" style={{ fontFamily: "'Playfair Display', serif" }}>
                          Alibaba
                        </h2>
                        <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#FFBE98]/40 to-[#FFBE98]/40" />
                      </div>
                      <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
                        {galleryItems
                          .filter(item => item.title.rendered.toLowerCase().startsWith('b'))
                          .map((item) => (
                            <div
                              key={item.id}
                              className="break-inside-avoid mb-6 bg-transparent border-[1px] border-[#1C1C1C]/30 hover:border-[#1C1C1C]/80 transition-colors duration-300 rounded-sm overflow-hidden p-2 group"
                            >
                              <img
                                src={item.featured_image_url || `${import.meta.env.BASE_URL}gallery/b1.jpg`}
                                alt={item.title.rendered}
                                className="w-full h-auto block grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Poster Section */}
                  {galleryItems.filter(item => item.title.rendered.toLowerCase().startsWith('p')).length > 0 && (
                    <div className="mb-20">
                      <div className="flex items-center justify-center mb-8 sm:mb-10 md:mb-12 gap-4 sm:gap-6 md:gap-8">
                        <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#1C1C1C]/20 to-[#1C1C1C]/20" />
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-wider text-[#1C1C1C]" style={{ fontFamily: "'Playfair Display', serif" }}>
                          Poster
                        </h2>
                        <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#1C1C1C]/20 to-[#1C1C1C]/20" />
                      </div>
                      <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
                        {galleryItems
                          .filter(item => item.title.rendered.toLowerCase().startsWith('p'))
                          .map((item) => (
                            <div
                              key={item.id}
                              className="break-inside-avoid mb-6 bg-transparent border-[1px] border-[#1C1C1C]/30 hover:border-[#1C1C1C]/80 transition-colors duration-300 rounded-sm overflow-hidden p-2 group"
                            >
                              <img
                                src={item.featured_image_url || `${import.meta.env.BASE_URL}gallery/p1.png`}
                                alt={item.title.rendered}
                                className="w-full h-auto block grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.section>
        )}

        {currentScene === 'about' && (
          <motion.section
            key="about"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 bg-transparent overflow-y-auto"
          >
            <div className="min-h-screen px-4 sm:px-8 md:px-12 py-12 sm:py-16 md:py-20">
              <button
                onClick={() => setCurrentScene('hero')}
                style={{ fontFamily: "'Inter', sans-serif" }}
                className="mb-8 sm:mb-12 px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium tracking-widest text-[#1C1C1C] bg-transparent border-[1px] border-[#1C1C1C]/30 hover:border-[#1C1C1C]/80 transition-colors duration-300 cursor-pointer"
              >
                [ ← BACK TO HOME ]
              </button>

              <div className="max-w-5xl mx-auto">
                {/* Header Section */}
                <div className="flex items-center justify-center mb-12 sm:mb-14 md:mb-16 gap-4 sm:gap-6 md:gap-8">
                  <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#FFBE98]/40 to-[#FFBE98]/40" />
                  <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-wider text-[#1C1C1C]" style={{ fontFamily: "'Playfair Display', serif" }}>
                    ABOUT ME
                  </h2>
                  <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#FFBE98]/40 to-[#FFBE98]/40" />
                </div>

                {/* Profile Section */}
                <div className="flex flex-col md:flex-row gap-8 sm:gap-10 md:gap-12 mb-12 sm:mb-14 md:mb-16 items-center">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full border-2 border-[#1C1C1C]/30 overflow-hidden bg-gradient-to-br from-[#FFBE98]/20 to-[#6667AB]/20 flex items-center justify-center">
                      <div className="text-5xl sm:text-6xl md:text-7xl text-[#1C1C1C]/40" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                        秦炜亮
                      </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 border-2 border-[#6667AB] rounded-full pointer-events-none" style={{ opacity: 0.6 }}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-[1px] h-full bg-[#6667AB]" />
                        <div className="w-full h-[1px] bg-[#6667AB] absolute" />
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="flex-1 space-y-4 sm:space-y-5 md:space-y-6">
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-[#1C1C1C] mb-2" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                        秦炜亮
                      </h3>
                      <p className="text-xs sm:text-sm tracking-wider text-[#1C1C1C]/60" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
                        视觉设计师 · 25岁 · 2年经验 · 深圳
                      </p>
                    </div>

                    <div className="h-[1px] bg-gradient-to-r from-[#6667AB]/30 via-[#FFBE98]/30 to-transparent" />

                    <p className="text-sm sm:text-base leading-relaxed text-[#1C1C1C]/80" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
                      多领域视觉设计师，专注于电商设计、平面设计与UI设计。擅长将3D渲染、AI工具与传统设计相结合，
                      为跨境电商平台打造高转化率的视觉营销体系。熟练运用Cinema 4D、Blender等三维软件，
                      并在工作中积极探索AIGC技术在设计流程中的应用。
                    </p>
                  </div>
                </div>

                {/* Experience Section */}
                <div className="mb-12 sm:mb-14 md:mb-16">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#1C1C1C] mb-6 sm:mb-8" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                    工作经历
                  </h3>
                  <div className="space-y-6 sm:space-y-8">
                    <div className="border-l-2 border-[#6667AB]/30 pl-4 sm:pl-6 py-2">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1 sm:gap-0">
                        <h4 className="text-lg sm:text-xl font-semibold text-[#1C1C1C]" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
                          美工/电商设计师
                        </h4>
                        <span className="text-xs sm:text-sm text-[#1C1C1C]/60" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
                          2025.05 - 至今
                        </span>
                      </div>
                      <p className="text-[#1C1C1C]/70 mb-3 text-sm sm:text-base" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
                        深圳市魔芯科技有限公司
                      </p>
                      <ul className="text-[#1C1C1C]/60 space-y-2 text-sm sm:text-base" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
                        <li>• 主导亚马逊及阿里国际站的视觉营销设计，负责主图视频、A+页面策划与制作</li>
                        <li>• 利用C4D、Blender结合Octane/KeyShot渲染器产出3D产品渲染图及动态演示</li>
                        <li>• 使用ComfyUI的AI生图工作流，开发PDF编辑AI Agent，提升工作效率</li>
                      </ul>
                    </div>

                    <div className="border-l-2 border-[#FFBE98]/40 pl-4 sm:pl-6 py-2">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1 sm:gap-0">
                        <h4 className="text-lg sm:text-xl font-semibold text-[#1C1C1C]" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
                          视觉设计师
                        </h4>
                        <span className="text-xs sm:text-sm text-[#1C1C1C]/60" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
                          2024.04 - 2025.04
                        </span>
                      </div>
                      <p className="text-[#1C1C1C]/70 mb-3 text-sm sm:text-base" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
                        广州豪杰视觉广告公司
                      </p>
                      <ul className="text-[#1C1C1C]/60 space-y-2 text-sm sm:text-base" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
                        <li>• 为天猫和淘宝平台设计主图、直播间背景和详情页，提升产品展示效果</li>
                        <li>• 负责线下合作店铺的海报、三折页等平面物料设计</li>
                        <li>• 与物料印刷部门紧密合作，确保设计精准转化为高质量印刷品</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Skills Section */}
                <div className="mb-12 sm:mb-14 md:mb-16">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#1C1C1C] mb-6 sm:mb-8" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                    专业技能
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                    {['电商设计', '包装设计', 'UI设计', '3D渲染', '视频剪辑', 'AIGC应用'].map((skill, index) => (
                      <div
                        key={index}
                        className="px-4 sm:px-6 py-3 sm:py-4 border-[1px] border-[#1C1C1C]/30 hover:border-[#1C1C1C]/80 transition-colors duration-300 text-center"
                        style={{ fontFamily: "'Noto Sans SC', sans-serif" }}
                      >
                        <span className="text-[#1C1C1C]/80 text-sm sm:text-base">{skill}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 sm:mt-6 text-xs sm:text-sm text-[#1C1C1C]/60" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
                    <p className="mb-2"><span className="font-semibold text-[#1C1C1C]/80">设计软件：</span> Photoshop · Adobe Illustrator · Figma</p>
                    <p><span className="font-semibold text-[#1C1C1C]/80">3D工具：</span> Cinema 4D · Blender · Rhino · Keyshot · Octane</p>
                  </div>
                </div>

                {/* Education Section */}
                <div className="mb-12 sm:mb-14 md:mb-16">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#1C1C1C] mb-6 sm:mb-8" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                    教育背景
                  </h3>
                  <div className="border-l-2 border-[#1C1C1C]/20 pl-4 sm:pl-6 py-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1 sm:gap-0">
                      <h4 className="text-lg sm:text-xl font-semibold text-[#1C1C1C]" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
                        哈尔滨工程大学 (211)
                      </h4>
                      <span className="text-xs sm:text-sm text-[#1C1C1C]/60" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
                        2020.09 - 2024.06
                      </span>
                    </div>
                    <p className="text-[#1C1C1C]/70 text-sm sm:text-base" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
                      本科 · 全日制 · 金融学
                    </p>
                  </div>
                </div>

                {/* Contact Section */}
                <div className="text-center">
                  <div className="inline-block">
                    <h3 className="text-xl sm:text-2xl font-bold text-[#1C1C1C] mb-4 sm:mb-6" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                      联系方式
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center text-xs sm:text-sm" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
                      <a href="mailto:1834095546@qq.com" className="text-[#1C1C1C]/60 hover:text-[#1C1C1C] transition-colors">
                        邮箱
                      </a>
                      <span className="hidden sm:inline text-[#1C1C1C]/30">|</span>
                      <span className="text-[#1C1C1C]/60">1834095546@qq.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
