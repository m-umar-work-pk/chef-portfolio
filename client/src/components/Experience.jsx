import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

const fallbackTimeline = [
  { year: '2014', title: 'Culinary Academy', description: 'Graduated top of class from Le Cordon Bleu with honors' },
  { year: '2016', title: 'Junior Chef', description: 'Refined French cuisine techniques at Le Petit Bistro, Paris' },
  { year: '2018', title: 'Sous Chef', description: 'Led kitchen operations for 200+ covers daily at The Grand Hotel' },
  { year: '2020', title: 'Executive Chef', description: 'Promoted to Executive Chef, managing full kitchen brigade of 15+' },
  { year: '2022', title: 'Culinary Consultant', description: 'Opened own restaurant and consulting for top hotels in Karachi' },
  { year: '2024', title: 'Award-Winning Chef', description: 'Recognized among Top 100 Chefs globally' },
]

export default function Experience() {
  const [timeline, setTimeline] = useState(fallbackTimeline)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    fetch('/api/experience')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.length > 0) setTimeline(data.data)
      })
      .catch(() => {})
  }, [])

  return (
    <section id="experience" className="section-padding relative bg-[#0d0d14]" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
          className="text-center mb-16">
          <span className="text-gold text-xs tracking-[4px] uppercase">Career Path</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-3">
            Work <span className="text-gradient">Experience</span>
          </h2>
          <div className="line-accent mx-auto mt-4" />
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold/40 via-gold/20 to-transparent" />

          {timeline.map((item, i) => (
            <motion.div key={item._id || item.year + i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.15 }}
              className={`relative flex items-center mb-10 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 bg-gold rounded-full border-4 border-[#0d0d14] z-10" />
              <div className={`ml-12 md:ml-0 md:w-5/12 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                <div className="card-dark rounded-xl p-6">
                  <span className="text-gold text-sm font-bold tracking-wider">{item.year}</span>
                  <h3 className="text-lg font-heading font-bold text-white mt-1">{item.title}</h3>
                  <p className="text-gray-400 text-sm mt-2 leading-relaxed">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
