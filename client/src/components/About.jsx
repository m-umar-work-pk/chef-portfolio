import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

export default function About() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [stats, setStats] = useState([
    { num: '10+', label: 'Years Experience' },
    { num: '500+', label: 'Recipes Created' },
    { num: '15+', label: 'Awards Won' },
    { num: '50K+', label: 'Happy Clients' },
  ])

  useEffect(() => {
    Promise.all([
      fetch('/api/experience').then(r => r.json()).catch(() => null),
      fetch('/api/dishes').then(r => r.json()).catch(() => null),
    ]).then(([expData, dishData]) => {
      const newStats = [...stats]
      if (expData?.success && expData.data.length > 0) {
        const years = expData.data.map(e => parseInt(e.year)).filter(Boolean)
        if (years.length > 0) {
          const earliest = Math.min(...years)
          const expYears = new Date().getFullYear() - earliest
          newStats[0] = { num: expYears + '+', label: 'Years Experience' }
        }
        newStats[2] = { num: expData.count + '+', label: 'Experience Entries' }
      }
      if (dishData?.success) {
        newStats[1] = { num: dishData.count + '+', label: 'Recipes Created' }
      }
      setStats(newStats)
    })
  }, [])

  return (
    <section id="about" className="section-padding relative" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7 }}
            className="relative order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] card-dark p-1.5">
              <div className="w-full h-full rounded-xl overflow-hidden relative">
                <img src="/images/chief-umair.jpg" alt="Chief Muhammad Umair" className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = '/images/chief-umair-placeholder.svg' }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="font-heading text-xl font-bold text-white">Muhammad Umair</p>
                  <p className="text-gold text-xs tracking-widest uppercase mt-1">Executive Chef</p>
                </div>
              </div>
            </div>
            <div className="absolute -top-3 -right-3 w-20 h-20 border border-gold/15 rounded-xl" />
            <div className="absolute -bottom-3 -left-3 w-24 h-24 border border-gold/10 rounded-xl" />
          </motion.div>

          {/* Content */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay: 0.2 }}
            className="order-1 lg:order-2">
            <span className="text-gold text-xs tracking-[4px] uppercase">About Me</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-3 mb-2">
              A Passion for <span className="text-gradient">Culinary Perfection</span>
            </h2>
            <div className="line-accent mb-8" />

            <div className="space-y-4 text-gray-400 leading-relaxed">
              <p>
                With over a decade of culinary expertise, I have mastered the art of blending traditional flavors with contemporary techniques. My journey from a passionate home cook to an award-winning executive chef is nothing short of remarkable.
              </p>
              <p>
                Specializing in Italian, Continental, and Pakistani cuisines, I bring a unique fusion perspective that has delighted over 50,000 diners worldwide. My philosophy is simple: every dish tells a story, and every meal should be an unforgettable experience.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              {stats.map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.1 }} className="card-dark rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-gradient font-heading">{stat.num}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
