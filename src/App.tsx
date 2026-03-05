import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'

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
  const [currentScene, setCurrentScene] = useState<'hero' | 'gallery'>('hero')

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

  const galleryItems = [
    { img: 1, aspect: '210/297' },
    { img: 2, aspect: '210/297' },
    { img: 3, aspect: '210/297' },
    { img: 4, aspect: '210/297' },
    { img: 5, aspect: '210/297' },
    { img: 6, aspect: '210/297' },
    { img: 7, aspect: '210/297' },
  ]

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#F9F8F6]">
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />

      <motion.div className="fixed inset-0 pointer-events-none z-0" style={{ x: springBlurX, y: springBlurY }}>
        <div
          className="absolute top-1/4 left-1/4 w-[800px] h-[800px] rounded-full opacity-40"
          style={{
            background: 'radial-gradient(circle, #FFBE98 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-[900px] h-[900px] rounded-full opacity-35"
          style={{
            background: 'radial-gradient(circle, #6667AB 0%, transparent 70%)',
            filter: 'blur(100px)',
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
              <div className="relative">
                <h1 className="text-8xl font-bold tracking-wider text-[#1C1C1C] select-none" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {text.split('').map((char, i) => (
                    <Letter key={i} char={char} mouseX={mouseX} mouseY={mouseY} onExplode={createExplosion} />
                  ))}
                </h1>

                <div className="absolute -left-20 top-0 w-4 h-4 border border-[#6667AB] rounded-full pointer-events-none" style={{ opacity: 0.6 }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[1px] h-full bg-[#6667AB]" />
                    <div className="w-full h-[1px] bg-[#6667AB] absolute" />
                  </div>
                </div>

                <svg className="absolute -left-20 top-2 w-16 h-1 pointer-events-none" style={{ opacity: 0.6 }}>
                  <line x1="0" y1="0" x2="64" y2="0" stroke="#6667AB" strokeWidth="1" strokeDasharray="2,2" />
                </svg>

                <div className="absolute -right-24 bottom-4 text-[8px] text-[#6667AB] font-mono pointer-events-none" style={{ opacity: 0.5 }}>
                  coordinates: 0x4A7B
                </div>
              </div>

              <div className="relative">
                <button
                  onClick={handleButtonClick}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    opacity: buttonHidden ? 0 : 1,
                    transition: 'all 0.3s'
                  }}
                  className="px-8 py-3 text-sm font-medium tracking-widest text-[#1C1C1C] border-2 border-[#1C1C1C] hover:bg-[#1C1C1C] hover:text-[#F9F8F6] transition-colors cursor-pointer"
                >
                  VIEW WORKS
                </button>

                <div className="absolute -right-16 top-1/2 -translate-y-1/2 w-2 h-2 pointer-events-none" style={{ opacity: 0.6 }}>
                  <div className="w-[1px] h-full bg-[#6667AB] absolute left-1/2 -translate-x-1/2" />
                  <div className="w-full h-[1px] bg-[#6667AB] absolute top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-[10px] text-[#1C1C1C]/40 max-w-md text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
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
            <div className="min-h-screen px-12 py-20">
              <button
                onClick={() => setCurrentScene('hero')}
                style={{ fontFamily: "'Inter', sans-serif" }}
                className="mb-12 px-6 py-2 text-sm font-medium tracking-widest text-[#1C1C1C] bg-transparent border-[1px] border-[#1C1C1C]/30 hover:border-[#1C1C1C]/80 transition-colors duration-300 cursor-pointer"
              >
                [ ← BACK TO HOME ]
              </button>

              <div className="mb-8 h-6 pointer-events-none" style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 8px, #6667AB 8px, #6667AB 9px)',
                opacity: 0.15
              }} />

              <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
                {galleryItems.map((item, i) => (
                  <div
                    key={i}
                    className="break-inside-avoid mb-6 bg-transparent border-[1px] border-[#1C1C1C]/30 hover:border-[#1C1C1C]/80 transition-colors duration-300 rounded-sm overflow-hidden p-2 group"
                  >
                    <img
                      src={`${import.meta.env.BASE_URL}gallery/${item.img}.jpg`}
                      alt={`Gallery ${item.img}`}
                      className="w-full h-auto block grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
