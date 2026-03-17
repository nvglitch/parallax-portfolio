import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// 数据结构定义
interface PortfolioItem {
  id: number
  imageUrl: string
  aspectRatio: number
  title: string
  mainCategory: 'Graphic Design' | 'E-commerce' | 'Web Design'
  subCategory: 'Posters' | 'Banners' | 'Amazon' | 'Alibaba' | 'Landing Page' | 'Dashboard'
  designPhilosophy: string
  liveLink?: string
}

// Mock 数据 - 使用本地 gallery 图片
const mockData: PortfolioItem[] = [
  // 海报系列 (p1, p2)
  {
    id: 1,
    imageUrl: '/gallery/p1.png',
    aspectRatio: 0.707,
    title: 'Minimalist Concert Poster',
    mainCategory: 'Graphic Design',
    subCategory: 'Posters',
    designPhilosophy: 'This poster embraces the philosophy of "less is more" by stripping away unnecessary elements to focus on pure typographic hierarchy and negative space. The bold sans-serif typeface creates a strong visual anchor, while the subtle gradient adds depth without overwhelming the composition. The design intentionally leaves breathing room to evoke a sense of anticipation and elegance, mirroring the refined atmosphere of a classical concert experience.',
  },
  {
    id: 2,
    imageUrl: '/gallery/p2.png',
    aspectRatio: 0.707,
    title: 'Typography Exploration Poster',
    mainCategory: 'Graphic Design',
    subCategory: 'Posters',
    designPhilosophy: 'This experimental poster pushes the boundaries of typographic expression. Letters become visual elements that transcend their linguistic function, creating abstract patterns that reward close inspection. The design explores the tension between legibility and artistic expression, inviting viewers to engage with text as both message and medium. The monochromatic palette ensures focus remains on form and structure rather than color distraction.',
  },
  // 亚马逊系列 (a1-a5)
  {
    id: 3,
    imageUrl: '/gallery/a1.jpg',
    aspectRatio: 0.707,
    title: 'Smart Home Device Listing',
    mainCategory: 'E-commerce',
    subCategory: 'Amazon',
    designPhilosophy: 'Designed specifically for Amazon\'s marketplace ecosystem, this product image emphasizes clarity and trust. The clean white background ensures the product is the hero, while subtle shadows add dimensionality without distraction. Every element is optimized for mobile-first browsing, with key features highlighted through strategic composition. The design follows Amazon\'s best practices while injecting brand personality through carefully chosen accent colors and modern typography.',
  },
  {
    id: 4,
    imageUrl: '/gallery/a2.jpg',
    aspectRatio: 0.707,
    title: 'Wireless Earbuds A+ Content',
    mainCategory: 'E-commerce',
    subCategory: 'Amazon',
    designPhilosophy: 'This A+ content module tells a visual story that guides customers through product benefits. The vertical layout creates natural reading flow, with each section building on the previous to create a compelling narrative. High-contrast imagery paired with concise copy ensures quick comprehension. The design leverages psychological principles of visual hierarchy to emphasize key selling points while maintaining Amazon\'s conversion-focused aesthetic standards.',
  },
  {
    id: 5,
    imageUrl: '/gallery/a3.jpg',
    aspectRatio: 0.707,
    title: 'Kitchen Appliance Hero Image',
    mainCategory: 'E-commerce',
    subCategory: 'Amazon',
    designPhilosophy: 'This product image combines lifestyle context with technical clarity. The composition places the product in a realistic kitchen environment while maintaining the clean aesthetic Amazon customers expect. Lighting is carefully controlled to highlight product features and create aspirational appeal. The design balances emotional connection with practical information, helping customers visualize the product in their own homes while clearly communicating its functionality.',
  },
  {
    id: 6,
    imageUrl: '/gallery/a4.jpg',
    aspectRatio: 0.707,
    title: 'Premium Electronics Showcase',
    mainCategory: 'E-commerce',
    subCategory: 'Amazon',
    designPhilosophy: 'This design prioritizes product photography excellence with studio-quality lighting and precise color accuracy. The composition uses the rule of thirds to create visual interest while maintaining Amazon\'s clean aesthetic standards. Strategic use of negative space draws attention to key product features and benefits. The image is optimized for both desktop and mobile viewing, ensuring consistent impact across all devices and maintaining high conversion rates.',
  },
  {
    id: 7,
    imageUrl: '/gallery/a5.jpg',
    aspectRatio: 0.707,
    title: 'Lifestyle Product Integration',
    mainCategory: 'E-commerce',
    subCategory: 'Amazon',
    designPhilosophy: 'This approach blends aspirational lifestyle imagery with practical product demonstration. The scene is carefully staged to show the product in authentic use cases while maintaining visual clarity. Color grading creates emotional resonance with target demographics, and the composition guides the eye naturally from context to product details. This design strategy increases customer confidence by helping them visualize ownership and daily use scenarios.',
  },
  // 阿里巴巴系列 (b1-b4)
  {
    id: 8,
    imageUrl: '/gallery/b1.jpg',
    aspectRatio: 0.707,
    title: 'Industrial Equipment Showcase',
    mainCategory: 'E-commerce',
    subCategory: 'Alibaba',
    designPhilosophy: 'Tailored for Alibaba\'s B2B audience, this design emphasizes professionalism and technical credibility. The composition uses grid-based layouts to present multiple product angles and specifications simultaneously, catering to buyers who need comprehensive information at a glance. The color palette conveys industrial reliability while maintaining visual interest. Every design decision supports the goal of building trust with international wholesale buyers.',
  },
  {
    id: 9,
    imageUrl: '/gallery/b2.jpg',
    aspectRatio: 0.707,
    title: 'Textile Supplier Banner',
    mainCategory: 'E-commerce',
    subCategory: 'Alibaba',
    designPhilosophy: 'This banner design bridges cultural aesthetics for a global marketplace. The layout accommodates both English and potential secondary language text, with flexible spacing that maintains balance regardless of content length. Material textures are showcased through high-quality photography that demonstrates product quality. The design system is modular, allowing for easy adaptation across different product categories while maintaining brand consistency.',
  },
  {
    id: 10,
    imageUrl: '/gallery/b3.jpg',
    aspectRatio: 0.707,
    title: 'Manufacturing Capability Display',
    mainCategory: 'E-commerce',
    subCategory: 'Alibaba',
    designPhilosophy: 'This design communicates scale and production capacity to wholesale buyers. The visual hierarchy emphasizes certifications, quality control processes, and manufacturing infrastructure. Photography showcases both macro product details and wide-angle facility shots to build credibility. The layout is information-dense yet organized, reflecting the serious nature of B2B transactions while maintaining visual appeal that stands out in crowded marketplace listings.',
  },
  {
    id: 11,
    imageUrl: '/gallery/b4.jpg',
    aspectRatio: 0.707,
    title: 'Export-Ready Product Presentation',
    mainCategory: 'E-commerce',
    subCategory: 'Alibaba',
    designPhilosophy: 'Designed for international trade contexts, this presentation emphasizes packaging, shipping readiness, and bulk order visualization. The composition shows products in various quantities and configurations to help buyers understand MOQ options. Technical specifications are integrated seamlessly with lifestyle imagery. The design builds confidence in logistics capabilities while maintaining the premium aesthetic that differentiates quality suppliers in competitive categories.',
  },
]

