/**
 * NoiseOverlay - 全局噪点质感层
 * 用于消除"发灰"的廉价感，提升整体视觉质感
 */
export default function NoiseOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-50"
      style={{
        mixBlendMode: 'overlay',
        opacity: 0.08,
      }}
    >
      <svg className="w-full h-full">
        <filter id="premium-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#premium-noise)" />
      </svg>
    </div>
  )
}
