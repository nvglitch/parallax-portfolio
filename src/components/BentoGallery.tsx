import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface GalleryItem {
  id: number
  title: { rendered: string }
  featured_image_url?: string | null
  meta: {
    aspect_ratio: string
    order: number
  }
}

interface BentoGalleryProps {
  items: GalleryItem[]
  title: string
  accentColor: string
}

export default function BentoGallery({ items, title, accentColor }: BentoGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  useEffect(() => {
    if (!containerRef.current || items.length === 0) return

    const timer = setTimeout(() => {
      const cards = containerRef.current?.querySelectorAll('.gallery-card')
      if (!cards || cards.length === 0) return

      // 入场动画
      gsap.from(cards, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power4.out',
        stagger: 0.1,
        clearProps: 'all',
      })

      // 图片内部视差
      cards.forEach((card) => {
        const img = card.querySelector('.parallax-img')
        if (!img) return

        gsap.to(img, {
          yPercent: -15,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        })
      })
    }, 100)

    return () => {
      clearTimeout(timer)
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [items])

  return (
    <div className="mb-20">
      {/* 标题分隔线 */}
      <div className="flex items-center justify-center mb-8 sm:mb-10 md:mb-12 gap-4 sm:gap-6 md:gap-8">
        <div
          className="flex-1 h-[1px]"
          style={{
            background: `linear-gradient(to right, transparent, ${accentColor}30, ${accentColor}30)`,
          }}
        />
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-wider text-[#1C1C1C]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {title}
        </h2>
        <div
          className="flex-1 h-[1px]"
          style={{
            background: `linear-gradient(to left, transparent, ${accentColor}30, ${accentColor}30)`,
          }}
        />
      </div>

      {/* 瀑布流布局 */}
      <div ref={containerRef} className="columns-1 md:columns-2 lg:columns-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="gallery-card break-inside-avoid mb-6 bg-transparent border-[1px] border-[#1C1C1C]/30 hover:border-[#1C1C1C]/80 transition-colors duration-300 rounded-sm overflow-hidden p-2 group"
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="relative overflow-hidden">
              <img
                src={item.featured_image_url || '/gallery/placeholder.jpg'}
                alt={item.title.rendered}
                className="parallax-img w-full h-auto block transition-all duration-700 ease-out"
                style={{
                  filter: 'saturate(120%) contrast(105%)',
                  transform: hoveredId === item.id ? 'scale(1.05)' : 'scale(1)',
                }}
                onError={(e) => {
                  e.currentTarget.src = 'https://picsum.photos/seed/' + item.id + '/800/1200'
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
