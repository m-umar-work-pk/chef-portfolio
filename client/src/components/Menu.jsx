import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { FaTimes } from 'react-icons/fa'

const categories = ['All', 'Appetizer', 'Main Course', 'Dessert', 'Special']

const defaultEmojiMap = {
  Appetizer: '\uD83C\uDF7D\uFE0F',
  'Main Course': '\uD83C\uDF5B',
  Dessert: '\uD83C\uDF6E',
  Special: '\uD83D\uDC68\u200D\uD83C\uDF73',
  Beverage: '\uD83C\uDF79',
}

const gradientMap = {
  Appetizer: 'from-red-400 to-orange-300',
  'Main Course': 'from-amber-600 to-red-500',
  Dessert: 'from-yellow-100 to-amber-200',
  Special: 'from-purple-500 via-pink-500 to-amber-400',
  Beverage: 'from-blue-400 to-cyan-300',
}

const fallbackDishes = [
  {
    id: 1,
    name: 'Bruschetta Trio',
    description: 'Classic tomato basil, wild mushroom, and roasted pepper bruschetta with aged balsamic',
    category: 'Appetizer',
    ingredients: ['Tomato', 'Basil', 'Bread'],
    featured: false,
    image: '',
  },
  {
    id: 2,
    name: 'Lamb Shank Risotto',
    description: 'Braised lamb shank over creamy arborio risotto with rosemary and parmesan',
    category: 'Main Course',
    ingredients: ['Lamb', 'Risotto', 'Rosemary'],
    featured: true,
    image: '',
  },
  {
    id: 3,
    name: 'Tiramisu',
    description: 'Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone',
    category: 'Dessert',
    ingredients: ['Mascarpone', 'Coffee', 'Ladyfingers'],
    featured: true,
    image: '',
  },
  {
    id: 4,
    name: 'Signature Tasting Menu',
    description: 'A seven-course culinary journey with wine pairings curated by our head chef',
    category: 'Special',
    ingredients: ['Chef Selection', 'Wine Pairing', 'Seven Courses'],
    featured: true,
    image: '',
  },
]

export default function Menu() {
  const [dishes, setDishes] = useState([])
  const [active, setActive] = useState('All')
  const [selectedDish, setSelectedDish] = useState(null)
  const [loading, setLoading] = useState(true)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const res = await fetch('/api/dishes')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setDishes(data.data || fallbackDishes)
      } catch {
        setDishes(fallbackDishes)
      } finally {
        setLoading(false)
      }
    }
    fetchDishes()
  }, [])

  const filtered = active === 'All' ? dishes : dishes.filter((d) => d.category === active)

  return (
    <section id="menu" className="section-padding relative bg-[#0a0a0f]" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
          className="text-center mb-12">
          <span className="text-gold text-xs tracking-[4px] uppercase">Our Menu</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-white mt-3">
            Culinary <span className="text-gradient">Creations</span>
          </h2>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto text-sm">
            Each dish is a masterpiece, carefully crafted with the finest ingredients and artistic flair.
          </p>
          <div className="line-accent mx-auto mt-4" />
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActive(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                active === cat
                  ? 'bg-gradient-to-r from-gold-dark to-gold text-[#0a0a0f] shadow-lg shadow-gold/20'
                  : 'card-dark text-gray-400 hover:text-gold'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((dish, i) => {
              const emoji = defaultEmojiMap[dish.category] || '\uD83C\uDF7D\uFE0F'
              const gradient = gradientMap[dish.category] || 'from-gray-500 to-gray-700'
              const ingredients = (dish.ingredients || []).slice(0, 3)

              return (
                <motion.div key={dish.id} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.05 }}
                  className="card-dark rounded-2xl overflow-hidden group cursor-pointer"
                  onClick={() => setSelectedDish(dish)}>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {dish.image ? (
                      <img src={dish.image} alt={dish.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center transition-transform duration-700 group-hover:scale-110`}>
                        <span className="text-6xl transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12">{emoji}</span>
                      </div>
                    )}
                    {dish.featured && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-gold-dark to-gold text-[#0a0a0f] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Chef&apos;s Pick
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-[#0a0a0f]/70 backdrop-blur-sm text-gold text-[10px] font-medium px-3 py-1 rounded-full border border-gold/20">
                      {dish.category}
                    </div>
                    <div className="absolute inset-0 bg-[#0a0a0f]/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-gold text-sm font-medium tracking-wider uppercase border border-gold/50 px-5 py-2 rounded-full">
                        View Details
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading text-lg font-bold text-white group-hover:text-gold transition-colors">{dish.name}</h3>
                    <p className="text-gray-500 text-sm mt-2 leading-relaxed line-clamp-2">{dish.description}</p>
                    {ingredients.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {ingredients.map((ing, idx) => (
                          <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-gold/10 text-gold/70 border border-gold/10">
                            {ing}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedDish && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
            onClick={() => setSelectedDish(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="card-dark rounded-2xl w-full max-w-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}>
              <div className="relative aspect-video overflow-hidden">
                {selectedDish.image ? (
                  <img src={selectedDish.image} alt={selectedDish.name} className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${gradientMap[selectedDish.category] || 'from-gray-500 to-gray-700'} flex items-center justify-center`}>
                    <span className="text-8xl">{defaultEmojiMap[selectedDish.category] || '🍽️'}</span>
                  </div>
                )}
                <button onClick={() => setSelectedDish(null)}
                  className="absolute top-3 right-3 w-10 h-10 rounded-full bg-[#0a0a0f]/70 backdrop-blur-sm flex items-center justify-center text-white hover:text-gold transition-colors border border-white/10">
                  <FaTimes />
                </button>
                {selectedDish.featured && (
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-gold-dark to-gold text-[#0a0a0f] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Chef&apos;s Pick
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-heading text-2xl font-bold text-white">{selectedDish.name}</h3>
                  <span className="text-xs bg-gold/10 text-gold px-3 py-1 rounded-full border border-gold/20 flex-shrink-0 ml-3">
                    {selectedDish.category}
                  </span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{selectedDish.description}</p>
                {selectedDish.ingredients && selectedDish.ingredients.length > 0 && (
                  <div>
                    <p className="text-gold text-xs font-medium tracking-wider uppercase mb-2">Ingredients</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedDish.ingredients.map((ing, idx) => (
                        <span key={idx} className="text-xs px-3 py-1 rounded-full bg-gold/10 text-gold/80 border border-gold/15">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {selectedDish.recipe && (
                  <div className="mt-4">
                    <p className="text-gold text-xs font-medium tracking-wider uppercase mb-2">Recipe</p>
                    <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">{selectedDish.recipe}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
