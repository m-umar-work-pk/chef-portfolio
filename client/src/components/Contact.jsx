import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa'
import { toast } from 'react-toastify'

const contactInfo = [
  { icon: FaMapMarkerAlt, label: 'Address', value: '203 RB , Manawala , Faisalabad , Pakistan' },
  { icon: FaPhone, label: 'Phone', value: '+92 3291923525' },
  { icon: FaEnvelope, label: 'Email', value: 'pro.chief.umair@gmail.com' },
  { icon: FaClock, label: 'Working Hours', value: 'Mon - Sat: 10:00 AM - 11:00 PM' },
]

const socials = [
  { icon: FaInstagram, href: '#', label: 'Instagram' },
  { icon: FaFacebook, href: '#', label: 'Facebook' },
  { icon: FaTwitter, href: '#', label: 'Twitter' },
  { icon: FaYoutube, href: '#', label: 'YouTube' },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email'
    if (!form.message.trim()) errs.message = 'Message is required'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Message sent successfully!')
        setForm({ name: '', email: '', phone: '', subject: '', message: '' })
      } else {
        toast.error('Failed to send message')
      }
    } catch {
      toast.error('Server error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const inputClass = (field) =>
    `w-full bg-dark-lighter border ${errors[field] ? 'border-red-500' : 'border-gold/10'} rounded-xl px-4 py-3.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-gold/40 transition-all`

  return (
    <section id="contact" className="section-padding relative bg-[#0d0d14]" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
          className="text-center mb-12">
          <span className="text-gold text-xs tracking-[4px] uppercase">Get in Touch</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-3">
            Contact <span className="text-gradient">Chief Umair</span>
          </h2>
          <div className="line-accent mx-auto mt-4" />
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Form */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.2 }}
            className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="card-dark rounded-2xl p-8 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <input type="text" placeholder="Your Name *" value={form.name} onChange={(e) => handleChange('name', e.target.value)} className={inputClass('name')} />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <input type="email" placeholder="Your Email *" value={form.email} onChange={(e) => handleChange('email', e.target.value)} className={inputClass('email')} />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>
              <input type="tel" placeholder="Phone Number" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} className={inputClass('phone')} />
              <input type="text" placeholder="Subject" value={form.subject} onChange={(e) => handleChange('subject', e.target.value)} className={inputClass('subject')} />
              <div>
                <textarea placeholder="Your Message *" rows={5} value={form.message} onChange={(e) => handleChange('message', e.target.value)} className={inputClass('message') + ' resize-none'} />
                {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
              </div>
              <button type="submit" disabled={loading}
                className="btn-gold w-full py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {loading ? (
                  <><span className="w-5 h-5 border-2 border-[#0a0a0f]/30 border-t-[#0a0a0f] rounded-full animate-spin" /> Sending...</>
                ) : 'Send Message'}
              </button>
            </form>
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.4 }}
            className="lg:col-span-2 space-y-4">
            {contactInfo.map((info, i) => (
              <div key={i} className="card-dark rounded-xl p-5 flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-dark to-gold flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <info.icon className="text-[#0a0a0f] text-sm" />
                </div>
                <div>
                  <p className="text-gold text-xs font-medium tracking-wider uppercase">{info.label}</p>
                  <p className="text-gray-400 text-sm mt-1">{info.value}</p>
                </div>
              </div>
            ))}

            <div className="card-dark rounded-xl p-5">
              <p className="text-gold text-xs font-medium tracking-wider uppercase mb-3">Follow Chief Umair</p>
              <div className="flex gap-3">
                {socials.map((s, i) => (
                  <a key={i} href={s.href}
                    className="w-10 h-10 rounded-full bg-dark-lighter flex items-center justify-center text-gray-500 hover:bg-gold hover:text-[#0a0a0f] transition-all duration-300"
                    aria-label={s.label}>
                    <s.icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
