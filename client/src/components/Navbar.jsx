import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Experience', href: '#experience' },
  { name: 'Menu', href: '#menu' },
  { name: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    setIsLoggedIn(!!token)
  }, [])

  const handleClick = () => setMobileOpen(false)

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('admin')
    setIsLoggedIn(false)
    navigate('/')
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#0a0a0f]/90 backdrop-blur-xl shadow-lg shadow-black/30 border-b border-gold/5' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <a href="#home" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-gold/30">
              <img src="/images/chief-umair.jpg" alt="Chief Umair" className="w-full h-full object-cover"
                onError={(e) => { e.target.src = '/images/chief-umair.svg' }} />
            </div>
            <div>
              <h1 className="font-heading text-lg font-bold text-gradient leading-tight">Chef Umair</h1>
              <p className="text-[8px] tracking-[2px] uppercase text-gold/50 -mt-0.5">Culinary Excellence</p>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href}
                className="text-sm font-medium text-gray-400 hover:text-gold transition-colors duration-300 tracking-wide">
                {link.name}
              </a>
            ))}
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <a href="/admin/dashboard" className="text-sm font-medium text-gold hover:text-gold-light transition-colors">
                  Dashboard
                </a>
                <button onClick={handleLogout} className="text-sm font-medium text-gray-400 hover:text-red-400 transition-colors">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <a href="/admin" className="btn-gold text-xs py-2 px-5">Login</a>
              </div>
            )}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-gold text-xl p-2">
            <div className="w-5 flex flex-col gap-1.5">
              <span className={`h-0.5 bg-gold transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`h-0.5 bg-gold transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`h-0.5 bg-gold transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-gold/5">
          <div className="px-4 py-6 space-y-2">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} onClick={handleClick}
                className="block py-3 px-4 text-gray-300 hover:text-gold hover:bg-gold/5 rounded-lg transition-all">
                {link.name}
              </a>
            ))}
            {isLoggedIn ? (
              <>
                <a href="/admin/dashboard" onClick={handleClick} className="block py-3 px-4 text-gold hover:bg-gold/5 rounded-lg transition-all">
                  Dashboard
                </a>
                <button onClick={() => { handleLogout(); handleClick() }} className="block w-full text-left py-3 px-4 text-red-400 hover:bg-red-500/5 rounded-lg transition-all">
                  Logout
                </button>
              </>
            ) : (
              <a href="/admin" onClick={handleClick} className="block text-center btn-gold mt-4">Login</a>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
