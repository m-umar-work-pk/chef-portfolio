import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      toast.error('Please fill all fields')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        localStorage.setItem('adminToken', data.token)
        localStorage.setItem('admin', JSON.stringify(data.admin))
        toast.success('Login successful!')
        navigate('/admin/dashboard')
      } else {
        toast.error(data.message || 'Login failed')
      }
    } catch {
      toast.error('Server error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl block mb-4">👨‍🍳</span>
          <h1 className="font-heading text-3xl font-bold text-gradient">Admin Panel</h1>
          <p className="text-gray-500 text-sm mt-2">Chef Muhammad Umair Portfolio</p>
        </div>
        <form onSubmit={handleSubmit} className="card-dark rounded-2xl p-8 space-y-5">
          <div>
            <label className="text-gray-400 text-xs tracking-wider uppercase mb-2 block">Email</label>
            <input type="email" placeholder="mumairchef@gmail.com" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-dark-lighter border border-gold/10 rounded-xl px-4 py-3.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-gold/40 transition-all" />
          </div>
          <div>
            <label className="text-gray-400 text-xs tracking-wider uppercase mb-2 block">Password</label>
            <input type="password" placeholder="Enter password" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-dark-lighter border border-gold/10 rounded-xl px-4 py-3.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-gold/40 transition-all" />
          </div>
          <button type="submit" disabled={loading}
            className="btn-gold w-full py-4 disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? (
              <><span className="w-5 h-5 border-2 border-[#0a0a0f]/30 border-t-[#0a0a0f] rounded-full animate-spin" /> Logging in...</>
            ) : 'Login'}
          </button>
        </form>
        <p className="text-center text-gray-600 text-xs mt-6">
          <a href="/" className="text-gold hover:underline">← Back to Portfolio</a>
        </p>
      </div>
    </div>
  )
}
