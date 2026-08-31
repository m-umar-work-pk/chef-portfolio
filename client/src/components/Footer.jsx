import { useState } from 'react'
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaPaperPlane, FaArrowUp } from 'react-icons/fa'

const links = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Experience', href: '#experience' },
  { name: 'Menu', href: '#menu' },
  { name: 'Contact', href: '#contact' },
]

const socials = [
  { icon: FaInstagram, href: '#', label: 'Instagram' },
  { icon: FaFacebook, href: '#', label: 'Facebook' },
  { icon: FaTwitter, href: '#', label: 'Twitter' },
  { icon: FaYoutube, href: '#', label: 'YouTube' },
]

export default function Footer() {
  const [email, setEmail] = useState('')

  return (
    <footer className="relative bg-[#080810] border-t border-gold/5">
      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-r from-gold-dark to-gold flex items-center justify-center text-[#0a0a0f] hover:shadow-lg hover:shadow-gold/20 transition-all hover:-translate-y-1">
        <FaArrowUp size={14} />
      </button>

      <div className="max-w-7xl mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gold/20">
                <img src="/images/chief-umair.jpg" alt="Chief Umair" className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = '/images/chief-umair-placeholder.svg' }} />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-gradient">Ch
                  ef Umair</h3>
                <p className="text-[8px] tracking-[2px] uppercase text-gold/40">Culinary Excellence</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Crafting culinary masterpieces with passion, precision, and a decade of world-class experience.
            </p>
            <div className="flex gap-2">
              {socials.map((s, i) => (
                <a key={i} href={s.href}
                  className="w-9 h-9 rounded-full card-dark flex items-center justify-center text-gray-500 hover:text-gold transition-all"
                  aria-label={s.label}>
                  <s.icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-white mb-4 text-sm">Quick Links</h4>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-500 text-sm hover:text-gold transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 bg-gold/30 rounded-full" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-white mb-4 text-sm">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>203 RB , Manawala</li>
              <li>Faisalabad , Pakistan</li>
              <li className="text-gold">+92 329 1923525</li>
              <li>mumairchef@gmail.com</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-heading font-bold text-white mb-4 text-sm">Newsletter</h4>
            <p className="text-gray-500 text-sm mb-4">Subscribe for recipes and exclusive updates.</p>
            <form onSubmit={(e) => { e.preventDefault(); setEmail('') }} className="flex gap-2">
              <input type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-dark-lighter border border-gold/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold/30 transition-all" />
              <button type="submit"
                className="w-10 h-10 rounded-lg bg-gradient-to-r from-gold-dark to-gold flex items-center justify-center text-[#0a0a0f] flex-shrink-0 hover:shadow-lg hover:shadow-gold/20 transition-all">
                <FaPaperPlane size={12} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gold/5 pt-6 text-center">
          <p className="text-gray-600 text-xs">
            &copy; {new Date().getFullYear()} Chef Muhammad Umair. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