export default function Portfolio() {
  const [mainFilter, setMainFilter] = useState<string>('All')
  const [subFilter, setSubFilter] = useState<string>('All')
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null)

  const mainCategories = ['All', ...Array.from(new Set(mockData.map(item => item.mainCategory)))]

  const getSubCategories = () => {
    if (mainFilter === 'All') return []
    const filtered = mockData.filter(item => item.mainCategory === mainFilter)
    return ['All', ...Array.from(new Set(filtered.map(item => item.subCategory)))]
  }

  const filteredData = mockData.filter(item => {
    if (mainFilter !== 'All' && item.mainCategory !== mainFilter) return false
    if (subFilter !== 'All' && item.subCategory !== subFilter) return false
    return true
  })

  useEffect(() => {
    setSubFilter('All')
  }, [mainFilter])

  return (
    <>
      <div className="mb-12 space-y-6">
        <div className="flex flex-wrap gap-3 justify-center">
          {mainCategories.map(category => (
            <button
              key={category}
              onClick={() => setMainFilter(category)}
              className={`px-6 py-2 text-sm font-medium tracking-wider transition-all duration-300 ${
                mainFilter === category
                  ? 'bg-[#1C1C1C] text-[#F9F8F6] border-[#1C1C1C]'
                  : 'bg-transparent text-[#1C1C1C] border-[#1C1C1C]/30 hover:border-[#1C1C1C]/80'
              } border-[1px]`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {category}
            </button>
          ))}
        </div>

        {mainFilter !== 'All' && getSubCategories().length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 justify-center"
          >
            {getSubCategories().map(category => (
              <button
                key={category}
                onClick={() => setSubFilter(category)}
                className={`px-4 py-1.5 text-xs font-medium tracking-wider transition-all duration-300 ${
                  subFilter === category
                    ? 'bg-[#6667AB] text-white border-[#6667AB]'
                    : 'bg-transparent text-[#1C1C1C]/70 border-[#1C1C1C]/20 hover:border-[#6667AB]/50'
                } border-[1px]`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {category}
              </button>
            ))}
          </motion.div>
        )}
      </div>

      <motion.div
        layout
        className="columns-1 md:columns-2 lg:columns-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredData.map(item => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="break-inside-avoid mb-6 cursor-pointer group"
              onClick={() => setSelectedItem(item)}
            >
              <div className="relative overflow-hidden bg-transparent border-[1px] border-[#1C1C1C]/30 hover:border-[#1C1C1C]/80 transition-all duration-300 p-2">
                <div className="relative overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-auto block transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{
                      filter: 'saturate(120%) contrast(105%)',
                      aspectRatio: item.aspectRatio,
                      objectFit: 'contain',
                    }}
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      mixBlendMode: 'soft-light',
                      opacity: 0.06,
                      backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
                    }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
            onClick={() => setSelectedItem(null)}
            style={{
              backdropFilter: 'blur(20px)',
              backgroundColor: 'rgba(249, 248, 246, 0.85)',
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-6xl max-h-[90vh] bg-[#F9F8F6] border-2 border-[#1C1C1C]/30 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-[#1C1C1C] text-[#F9F8F6] hover:bg-[#1C1C1C]/80 transition-colors"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                ✕
              </button>

              <div className="flex flex-col lg:flex-row h-full overflow-y-auto">
                <div className="lg:w-1/2 flex items-center justify-center p-8 bg-[#FAFAFA]">
                  <img
                    src={selectedItem.imageUrl}
                    alt={selectedItem.title}
                    className="w-full h-auto max-h-[70vh] object-contain"
                    style={{
                      filter: 'saturate(120%) contrast(105%)',
                    }}
                  />
                </div>

                <div className="lg:w-1/2 p-8 lg:p-12 space-y-6 overflow-y-auto">
                  <div className="flex flex-wrap gap-2">
                    <span
                      className="px-3 py-1 text-xs font-medium tracking-wider bg-[#6667AB] text-white"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {selectedItem.mainCategory}
                    </span>
                    <span
                      className="px-3 py-1 text-xs font-medium tracking-wider bg-[#FFBE98] text-[#1C1C1C]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {selectedItem.subCategory}
                    </span>
                  </div>

                  <h2
                    className="text-3xl sm:text-4xl font-bold text-[#1C1C1C] leading-tight"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {selectedItem.title}
                  </h2>

                  <div className="h-[1px] bg-gradient-to-r from-[#1C1C1C]/30 to-transparent" />

                  <div>
                    <h3
                      className="text-sm font-semibold tracking-widest text-[#1C1C1C]/60 mb-3"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      DESIGN PHILOSOPHY
                    </h3>
                    <p
                      className="text-base leading-relaxed text-[#1C1C1C]/80"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {selectedItem.designPhilosophy}
                    </p>
                  </div>

                  {selectedItem.liveLink && (
                    <a
                      href={selectedItem.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-6 py-3 text-sm font-medium tracking-widest text-[#F9F8F6] bg-[#1C1C1C] hover:bg-[#1C1C1C]/80 transition-colors"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      VIEW LIVE SITE →
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}