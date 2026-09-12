/* The background IS the entrainment tool: a warm charcoal field with a
   slow-turning color wheel (Recharge -> Regroup -> Recoup) top-center and
   dashed orbit arcs sweeping the sides, echoing the reference deck. Fixed
   behind all content, non-interactive, and fully still under
   prefers-reduced-motion (handled in globals.css). */
export function EntrainmentBackground() {
  const dots = Array.from({ length: 24 })

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{
        background:
          'radial-gradient(120% 90% at 50% 0%, #363230 0%, #2b2825 45%, #1a1816 100%)',
      }}
    >
      {/* dashed orbit arcs, drifting slowly */}
      <div className="entrain-orbit absolute left-1/2 top-[18vmin] -translate-x-1/2">
        <div className="h-[150vmin] w-[150vmin] rounded-full border border-dashed border-paper/10" />
      </div>
      <div className="entrain-orbit absolute left-1/2 top-[10vmin] -translate-x-1/2">
        <div className="h-[110vmin] w-[110vmin] rounded-full border border-dashed border-paper/[0.07]" />
      </div>

      {/* the entrainment wheel, top-center */}
      <div className="absolute left-1/2 top-[6vmin] flex h-[34vmin] w-[34vmin] -translate-x-1/2 items-center justify-center md:top-[8vmin]">
        <div
          className="entrain-glow absolute inset-[-30%] rounded-full blur-3xl"
          style={{
            background:
              'conic-gradient(from 90deg, #dba847, #e8dfa0, #b9c4dd, #7a94d6, #3a5a9c, #8f6fb0, #c96f5a, #dba847)',
            opacity: 0.5,
          }}
        />
        <div
          className="entrain-wheel absolute inset-0 rounded-full"
          style={{
            background:
              'conic-gradient(from 90deg, #dba847, #e8dfa0, #b9c4dd, #7a94d6, #3a5a9c, #8f6fb0, #c96f5a, #dba847)',
            opacity: 0.92,
            maskImage: 'radial-gradient(circle, #000 62%, transparent 63%)',
            WebkitMaskImage: 'radial-gradient(circle, #000 62%, transparent 63%)',
          }}
        />
        {/* the white dot ring around the wheel */}
        <div className="absolute inset-0">
          {dots.map((_, i) => {
            const angle = (i / dots.length) * 360
            return (
              <span
                key={i}
                className="absolute left-1/2 top-1/2 h-[1.6%] w-[1.6%] rounded-full bg-paper/85"
                style={{
                  transform: `rotate(${angle}deg) translateY(-50%) translateY(-15.5vmin)`,
                }}
              />
            )
          })}
        </div>
      </div>

      {/* soft vignette + bottom fade so long-form text stays legible */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(130% 100% at 50% 8%, transparent 30%, rgba(20,18,16,0.55) 62%, rgba(20,18,16,0.92) 100%)',
        }}
      />
    </div>
  )
}
