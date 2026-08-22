import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

const fallbackSkills = [
  { name: 'Pakistani Cuisine', emoji: '🇵🇰', level: 98 },
  { name: 'Italian Cuisine', emoji: '🇮🇹', level: 95 },
  { name: 'Continental Cuisine', emoji: '🌍', level: 92 },
  { name: 'French Techniques', emoji: '🇫🇷', level: 88 },
  { name: 'BBQ and Grill', emoji: '🔥', level: 90 },
  { name: 'Mediterranean', emoji: '🫒', level: 85 },
]

export default function Skills() {
  const [skills, setSkills] = useState(fallbackSkills)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    fetch('/api/skills')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.length > 0) setSkills(data.data)
      })
      .catch(() => {})
  }, [])

  return (
    <section id="skills" className="section-padding relative" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
          className="text-center mb-16">
          <span className="text-gold text-xs tracking-[4px] uppercase">Expertise</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-3">
            Culinary <span className="text-gradient">Skills</span>
          </h2>
          <div className="line-accent mx-auto mt-4" />
        </motion.div>

        {/* Cuisine Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-16">
          {skills.map((s, i) => (
            <motion.div key={s._id || s.name} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="card-dark rounded-xl p-5 text-center group cursor-pointer">
              {s.image ? (
                <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden group-hover:scale-110 transition-transform duration-300">
                  <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {s.emoji || '🍽️'}
                </div>
              )}
              <p className="text-sm font-medium text-gray-300 group-hover:text-gold transition-colors">{s.name}</p>
            </motion.div>
          ))}
        </div>

        {/* Skill Bars */}
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6">
            {skills.map((skill, i) => (
              <motion.div key={skill._id || skill.name} initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1 }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300 text-sm font-medium">{skill.name}</span>
                  <span className="text-gold text-sm font-bold">{skill.level}%</span>
                </div>
                <div className="w-full h-2.5 bg-dark-lighter rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={inView ? { width: skill.level + '%' } : {}}
                    transition={{ duration: 1.2, delay: 0.5 + i * 0.1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-gold-dark via-gold to-gold-light rounded-full" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
