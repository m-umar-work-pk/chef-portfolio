import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function Hero() {
  const [mounted, setMounted] = useState(false)
  const [stats, setStats] = useState({ years: '10+', recipes: '500+', clients: '50K+' })

  useEffect(() => {
    setMounted(true)
    Promise.all([
      fetch('/api/experience').then(r => r.json()).catch(() => null),
      fetch('/api/dishes').then(r => r.json()).catch(() => null),
    ]).then(([expData, dishData]) => {
      const newStats = { ...stats }
      if (expData?.success && expData.data.length > 0) {
        const years = expData.data.map(e => parseInt(e.year)).filter(Boolean)
        if (years.length > 0) {
          const earliest = Math.min(...years)
          const expYears = new Date().getFullYear() - earliest
          newStats.years = expYears + '+'
        }
      }
      if (dishData?.success) {
        newStats.recipes = dishData.count + '+'
      }
      setStats(newStats)
    })
  }, [])

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0f0f1a] to-[#0a0a0f]" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-gold/3 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gold/2 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-16">
          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={mounted ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }}>
              <span className="inline-block py-2 px-5 rounded-full border border-gold/20 text-gold text-xs font-medium tracking-[3px] uppercase mb-6">
                Executive Chief
              </span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={mounted ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4 }}
              className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="text-white">Crafting </span>
              <span className="text-gradient">Culinary</span><br />
              <span className="text-white">Excellence</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 30 }} animate={mounted ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.6 }}
              className="text-gray-400 text-base md:text-lg max-w-lg mb-4">
              A decade of culinary mastery, blending traditional flavors with modern techniques to create unforgettable dining experiences.
            </motion.p>

            <motion.p initial={{ opacity: 0, y: 30 }} animate={mounted ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.7 }}
              className="text-gold font-medium text-lg md:text-xl mb-8">
              Muhammad Umair
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={mounted ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="#menu" className="btn-gold text-center">Explore Menu</a>
              <a href="#contact" className="btn-outline text-center">Contact Me</a>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={mounted ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1 }}
              className="mt-12 grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
              {[
                { num: stats.years, label: 'Years Exp.' },
                { num: stats.recipes, label: 'Recipes' },
                { num: stats.clients, label: 'Happy Clients' },
              ].map((s, i) => (
                <div key={i} className="text-center lg:text-left">
                  <p className="text-2xl md:text-3xl font-bold text-gradient font-heading">{s.num}</p>
                  <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Profile Image */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={mounted ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.3, duration: 0.8 }}
            className="flex-shrink-0">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[380px] lg:h-[380px]">
              {/* Outer glow */}
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-gold/20 via-gold/5 to-gold/20 blur-sm" />
              {/* Gold ring */}
              <div className="absolute inset-0 rounded-full border-[3px] border-gold/40" />
              <div className="absolute inset-1 rounded-full border border-gold/15" />
              {/* Image */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <img src="/images/chief-umair.jpg" alt="Choef Muhammad Umair" className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = '/images/chief-umair-placeholder.svg' }} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={mounted ? { opacity: 1 } : {}} transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <a href="#about" className="flex flex-col items-center gap-2 text-gray-500 hover:text-gold transition-colors">
          <span className="text-[10px] tracking-[3px] uppercase">Scroll</span>
          <div className="w-5 h-8 border border-gold/20 rounded-full flex justify-center pt-1.5">
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-1 bg-gold rounded-full" />
          </div>
        </a>
      </motion.div>
    </section>
  )
}
